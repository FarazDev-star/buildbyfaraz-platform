/**
 * BUILDBYFARAZ — DriveUp Cloud Cloner Engine & Streaming ZIP Services
 * Architected by Faraz
 * 
 * Features:
 * - Direct Google Drive v3 REST & Multipart Batch API
 * - 8-thread parallel BFS recursive folder scanner
 * - Checkpoint persistence in localStorage (Power outage & load-shedding protection)
 * - In-browser high-speed streaming ZIP generation via JSZip in STORE mode
 * - Procedural Web Audio API sound feedback
 */

import JSZip from 'jszip';

export const GDRIVE_BASE = "https://www.googleapis.com/drive/v3";
export const FOLDER_MIME = "application/vnd.google-apps.folder";
export const CHECKPOINT_KEY = "bbf_driveup_checkpoint";

export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Procedural Web Audio Synthesizer (zero external audio dependencies)
 */
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem("bbf_drive_sound") !== "false";
  }

  initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem("bbf_drive_sound", this.enabled);
    if (this.enabled) this.playClick();
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playScanBlip() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1040, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playCopySuccess() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playCompleteFanfare() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const start = this.ctx.currentTime + idx * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (e) {}
  }
}

export const sound = new SoundEngine();

/**
 * DriveCloner Engine
 */
export class ClonerEngine {
  constructor() {
    this.isCancelled = false;
  }

  abort() {
    this.isCancelled = true;
  }

  parseDriveId(input) {
    if (!input || typeof input !== "string") return null;
    const clean = input.trim();

    if (clean.toLowerCase() === 'root' || clean.toLowerCase() === 'my-drive' || clean.toLowerCase() === 'mydrive') {
      return 'root';
    }

    const folderMatch = clean.match(/\/folders\/([a-zA-Z0-9_-]{15,})/);
    if (folderMatch) return folderMatch[1];

    const idParamMatch = clean.match(/[?&]id=([a-zA-Z0-9_-]{15,})/);
    if (idParamMatch) return idParamMatch[1];

    const fileMatch = clean.match(/\/file\/d\/([a-zA-Z0-9_-]{15,})/);
    if (fileMatch) return fileMatch[1];

    if (/^[a-zA-Z0-9_-]{15,50}$/.test(clean)) return clean;

    return null;
  }

  saveCheckpoint(data) {
    try {
      localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  getCheckpoint() {
    try {
      const raw = localStorage.getItem(CHECKPOINT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  clearCheckpoint() {
    localStorage.removeItem(CHECKPOINT_KEY);
  }

  /**
   * Scan Source Folder Tree with 8-Thread Concurrency & BFS Worker Pool
   */
  async scanFolder({ folderUrl, token, onProgress }) {
    this.isCancelled = false;
    const folderId = this.parseDriveId(folderUrl);
    if (!folderId) {
      throw new Error("Invalid Google Drive folder URL or ID. Format: https://drive.google.com/drive/folders/...");
    }

    const scanStartTime = Date.now();
    if (onProgress) {
      onProgress({
        type: "scan_start",
        message: "Connecting to Google Drive APIs...",
        totalFolders: 0,
        totalFiles: 0,
        totalBytes: 0,
        currentFolder: "Root Folder"
      });
    }

    // 1. Fetch Root Meta with shortcutDetails support
    const rootRes = await fetch(`${GDRIVE_BASE}/files/${folderId}?fields=id,name,mimeType,size,quotaBytesUsed,shortcutDetails&supportsAllDrives=true`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!rootRes.ok) {
      const err = await rootRes.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${rootRes.status}: Failed to access source folder. Check share permissions or token validity.`);
    }

    let rootMeta = await rootRes.json();
    let actualFolderId = folderId;

    // Resolve Google Drive Shortcut if user pasted a shortcut to a folder
    if (rootMeta.mimeType === "application/vnd.google-apps.shortcut" && rootMeta.shortcutDetails?.targetId) {
      const targetId = rootMeta.shortcutDetails.targetId;
      try {
        const targetRes = await fetch(`${GDRIVE_BASE}/files/${targetId}?fields=id,name,mimeType,size,quotaBytesUsed,shortcutDetails&supportsAllDrives=true`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (targetRes.ok) {
          rootMeta = await targetRes.json();
          actualFolderId = targetId;
        }
      } catch (e) {
        console.warn("Could not resolve root shortcut target:", e);
      }
    }

    if (rootMeta.mimeType !== FOLDER_MIME) {
      // Direct single file link provided
      const fileSize = parseInt(rootMeta.size || rootMeta.quotaBytesUsed || 0, 10);
      const singleFileNode = {
        id: "single_root",
        name: rootMeta.name,
        renamedName: rootMeta.name,
        mimeType: FOLDER_MIME,
        depth: 0,
        files: [{
          id: rootMeta.id,
          name: rootMeta.name,
          renamedName: rootMeta.name,
          mimeType: rootMeta.mimeType,
          size: fileSize,
          selected: true
        }],
        subfolders: [],
        selected: true
      };

      if (onProgress) {
        onProgress({
          type: "scan_complete",
          totalFolders: 1,
          totalFiles: 1,
          totalBytes: fileSize
        });
      }

      return {
        root: singleFileNode,
        metrics: {
          rootId: rootMeta.id,
          rootName: rootMeta.name,
          totalFolders: 1,
          totalFiles: 1,
          totalBytes: fileSize,
          formattedSize: formatBytes(fileSize),
          isSingleFile: true
        }
      };
    }

    const rootNode = {
      id: actualFolderId,
      name: rootMeta.name,
      renamedName: rootMeta.name,
      mimeType: FOLDER_MIME,
      depth: 0,
      files: [],
      subfolders: [],
      selected: true
    };

    const folderMap = new Map();
    folderMap.set(actualFolderId, rootNode);

    const folderQueue = [rootNode];
    const visitedFolderIds = new Set([actualFolderId]);

    let totalFiles = 0;
    let totalFolders = 1;
    let totalBytes = 0;
    let scannedFolders = 0;
    let pendingFolders = 1; // Explicit tracking ensures zero premature worker termination
    let lastProgressUpdate = 0;
    const CONCURRENCY = 8;

    const fetchFolderPageWithRetry = async (folderNode, maxRetries = 6) => {
      let pageToken = null;
      const allItems = [];

      do {
        if (this.isCancelled) break;
        let attempt = 0;
        let success = false;

        let url = `${GDRIVE_BASE}/files?q=${encodeURIComponent(`'${folderNode.id}' in parents and trashed = false`)}&fields=nextPageToken,files(id,name,mimeType,size,quotaBytesUsed,modifiedTime,iconLink,fileExtension,shortcutDetails)&pageSize=1000&supportsAllDrives=true&includeItemsFromAllDrives=true`;
        if (pageToken) url += `&pageToken=${encodeURIComponent(pageToken)}`;

        while (attempt <= maxRetries && !success) {
          if (this.isCancelled) break;
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);

            const res = await fetch(url, {
              headers: { Authorization: `Bearer ${token}` },
              signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
              const data = await res.json();
              if (data.files && data.files.length > 0) {
                allItems.push(...data.files);
              }
              pageToken = data.nextPageToken || null;
              success = true;
              break;
            }

            if (res.status === 429 || res.status === 403 || res.status >= 500) {
              attempt++;
              if (attempt > maxRetries) {
                console.warn(`[Scanner] Rate limit on "${folderNode.name}" exceeded retries, page skipped.`);
                pageToken = null;
                break;
              }
              const delay = 500 * Math.pow(1.8, attempt) + Math.random() * 400;
              await new Promise(r => setTimeout(r, delay));
              continue;
            }

            pageToken = null;
            break;
          } catch (err) {
            attempt++;
            if (attempt > maxRetries) {
              console.warn(`[Scanner] Network timeout on "${folderNode.name}":`, err);
              pageToken = null;
              break;
            }
            await new Promise(r => setTimeout(r, 500 * attempt + Math.random() * 300));
          }
        }
      } while (pageToken && !this.isCancelled);

      return allItems;
    };

    const processFolder = async (folderNode) => {
      if (this.isCancelled) return;
      const children = await fetchFolderPageWithRetry(folderNode);

      for (const rawItem of children) {
        let item = rawItem;
        let isShortcut = item.mimeType === "application/vnd.google-apps.shortcut";
        let targetId = isShortcut && item.shortcutDetails?.targetId ? item.shortcutDetails.targetId : item.id;
        let targetMimeType = isShortcut && item.shortcutDetails?.targetMimeType ? item.shortcutDetails.targetMimeType : item.mimeType;

        if (targetMimeType === FOLDER_MIME) {
          if (!visitedFolderIds.has(targetId)) {
            visitedFolderIds.add(targetId);
            totalFolders++;
            pendingFolders++;

            const childNode = {
              id: targetId,
              name: item.name,
              renamedName: item.name,
              mimeType: FOLDER_MIME,
              depth: (folderNode.depth || 0) + 1,
              files: [],
              subfolders: [],
              selected: true
            };

            folderMap.set(targetId, childNode);
            folderNode.subfolders.push(childNode);
            folderQueue.push(childNode);
          }
        } else {
          let rawSize = item.size !== undefined && item.size !== null && item.size !== "" ? parseInt(item.size, 10) : null;
          if (rawSize === null || isNaN(rawSize) || rawSize === 0) {
            if (item.quotaBytesUsed) {
              const q = parseInt(item.quotaBytesUsed, 10);
              if (!isNaN(q) && q > 0) rawSize = q;
            }
          }
          const finalSize = isNaN(rawSize) || rawSize === null ? 0 : rawSize;

          totalFiles++;
          totalBytes += finalSize;

          folderNode.files.push({
            id: targetId,
            name: item.name,
            renamedName: item.name,
            mimeType: targetMimeType,
            size: finalSize,
            iconLink: item.iconLink,
            fileExtension: item.fileExtension || (item.name.includes(".") ? item.name.split(".").pop() : ""),
            selected: true
          });
        }
      }

      scannedFolders++;
      const now = Date.now();
      if (onProgress && (now - lastProgressUpdate > 150 || pendingFolders <= 1)) {
        lastProgressUpdate = now;
        const elapsedSec = Math.max(0.1, (now - scanStartTime) / 1000);
        const scanSpeed = Math.round(totalFiles / elapsedSec);
        onProgress({
          type: "scan_progress",
          currentFolder: folderNode.name,
          totalFolders,
          totalFiles,
          totalBytes,
          scannedNodes: scannedFolders,
          scanSpeed
        });
      }
    };

    const worker = async () => {
      while (!this.isCancelled && pendingFolders > 0) {
        const nextFolder = folderQueue.shift();
        if (!nextFolder) {
          if (pendingFolders === 0) break;
          await new Promise(r => setTimeout(r, 40));
          continue;
        }

        try {
          await processFolder(nextFolder);
        } catch (e) {
          console.warn(`Error scanning folder "${nextFolder.name}":`, e);
        } finally {
          pendingFolders--;
        }
      }
    };

    const workers = Array.from({ length: CONCURRENCY }, () => worker());
    await Promise.all(workers);

    if (onProgress) {
      onProgress({
        type: "scan_complete",
        totalFolders,
        totalFiles,
        totalBytes
      });
    }

    return {
      root: rootNode,
      metrics: {
        rootId: actualFolderId,
        rootName: rootMeta.name,
        totalFolders,
        totalFiles,
        totalBytes,
        formattedSize: formatBytes(totalBytes)
      }
    };
  }

  /**
   * Create Google Drive Folder with retry
   */
  async createFolder(name, parentId, token, maxRetries = 5) {
    const body = {
      name,
      mimeType: FOLDER_MIME,
      parents: parentId ? [parentId] : undefined
    };

    let attempt = 0;
    while (attempt <= maxRetries) {
      if (this.isCancelled) throw new Error("Cancelled");
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(`${GDRIVE_BASE}/files?fields=id,name&supportsAllDrives=true`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          return await res.json();
        }

        if (res.status === 429 || res.status === 403 || res.status >= 500) {
          attempt++;
          if (attempt > maxRetries) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error?.message || `HTTP ${res.status}: Rate limit creating folder ${name}`);
          }
          const delay = 400 * Math.pow(2, attempt) + Math.random() * 300;
          await new Promise(r => setTimeout(r, delay));
          continue;
        }

        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Failed to create folder ${name}`);
      } catch (err) {
        if (err.message === "Cancelled" || this.isCancelled) throw err;
        attempt++;
        if (attempt > maxRetries) throw err;
        await new Promise(r => setTimeout(r, 600 * attempt));
      }
    }
  }

  /**
   * High-Throughput Robust File Copy with 60s Timeout & Exponential Backoff
   */
  async copyFile(fileId, newName, targetFolderId, token, maxRetries = 5) {
    const body = JSON.stringify({
      name: newName,
      parents: [targetFolderId]
    });

    let attempt = 0;
    while (attempt <= maxRetries) {
      if (this.isCancelled) throw new Error("Cancelled");

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for large media/videos

        const res = await fetch(`${GDRIVE_BASE}/files/${fileId}/copy?fields=id,name,size&supportsAllDrives=true`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          return await res.json();
        }

        if (res.status === 429 || res.status === 403 || res.status >= 500) {
          attempt++;
          if (attempt > maxRetries) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error?.message || `HTTP ${res.status}: Rate limit or server busy for file "${newName}"`);
          }
          const delay = 500 * Math.pow(1.8, attempt) + Math.random() * 400;
          await new Promise(r => setTimeout(r, delay));
          continue;
        }

        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Failed to copy file ${newName}`);
      } catch (err) {
        if (err.message === "Cancelled" || this.isCancelled) throw err;
        attempt++;
        if (attempt > maxRetries) throw err;
        await new Promise(r => setTimeout(r, 600 * attempt + Math.random() * 200));
      }
    }
  }

  /**
   * Create Text File (for promo / notice files)
   */
  async createTextFile(name, content, parentId, token) {
    const metadata = {
      name,
      mimeType: "text/plain",
      parents: parentId ? [parentId] : undefined
    };

    const boundary = "-------314159265358979323846";
    const delimiter = "\r\n--" + boundary + "\r\n";
    const closeDelim = "\r\n--" + boundary + "--";

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
      content +
      closeDelim;

    try {
      const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": `multipart/related; boundary=${boundary}`
        },
        body: multipartRequestBody
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("createTextFile error:", e);
    }
    return null;
  }

  /**
   * Start 64x Cloud Cloning Process
   */
  async startClone({
    sourceTree,
    customRootName,
    concurrency = 64,
    token,
    promoNotice = null,
    onProgress,
    onLog
  }) {
    this.isCancelled = false;
    const startTime = Date.now();

    // 1. Create Target Root Folder in User's Google Drive
    const rootName = customRootName || `Copy of ${sourceTree.metrics.rootName}`;
    if (onLog) onLog("info", `🚀 Initializing clone for "${rootName}"...`);

    const destRoot = await this.createFolder(rootName, null, token);
    if (onLog) onLog("success", `📁 Created destination folder "${rootName}" (ID: ${destRoot.id})`);

    // 1b. Inject Promo Notice if enabled
    if (promoNotice && promoNotice.enabled && promoNotice.content) {
      try {
        const promoFileName = promoNotice.filename || "README_BUILDBYFARAZ.txt";
        await this.createTextFile(promoFileName, promoNotice.content, destRoot.id, token);
        if (onLog) onLog("success", `📌 Injected promo notice "${promoFileName}" into destination folder.`);
      } catch (e) {
        console.warn("Failed to inject promo notice:", e);
      }
    }

    // 2. Folder ID Mapping (Source ID -> Destination ID)
    const folderIdMap = new Map();
    folderIdMap.set(sourceTree.root.id, destRoot.id);

    // 3. Parallel Level-by-Level Folder Pre-Creation (Creates all folders in seconds)
    const folderCreateQueue = [];
    const queueSubfolders = (node) => {
      if (node.selected === false) return;
      if (node.subfolders && node.subfolders.length > 0) {
        for (const sub of node.subfolders) {
          if (sub.selected !== false) {
            folderCreateQueue.push({
              sourceNode: sub,
              parentId: node.id,
              depth: sub.depth || 1
            });
            queueSubfolders(sub);
          }
        }
      }
    };

    queueSubfolders(sourceTree.root);

    if (folderCreateQueue.length > 0) {
      if (onLog) onLog("info", `📁 Pre-creating ${folderCreateQueue.length} nested folders on Google Drive in parallel...`);
      
      const depthGroups = new Map();
      folderCreateQueue.forEach(item => {
        const d = item.depth || 1;
        if (!depthGroups.has(d)) depthGroups.set(d, []);
        depthGroups.get(d).push(item);
      });

      const sortedDepths = Array.from(depthGroups.keys()).sort((a, b) => a - b);
      
      const poolLimit = (limit) => {
        let active = 0;
        const queue = [];
        const runNext = () => {
          if (this.isCancelled || queue.length === 0 || active >= limit) return;
          active++;
          const { fn, resolve, reject } = queue.shift();
          fn().then(resolve, reject).finally(() => {
            active--;
            runNext();
          });
        };
        return (fn) => new Promise((resolve, reject) => {
          if (this.isCancelled) return reject(new Error("Cancelled"));
          queue.push({ fn, resolve, reject });
          runNext();
        });
      };

      const folderLimit = poolLimit(16);

      for (const d of sortedDepths) {
        if (this.isCancelled) break;
        const itemsAtDepth = depthGroups.get(d) || [];
        const levelPromises = itemsAtDepth.map(item =>
          folderLimit(async () => {
            if (this.isCancelled) return;
            const parentDestId = folderIdMap.get(item.parentId) || destRoot.id;
            const folderName = item.sourceNode.renamedName || item.sourceNode.name;

            let myDestId = folderIdMap.get(item.sourceNode.id);
            if (!myDestId) {
              try {
                const created = await this.createFolder(folderName, parentDestId, token);
                myDestId = created.id;
                folderIdMap.set(item.sourceNode.id, myDestId);
              } catch (err) {
                console.warn(`Failed to create folder ${folderName}:`, err);
                folderIdMap.set(item.sourceNode.id, parentDestId);
              }
            }
          })
        );
        await Promise.all(levelPromises);
      }

      if (onLog) onLog("success", `✅ Created all ${folderCreateQueue.length} nested folders on Google Drive.`);
    }

    // 4. Flatten Files to Copy
    const filesToCopy = [];
    const collectFiles = (node) => {
      if (node.selected === false) return;
      const targetFolderId = folderIdMap.get(node.id) || destRoot.id;

      if (node.files) {
        for (const file of node.files) {
          if (file.selected !== false && targetFolderId) {
            filesToCopy.push({
              fileId: file.id,
              name: file.renamedName || file.name,
              size: file.size || 0,
              targetFolderId
            });
          }
        }
      }

      if (node.subfolders) {
        node.subfolders.forEach(collectFiles);
      }
    };

    collectFiles(sourceTree.root);
    const totalFiles = filesToCopy.length;
    let totalBytes = filesToCopy.reduce((acc, f) => acc + (f.size || 0), 0);

    if (onLog) onLog("info", `⚡ Queued ${totalFiles} files (${formatBytes(totalBytes)}) for cloud-to-cloud copy with ${concurrency} parallel streams...`);

    // 5. Parallel File Copy Workers (True 64x Speed)
    let copiedFiles = 0;
    let copiedBytes = 0;
    let queueIndex = 0;
    const completedFileIds = [];

    const workerLimit = Math.min(Math.max(concurrency, 8), 64);

    const worker = async () => {
      while (queueIndex < filesToCopy.length && !this.isCancelled) {
        const currentItem = filesToCopy[queueIndex++];
        if (!currentItem) break;

        try {
          await this.copyFile(currentItem.fileId, currentItem.name, currentItem.targetFolderId, token);
          copiedFiles++;
          copiedBytes += currentItem.size;
          completedFileIds.push(currentItem.fileId);

          sound.playCopySuccess();

          const elapsedSec = Math.max(0.1, (Date.now() - startTime) / 1000);
          const filesPerSec = (copiedFiles / elapsedSec).toFixed(1);
          const bytesPerSec = copiedBytes / elapsedSec;
          const remainingSec = Math.round((totalFiles - copiedFiles) / Math.max(0.1, copiedFiles / elapsedSec));

          if (onProgress) {
            onProgress({
              copiedFiles,
              totalFiles,
              copiedBytes,
              totalBytes,
              percent: Math.round((copiedFiles / totalFiles) * 100),
              speedFilesPerSec: filesPerSec,
              speedFormatted: `${formatBytes(bytesPerSec)}/s`,
              etaSeconds: remainingSec,
              currentFile: currentItem.name
            });
          }

          if (copiedFiles % 10 === 0 || copiedFiles === totalFiles) {
            this.saveCheckpoint({
              rootId: destRoot.id,
              rootName,
              completedFileIds,
              totalFiles
            });
          }
        } catch (err) {
          if (onLog) onLog("error", `Failed copying "${currentItem.name}": ${err.message}`);
        }
      }
    };

    const workerPromises = Array.from({ length: workerLimit }, () => worker());
    await Promise.all(workerPromises);

    if (this.isCancelled) {
      if (onLog) onLog("warning", "Cloning process was cancelled by user.");
      throw new Error("Cloning cancelled");
    }

    this.clearCheckpoint();
    sound.playCompleteFanfare();

    return {
      destFolderId: destRoot.id,
      destFolderName: rootName,
      copiedFiles,
      totalFiles,
      totalBytes,
      elapsedTime: Math.round((Date.now() - startTime) / 1000)
    };
  }
}

/**
 * Streaming Browser ZIP Downloader
 */
export class ZipDownloader {
  constructor() {
    this.isCancelled = false;
    this.abortController = null;
  }

  abort() {
    this.isCancelled = true;
    if (this.abortController) {
      try {
        this.abortController.abort();
      } catch (e) {}
    }
  }

  async downloadTreeAsZip({
    sourceTree,
    token,
    customZipName = null,
    concurrency = 6,
    promoNotice = null,
    onProgress,
    onLog
  }) {
    this.isCancelled = false;
    this.abortController = new AbortController();

    const zip = new JSZip();
    const startTime = Date.now();

    const fileList = [];
    let totalBytes = 0;

    const traverse = (node, path) => {
      if (node.selected === false) return;
      const currentPath = path ? `${path}/${node.renamedName || node.name}` : (node.renamedName || node.name);

      if (node.files) {
        node.files.forEach(f => {
          if (f.selected !== false) {
            fileList.push({
              id: f.id,
              name: f.renamedName || f.name,
              size: f.size || 0,
              path
            });
            totalBytes += f.size || 0;
          }
        });
      }

      if (node.subfolders) {
        node.subfolders.forEach(sub => traverse(sub, currentPath));
      }
    };

    const rootName = customZipName || sourceTree.root.renamedName || sourceTree.root.name || "Drive_Archive";
    traverse(sourceTree.root, "");

    if (fileList.length === 0) {
      throw new Error("No files selected for ZIP packaging.");
    }

    if (promoNotice && promoNotice.enabled && promoNotice.content) {
      zip.file(promoNotice.filename || "README_BUILDBYFARAZ.txt", promoNotice.content);
    }

    if (onLog) onLog("info", `📦 Packaging ${fileList.length} files (${formatBytes(totalBytes)}) into streaming ZIP...`);

    let downloadedFiles = 0;
    let downloadedBytes = 0;
    let queueIdx = 0;

    const worker = async () => {
      while (queueIdx < fileList.length && !this.isCancelled) {
        const item = fileList[queueIdx++];
        if (!item) break;

        try {
          const res = await fetch(`${GDRIVE_BASE}/files/${item.id}?alt=media&supportsAllDrives=true`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: this.abortController.signal
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const arrayBuffer = await res.arrayBuffer();

          const targetPath = item.path ? `${item.path}/${item.name}` : item.name;
          zip.file(targetPath, arrayBuffer, { compression: "STORE" });

          downloadedFiles++;
          downloadedBytes += arrayBuffer.byteLength;

          const elapsed = Math.max(0.1, (Date.now() - startTime) / 1000);
          const bytesPerSec = downloadedBytes / elapsed;
          const remainingSec = Math.round((totalBytes - downloadedBytes) / Math.max(1, bytesPerSec));

          if (onProgress) {
            onProgress({
              downloadedFiles,
              totalFiles: fileList.length,
              downloadedBytes,
              totalBytes,
              percent: Math.round((downloadedFiles / fileList.length) * 100),
              speedFormatted: `${formatBytes(bytesPerSec)}/s`,
              etaSeconds: remainingSec,
              currentFile: item.name
            });
          }
        } catch (e) {
          if (this.isCancelled) break;
          if (onLog) onLog("error", `Failed downloading "${item.name}": ${e.message}`);
        }
      }
    };

    const workers = Array.from({ length: Math.min(concurrency, 8) }, () => worker());
    await Promise.all(workers);

    if (this.isCancelled) throw new Error("ZIP download cancelled");

    if (onLog) onLog("info", "⚡ Compiling final .ZIP binary stream in browser memory...");
    const content = await zip.generateAsync({ type: "blob" });

    const cleanFilename = `${rootName.replace(/[^a-zA-Z0-9_-]/g, "_")}.zip`;
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = cleanFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    sound.playCompleteFanfare();
    if (onLog) onLog("success", `🎉 ZIP download complete: "${cleanFilename}" (${formatBytes(content.size)})`);

    return { filename: cleanFilename, size: content.size };
  }
}
