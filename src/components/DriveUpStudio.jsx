import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderOpen, 
  Download, 
  Cloud, 
  Copy, 
  Check, 
  RefreshCw, 
  Zap, 
  Play, 
  Square, 
  FileText, 
  Search, 
  Edit3, 
  Share2, 
  ExternalLink, 
  ShieldCheck, 
  Terminal, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  File, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Plus, 
  Trash2, 
  Clock,
  Sparkles,
  Key,
  HardDrive,
  BarChart3,
  Tag,
  Sliders,
  Eye,
  PieChart,
  ArrowRight,
  User,
  LogOut,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  ClonerEngine, 
  ZipDownloader, 
  sound, 
  formatBytes, 
  GDRIVE_BASE, 
  FOLDER_MIME 
} from '../services/driveClonerEngine';

const DEFAULT_CLIENT_ID = "683510638536-ogcbglbsc9s2tdqtm14gpfojrt4oqn4q.apps.googleusercontent.com";
const DEFAULT_REDIRECT_URI = "https://gdrive-folder-cloner.grwebdevs5.workers.dev/auth/callback";

export default function DriveUpStudio({ currentUser, onLogActivity }) {
  // Engine instances
  const clonerRef = useRef(new ClonerEngine());
  const zipRef = useRef(new ZipDownloader());

  // Sound FX State
  const [soundEnabled, setSoundEnabled] = useState(() => sound.enabled);

  // Main Navigation Views: 'overview' | 'drive' | 'tools' | 'activity'
  const [activeMainTab, setActiveMainTab] = useState('tools');

  // Sub-tabs under Tools: 'clone' | 'tag' | 'promo' | 'weigh' | 'renamer'
  const [activeToolSubTab, setActiveToolSubTab] = useState('clone');

  // Auth & Token State
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('bbf_drive_token') || '';
    } catch {
      return '';
    }
  });
  const [userProfile, setUserProfile] = useState(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [customClientId, setCustomClientId] = useState(() => {
    try {
      return localStorage.getItem('bbf_custom_client_id') || '';
    } catch {
      return '';
    }
  });

  // Step 1: Input & Configuration for Cloner
  const [folderUrl, setFolderUrl] = useState('');
  const [destFolderName, setDestFolderName] = useState('');
  const [concurrency, setConcurrency] = useState(64);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [scanError, setScanError] = useState('');

  // Step 2: Tree & Preview
  const [treeData, setTreeData] = useState(null);
  const [treeFilter, setTreeFilter] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState(new Set());
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [renamingId, setRenamingId] = useState(null);
  const [renamingVal, setRenamingVal] = useState('');

  const toggleExpandFolderFiles = (folderId) => {
    sound.playClick();
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  // Step 3: Cloning Progress
  const [isCloning, setIsCloning] = useState(false);
  const [cloneProgress, setCloneProgress] = useState({
    copiedFiles: 0,
    totalFiles: 0,
    copiedBytes: 0,
    totalBytes: 0,
    percent: 0,
    speedFilesPerSec: 0,
    speedFormatted: '0 KB/s',
    etaSeconds: 0,
    currentFile: ''
  });

  // Step 4: Complete State
  const [cloneResult, setCloneResult] = useState(null);

  // ZIP Downloading State
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(null);

  // Terminal Logs
  const [logs, setLogs] = useState([
    { id: 1, type: 'info', time: new Date().toLocaleTimeString(), text: 'BUILDBYFARAZ DriveUp Engine v6.8.2 initialized.' }
  ]);
  const logContainerRef = useRef(null);

  // Modals & Tools
  const [batchRenameOpen, setBatchRenameOpen] = useState(false);
  const [batchRule, setBatchRule] = useState({
    targetType: 'all', // 'all' | 'videos' | 'docs' | 'folders'
    prefix: '',
    suffix: '',
    pattern: 'Video {N}',
    numberStart: 1,
    padDigits: 2,
    findText: '',
    replaceText: ''
  });
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [developerModalOpen, setDeveloperModalOpen] = useState(false);
  const [oauthHelpOpen, setOauthHelpOpen] = useState(false);
  
  // Tagging & Untagging Tool State (Ahm-inspired)
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [tagActionType, setTagActionType] = useState('add'); // 'add' | 'remove'
  const [tagInputValue, setTagInputValue] = useState('[BUILDBYFARAZ]');

  // Promo / Notice Injector Tool State (Ahm-inspired)
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoNotice, setPromoNotice] = useState({
    enabled: false,
    filename: 'README_BUILDBYFARAZ.txt',
    content: `==================================================
  BUILDBYFARAZ // Cloud Automation & Media Suite
  Lead Architect: Faraz (Founder @ BUILDBYFARAZ)
  Official Portal: https://buildbyfaraz.com
  WhatsApp Support: +92 328 4487595
  Contact: faggaf786678@gmail.com
==================================================
This archive was mirrored & organized using BUILDBYFARAZ DriveUp.
High-speed duplication with 100% cloud transfer & zero local bandwidth!`
  });

  // Interrupted Session Checkpoint
  const [interruptedCheckpoint, setInterruptedCheckpoint] = useState(null);

  // --- AHM-INSPIRED FEATURE 1: LIVE "MY DRIVE" BROWSER ---
  const [myDriveFolderId, setMyDriveFolderId] = useState('root');
  const [myDriveCrumbs, setMyDriveCrumbs] = useState([{ id: 'root', name: 'My Drive' }]);
  const [myDriveItems, setMyDriveItems] = useState([]);
  const [myDriveLoading, setMyDriveLoading] = useState(false);
  const [myDriveError, setMyDriveError] = useState('');

  // --- AHM-INSPIRED FEATURE 2: WEIGH / SIZE ENGINE ---
  const [weighTargetUrl, setWeighTargetUrl] = useState('');
  const [weighData, setWeighData] = useState(null);
  const [isWeighing, setIsWeighing] = useState(false);

  // --- AHM-INSPIRED FEATURE 3: ACTIVITY HISTORY ---
  const [activityHistory, setActivityHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('bbf_driveup_activity');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'act-1',
        type: 'CLONE',
        target: 'Demo Deliverables Q4',
        count: 7,
        size: 780800000,
        status: 'COMPLETED',
        time: 'Today, 10:15 AM'
      },
      {
        id: 'act-2',
        type: 'WEIGH',
        target: 'Raw 4K Video Masters',
        count: 142,
        size: 15420000000,
        status: 'COMPLETED',
        time: 'Yesterday, 04:30 PM'
      }
    ];
  });
  const [activityFilter, setActivityFilter] = useState('all');

  const addLog = (type, text) => {
    setLogs(prev => [
      ...prev,
      { id: Date.now() + Math.random(), type, time: new Date().toLocaleTimeString(), text }
    ]);
    setTimeout(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  const recordActivity = (type, target, count, size, status = 'COMPLETED') => {
    const newAct = {
      id: 'act-' + Date.now(),
      type,
      target: target || 'Untitled Folder',
      count: count || 0,
      size: size || 0,
      status,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString()
    };
    setActivityHistory(prev => {
      const updated = [newAct, ...prev.slice(0, 49)];
      try {
        localStorage.setItem('bbf_driveup_activity', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleSaveToken = async (newToken) => {
    const clean = (newToken || '').trim();
    if (!clean) return;
    setToken(clean);
    try {
      localStorage.setItem('bbf_drive_token', clean);
    } catch (e) {}
    addLog('success', 'Google Drive OAuth token synchronized.');
    await fetchUserProfile(clean);
    setConnectModalOpen(false);
  };

  const fetchUserProfile = async (authToken) => {
    try {
      const res = await fetch(`${GDRIVE_BASE}/about?fields=user,storageQuota`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
        addLog('info', `Connected as ${data.user?.displayName} (${data.user?.emailAddress})`);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } else {
        console.warn("Token expired or unauthorized");
      }
    } catch (e) {
      console.warn("User profile fetch failed:", e);
    }
  };

  // Cross-window communication listener for Google OAuth token
  useEffect(() => {
    const handleAuthMessage = (event) => {
      if ((event.data?.type === 'GDRIVE_AUTH_SUCCESS' || event.data?.type === 'GDRIVE_TOKEN_SUCCESS') && event.data?.token) {
        handleSaveToken(event.data.token);
        addLog('success', '✓ Google Drive account connected successfully via BUILDBYFARAZ Bridge!');
      }
    };
    window.addEventListener('message', handleAuthMessage);

    // Also check URL hash for access_token on direct redirect
    if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('access_token')) {
      try {
        const hash = window.location.hash.replace(/^[#?]/, '');
        const params = new URLSearchParams(hash);
        const tokenVal = params.get('access_token');
        if (tokenVal) {
          handleSaveToken(tokenVal);
          window.history.replaceState(null, null, window.location.pathname + window.location.search);
        }
      } catch (e) {
        console.warn('Hash token parse error:', e);
      }
    }

    if (token) {
      fetchUserProfile(token);
    }
    const cp = clonerRef.current.getCheckpoint();
    if (cp && cp.completedFileIds && cp.completedFileIds.length < cp.totalFiles) {
      setInterruptedCheckpoint(cp);
    }

    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  // Launch Google Sign-In Popup
  const handleGoogleSignIn = () => {
    sound.playClick();
    const cid = customClientId.trim() || DEFAULT_CLIENT_ID;
    const redirectUri = DEFAULT_REDIRECT_URI;
    const scope = encodeURIComponent("https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email");
    const stateParam = encodeURIComponent(window.location.href);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${cid}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${stateParam}`;

    const width = 540;
    const height = 700;
    const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);
    
    addLog('info', 'Opening official Google Account authorization screen...');
    const popup = window.open(authUrl, 'GoogleSignIn', `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`);

    if (popup) {
      const pollTimer = setInterval(() => {
        try {
          if (!popup || popup.closed) {
            clearInterval(pollTimer);
            return;
          }
          if (popup.location && popup.location.href.includes("access_token=")) {
            const hash = popup.location.hash || popup.location.search;
            const params = new URLSearchParams(hash.replace(/^[#?]/, ''));
            const accessToken = params.get("access_token");
            if (accessToken) {
              handleSaveToken(accessToken);
              popup.close();
              clearInterval(pollTimer);
            }
          }
        } catch (crossOriginErr) {
          // Expected cross-origin error while on google.com or worker domain
        }
      }, 500);
    } else {
      window.location.href = authUrl;
    }
  };

  const handleLogout = () => {
    sound.playClick();
    setToken('');
    setUserProfile(null);
    try {
      localStorage.removeItem('bbf_drive_token');
    } catch (e) {}
    addLog('info', 'Disconnected from Google Drive.');
  };

  // Sample data generator for demonstration
  const getDemoTreeData = () => ({
    root: {
      id: "demo_root",
      name: "Client Deliverables Q4",
      renamedName: "Client Deliverables Q4",
      mimeType: FOLDER_MIME,
      selected: true,
      files: [
        { id: "f1", name: "Campaign_Master_1080p.mp4", renamedName: "Campaign_Master_1080p.mp4", size: 485000000, selected: true },
        { id: "f2", name: "Voiceover_English.mp3", renamedName: "Voiceover_English.mp3", size: 28400000, selected: true },
        { id: "f3", name: "Brand_Style_Guide.pdf", renamedName: "Brand_Style_Guide.pdf", size: 14200000, selected: true },
        { id: "f4", name: "Hero_Keyvisual.png", renamedName: "Hero_Keyvisual.png", size: 9800000, selected: true },
        { id: "f5", name: "Project_Archive.zip", renamedName: "Project_Archive.zip", size: 168000000, selected: true }
      ],
      subfolders: [
        {
          id: "demo_sub1",
          name: "Social Media Teasers",
          renamedName: "Social Media Teasers",
          mimeType: FOLDER_MIME,
          selected: true,
          files: [
            { id: "f6", name: "Reels_Teaser_Vertical.mp4", renamedName: "Reels_Teaser_Vertical.mp4", size: 72000000, selected: true },
            { id: "f7", name: "Instagram_Cover.png", renamedName: "Instagram_Cover.png", size: 3400000, selected: true }
          ],
          subfolders: []
        }
      ]
    },
    metrics: {
      rootId: "demo_root",
      rootName: "Client Deliverables Q4",
      totalFolders: 2,
      totalFiles: 7,
      totalBytes: 780800000,
      formattedSize: "744.63 MB"
    }
  });

  // Quick Demo Loader
  const handleLoadDemo = () => {
    sound.playClick();
    setFolderUrl('https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs');
    setScanError('');
  };

  // Scan Folder
  const handleScan = async (e) => {
    if (e) e.preventDefault();
    sound.playClick();

    if (!token) {
      if (folderUrl.includes('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs') || folderUrl.toLowerCase() === 'demo' || !folderUrl.trim()) {
        setIsScanning(true);
        setScanError('');
        setTreeData(null);
        setCloneResult(null);
        addLog('info', 'Loading sample demo folder hierarchy...');
        sound.playScanBlip();
        await new Promise(r => setTimeout(r, 500));

        const mockResult = getDemoTreeData();
        setTreeData(mockResult);
        setDestFolderName(`Copy of ${mockResult.metrics.rootName}`);
        addLog('success', `⚡ Demo Scan complete! Loaded ${mockResult.metrics.totalFiles} files across ${mockResult.metrics.totalFolders} folders (${mockResult.metrics.formattedSize}). Connect Google Drive to clone live.`);
        sound.playCopySuccess();
        setIsScanning(false);
        return;
      }

      setScanError("Please connect your Google Drive account or paste an access token first (or click 'Load Sample Demo Link' to test).");
      return;
    }

    if (!folderUrl.trim()) {
      setScanError("Please enter a Google Drive shared folder link or folder ID.");
      return;
    }

    setIsScanning(true);
    setScanError('');
    setTreeData(null);
    setCloneResult(null);
    setLogs([
      { id: Date.now(), type: 'info', time: new Date().toLocaleTimeString(), text: `🚀 Scanning source folder: ${folderUrl}...` }
    ]);

    try {
      sound.playScanBlip();
      const result = await clonerRef.current.scanFolder({
        folderUrl,
        token,
        onProgress: (p) => {
          if (p.type === 'scan_progress') {
            setScanMessage(`Scanning: ${p.totalFiles} files in ${p.scannedNodes} folders (${p.scanSpeed} files/s)...`);
          }
        }
      });

      setTreeData(result);
      setDestFolderName(`Copy of ${result.metrics.rootName}`);
      addLog('success', `Scan complete! Found ${result.metrics.totalFiles} files across ${result.metrics.totalFolders} folders (${result.metrics.formattedSize}).`);
      sound.playCopySuccess();

      if (onLogActivity) {
        onLogActivity({
          user: currentUser?.name || 'Faraz',
          action: 'Scanned Google Drive Folder',
          target: `${result.metrics.rootName} (${result.metrics.totalFiles} files)`,
          role: currentUser?.role || 'user'
        });
      }
    } catch (err) {
      setScanError(err.message || 'Failed to scan folder.');
      addLog('error', `Scan error: ${err.message}`);
    } finally {
      setIsScanning(false);
      setScanMessage('');
    }
  };

  // Tree selection helpers
  const toggleNodeSelection = (node, selectState) => {
    node.selected = selectState;
    if (node.files) node.files.forEach(f => f.selected = selectState);
    if (node.subfolders) node.subfolders.forEach(s => toggleNodeSelection(s, selectState));
    setTreeData({ ...treeData });
  };

  const toggleSingleFile = (file) => {
    file.selected = !file.selected;
    setTreeData({ ...treeData });
  };

  const toggleFolderCollapse = (folderId) => {
    sound.playClick();
    setCollapsedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  // Rename helpers
  const handleStartRename = (id, currentName) => {
    setRenamingId(id);
    setRenamingVal(currentName);
  };

  const handleApplyRename = (nodeOrFile) => {
    if (renamingVal.trim()) {
      nodeOrFile.renamedName = renamingVal.trim();
      setTreeData({ ...treeData });
    }
    setRenamingId(null);
  };

  // Batch Renamer Rules
  const handleApplyBatchRename = () => {
    if (!treeData) return;
    sound.playClick();
    let counter = batchRule.numberStart;

    const applyToItem = (item, isFolder) => {
      if (batchRule.targetType === 'folders' && !isFolder) return;
      if (batchRule.targetType === 'videos' && !isFolder && !/\.(mp4|mkv|mov|avi|webm)$/i.test(item.name)) return;
      if (batchRule.targetType === 'docs' && !isFolder && !/\.(pdf|docx?|xlsx?|pptx?|txt)$/i.test(item.name)) return;

      let newName = item.name;

      // Rule 1: Prefix / Suffix
      if (batchRule.prefix) newName = `${batchRule.prefix}${newName}`;
      if (batchRule.suffix) {
        const extIdx = newName.lastIndexOf('.');
        if (!isFolder && extIdx !== -1) {
          newName = `${newName.slice(0, extIdx)}${batchRule.suffix}${newName.slice(extIdx)}`;
        } else {
          newName = `${newName}${batchRule.suffix}`;
        }
      }

      // Rule 2: Sequential Numbering
      if (batchRule.pattern && batchRule.pattern.includes('{N}')) {
        const numStr = String(counter++).padStart(batchRule.padDigits, '0');
        const extIdx = newName.lastIndexOf('.');
        const ext = (!isFolder && extIdx !== -1) ? newName.slice(extIdx) : '';
        const base = batchRule.pattern.replace('{N}', numStr);
        newName = `${base}${ext}`;
      }

      // Rule 3: Find & Replace
      if (batchRule.findText) {
        newName = newName.replaceAll(batchRule.findText, batchRule.replaceText);
      }

      item.renamedName = newName;
    };

    const traverse = (node) => {
      applyToItem(node, true);
      if (node.files) node.files.forEach(f => applyToItem(f, false));
      if (node.subfolders) node.subfolders.forEach(traverse);
    };

    traverse(treeData.root);
    setTreeData({ ...treeData });
    setBatchRenameOpen(false);
    addLog('info', 'Applied batch renaming rules across selected files.');
  };

  const handleResetRenames = () => {
    if (!treeData) return;
    const traverse = (node) => {
      node.renamedName = node.name;
      if (node.files) node.files.forEach(f => f.renamedName = f.name);
      if (node.subfolders) node.subfolders.forEach(traverse);
    };
    traverse(treeData.root);
    setTreeData({ ...treeData });
    setBatchRenameOpen(false);
    addLog('info', 'Reset all items to original names.');
  };

  // Tagging & Untagging Tools (Ahm-inspired)
  const handleAddTagToAll = (tagText) => {
    if (!treeData || !tagText.trim()) return;
    sound.playClick();
    const tag = tagText.trim();
    const prefix = tag.endsWith(' ') ? tag : `${tag} `;
    const traverse = (node) => {
      if (!node.renamedName.startsWith(prefix)) {
        node.renamedName = `${prefix}${node.renamedName}`;
      }
      if (node.files) {
        node.files.forEach(f => {
          if (!f.renamedName.startsWith(prefix)) {
            f.renamedName = `${prefix}${f.renamedName}`;
          }
        });
      }
      if (node.subfolders) node.subfolders.forEach(traverse);
    };
    traverse(treeData.root);
    setTreeData({ ...treeData });
    setTagModalOpen(false);
    recordActivity('TAG', treeData.metrics.rootName, treeData.metrics.totalFiles, treeData.metrics.totalBytes);
    addLog('success', `🏷️ Added tag "${tag}" across all folders and files.`);
  };

  const handleRemoveTagFromAll = (tagText) => {
    if (!treeData || !tagText.trim()) return;
    sound.playClick();
    const tag = tagText.trim();
    const traverse = (node) => {
      node.renamedName = node.renamedName.replaceAll(tag, '').trim();
      if (node.files) {
        node.files.forEach(f => {
          f.renamedName = f.renamedName.replaceAll(tag, '').trim();
        });
      }
      if (node.subfolders) node.subfolders.forEach(traverse);
    };
    traverse(treeData.root);
    setTreeData({ ...treeData });
    setTagModalOpen(false);
    recordActivity('TAG', treeData.metrics.rootName, treeData.metrics.totalFiles, treeData.metrics.totalBytes);
    addLog('success', `✂️ Removed tag "${tag}" from all folders and files.`);
  };

  // Compute storage metrics breakdown (Ahm-inspired "Check Size / Weigh")
  const computeMetricsBreakdown = (rootNode) => {
    if (!rootNode) return null;
    let counts = {
      videos: { count: 0, bytes: 0 },
      audios: { count: 0, bytes: 0 },
      docs: { count: 0, bytes: 0 },
      images: { count: 0, bytes: 0 },
      archives: { count: 0, bytes: 0 },
      other: { count: 0, bytes: 0 }
    };

    const walk = (node) => {
      if (node.files) {
        for (const f of node.files) {
          const ext = (f.name.split('.').pop() || '').toLowerCase();
          const size = parseInt(f.size || 0, 10);
          if (['mp4', 'mkv', 'mov', 'avi', 'webm', 'flv', 'wmv'].includes(ext)) {
            counts.videos.count++;
            counts.videos.bytes += size;
          } else if (['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'].includes(ext)) {
            counts.audios.count++;
            counts.audios.bytes += size;
          } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(ext)) {
            counts.docs.count++;
            counts.docs.bytes += size;
          } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
            counts.images.count++;
            counts.images.bytes += size;
          } else if (['zip', 'rar', '7z', 'tar', 'gz', 'iso'].includes(ext)) {
            counts.archives.count++;
            counts.archives.bytes += size;
          } else {
            counts.other.count++;
            counts.other.bytes += size;
          }
        }
      }
      if (node.subfolders) {
        node.subfolders.forEach(walk);
      }
    };

    walk(rootNode);
    return counts;
  };

  // Extract top largest files from tree
  const extractTopFiles = (rootNode, limit = 5) => {
    if (!rootNode) return [];
    const filesList = [];
    const walk = (node) => {
      if (node.files) {
        for (const f of node.files) {
          filesList.push({
            name: f.renamedName || f.name,
            size: parseInt(f.size || 0, 10)
          });
        }
      }
      if (node.subfolders) node.subfolders.forEach(walk);
    };
    walk(rootNode);
    return filesList.sort((a, b) => b.size - a.size).slice(0, limit);
  };

  // Start Cloud Clone
  const handleStartClone = async () => {
    if (!treeData) return;
    if (!token) {
      setConnectModalOpen(true);
      return;
    }
    sound.playClick();
    setIsCloning(true);
    setCloneResult(null);
    setLogs([
      { id: Date.now(), type: 'info', time: new Date().toLocaleTimeString(), text: `🚀 Starting 64x cloud-to-cloud clone into "${destFolderName}"...` }
    ]);

    try {
      const result = await clonerRef.current.startClone({
        sourceTree: treeData,
        customRootName: destFolderName,
        concurrency,
        token,
        promoNotice,
        onProgress: (p) => setCloneProgress(p),
        onLog: (type, text) => addLog(type, text)
      });

      setCloneResult(result);
      recordActivity('CLONE', result.destFolderName, result.copiedFiles, result.totalBytes, 'COMPLETED');
      addLog('success', `🎉 Cloud clone finished successfully! ${result.copiedFiles} files copied into Google Drive.`);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

      if (onLogActivity) {
        onLogActivity({
          user: currentUser?.name || 'Faraz',
          action: 'Cloned Google Drive Folder',
          target: `${result.destFolderName} (${result.copiedFiles} files)`,
          role: currentUser?.role || 'user'
        });
      }
    } catch (err) {
      if (err.message !== 'Cloning cancelled') {
        addLog('error', `Cloning failed: ${err.message}`);
        recordActivity('CLONE', destFolderName, 0, 0, 'FAILED');
      }
    } finally {
      setIsCloning(false);
    }
  };

  const handleCancelClone = () => {
    sound.playClick();
    clonerRef.current.abort();
    setIsCloning(false);
    addLog('warning', 'Cloning operation cancelled.');
  };

  // Download ZIP
  const handleDownloadZip = async () => {
    if (!treeData) return;
    if (!token) {
      setConnectModalOpen(true);
      return;
    }
    sound.playClick();
    setIsZipping(true);
    setLogs([
      { id: Date.now(), type: 'info', time: new Date().toLocaleTimeString(), text: `📦 Initializing streaming ZIP download for "${destFolderName || treeData.metrics.rootName}"...` }
    ]);

    if (treeData.metrics.totalBytes > 500 * 1024 * 1024) {
      addLog('warning', `⚠️ Warning: Archive is ${treeData.metrics.formattedSize}. Browser ZIP compiles in RAM. For video masters/large files, "01 — 64x Cloud Clone" is recommended!`);
    }

    try {
      const zipRes = await zipRef.current.downloadTreeAsZip({
        sourceTree: treeData,
        token,
        customZipName: destFolderName,
        concurrency: 8,
        promoNotice,
        onProgress: (p) => setZipProgress(p),
        onLog: (type, text) => addLog(type, text)
      });

      confetti({ particleCount: 50, spread: 50 });
      recordActivity('ZIP', destFolderName, treeData.metrics.totalFiles, treeData.metrics.totalBytes, 'COMPLETED');
      setDownloadModalOpen(false);
    } catch (err) {
      if (err.message !== 'ZIP download cancelled') {
        addLog('error', `ZIP download error: ${err.message}`);
      }
    } finally {
      setIsZipping(false);
      setZipProgress(null);
    }
  };

  const handleCancelZip = () => {
    sound.playClick();
    zipRef.current.abort();
    setIsZipping(false);
    setZipProgress(null);
    addLog('warning', 'ZIP download cancelled.');
  };

  // --- MY DRIVE BROWSER HANDLERS ---
  const fetchMyDriveFolder = async (folderId = 'root') => {
    sound.playClick();
    setMyDriveLoading(true);
    setMyDriveError('');

    if (!token) {
      // Demo My Drive folders so the user can interact even without signing in
      await new Promise(r => setTimeout(r, 400));
      setMyDriveItems([
        { id: 'demo_fld_1', name: 'Marketing Campaigns 2026', mimeType: FOLDER_MIME, size: 0, modifiedTime: '2026-03-18' },
        { id: 'demo_fld_2', name: 'Raw 4K Video Masters', mimeType: FOLDER_MIME, size: 0, modifiedTime: '2026-03-15' },
        { id: 'demo_fld_3', name: 'Client Deliverables Q4', mimeType: FOLDER_MIME, size: 0, modifiedTime: '2026-03-12' },
        { id: 'demo_fld_4', name: 'Podcasts & Audio Stems', mimeType: FOLDER_MIME, size: 0, modifiedTime: '2026-03-08' },
        { id: 'demo_f1', name: 'BUILDBYFARAZ_Architecture.pdf', mimeType: 'application/pdf', size: 14200000, modifiedTime: '2026-03-19' },
        { id: 'demo_f2', name: 'Showreel_Master_1080p.mp4', mimeType: 'video/mp4', size: 485000000, modifiedTime: '2026-03-17' },
        { id: 'demo_f3', name: 'Production_Asset_Bundle.zip', mimeType: 'application/zip', size: 210000000, modifiedTime: '2026-03-14' }
      ]);
      setMyDriveLoading(false);
      return;
    }

    try {
      const q = `'${folderId}' in parents and trashed = false`;
      const res = await fetch(`${GDRIVE_BASE}/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,size,modifiedTime)&pageSize=100&orderBy=folder,name`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyDriveItems(data.files || []);
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}`);
      }
    } catch (e) {
      setMyDriveError(e.message || 'Failed to list Drive files.');
    } finally {
      setMyDriveLoading(false);
    }
  };

  const handleNavigateMyDrive = (item) => {
    if (item.mimeType === FOLDER_MIME) {
      setMyDriveFolderId(item.id);
      setMyDriveCrumbs(prev => [...prev, { id: item.id, name: item.name }]);
      fetchMyDriveFolder(item.id);
    }
  };

  const handleCrumbClick = (index) => {
    const target = myDriveCrumbs[index];
    setMyDriveFolderId(target.id);
    setMyDriveCrumbs(prev => prev.slice(0, index + 1));
    fetchMyDriveFolder(target.id);
  };

  // Switch to My Drive tab and load
  const handleOpenDriveBrowser = () => {
    setActiveMainTab('drive');
    fetchMyDriveFolder(myDriveFolderId);
  };

  // Handle Weigh Execution
  const handleRunWeigh = async (target) => {
    const tgt = target || weighTargetUrl || folderUrl || 'demo';
    setIsWeighing(true);
    addLog('info', `Weighing folder: ${tgt}...`);
    try {
      let resTree = null;
      if (token && tgt !== 'demo') {
        resTree = await clonerRef.current.scanFolder({ folderUrl: tgt, token });
      } else {
        await new Promise(r => setTimeout(r, 600));
        resTree = getDemoTreeData();
      }
      const breakdown = computeMetricsBreakdown(resTree.root);
      const topFiles = extractTopFiles(resTree.root, 5);
      setWeighData({
        metrics: resTree.metrics,
        breakdown,
        topFiles
      });
      recordActivity('WEIGH', resTree.metrics.rootName, resTree.metrics.totalFiles, resTree.metrics.totalBytes);
      addLog('success', `Weigh complete for "${resTree.metrics.rootName}" (${resTree.metrics.formattedSize}, ${resTree.metrics.totalFiles} files).`);
    } catch (err) {
      addLog('error', `Weigh failed: ${err.message}`);
    } finally {
      setIsWeighing(false);
    }
  };

  // Recursive Tree Node Renderer for Cloner Step 2
  const renderNode = (node, depth = 0) => {
    const isCollapsed = collapsedFolders.has(node.id);
    const hasChildren = (node.subfolders && node.subfolders.length > 0) || (node.files && node.files.length > 0);

    return (
      <div key={node.id} className="text-xs font-mono select-none">
        {/* Folder Header */}
        <div 
          className="flex items-center justify-between py-1.5 px-2 hover:bg-[#181F25] rounded-lg group transition-colors"
          style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasChildren ? (
              <button 
                type="button"
                onClick={() => toggleFolderCollapse(node.id)}
                className="text-[#9CA3AF] hover:text-[#F5F5F5] p-0.5 cursor-pointer"
              >
                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-4" />
            )}

            <input 
              type="checkbox"
              checked={node.selected !== false}
              onChange={(e) => toggleNodeSelection(node, e.target.checked)}
              className="rounded accent-[#D4AF37] cursor-pointer"
            />

            <Folder className="w-4 h-4 text-[#D4AF37] shrink-0" />

            {renamingId === node.id ? (
              <div className="flex items-center gap-1.5 flex-1">
                <input 
                  type="text" 
                  value={renamingVal}
                  onChange={(e) => setRenamingVal(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleApplyRename(node); }}
                  className="bg-[#080808] border border-[#D4AF37] px-2 py-0.5 rounded text-xs text-[#F5F5F5] w-full"
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => handleApplyRename(node)}
                  className="p-1 bg-[#D4AF37] text-[#080808] rounded"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span className="font-bold text-[#F5F5F5] truncate">
                {node.renamedName || node.name}
              </span>
            )}
          </div>

          <button 
            type="button"
            onClick={() => handleStartRename(node.id, node.renamedName || node.name)}
            className="p-1 text-[#9CA3AF] hover:text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            title="Rename folder"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        </div>

        {/* Children (Subfolders & Files) */}
        {!isCollapsed && (
          <div className="space-y-0.5">
            {node.subfolders && node.subfolders.map(sub => renderNode(sub, depth + 1))}

            {(() => {
              if (!node.files || node.files.length === 0) return null;
              const filtered = node.files.filter(f => !treeFilter || (f.renamedName || f.name).toLowerCase().includes(treeFilter.toLowerCase()));
              const isExpanded = expandedFolders.has(node.id) || !!treeFilter;
              const limit = isExpanded ? filtered.length : 50;
              const visibleFiles = filtered.slice(0, limit);
              const remainingCount = filtered.length - limit;

              return (
                <>
                  {visibleFiles.map(file => (
                    <div 
                      key={file.id}
                      className="flex items-center justify-between py-1 px-2 hover:bg-[#181F25]/60 rounded-lg group transition-colors"
                      style={{ paddingLeft: `${(depth + 1) * 1.25 + 0.5}rem` }}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-4" />
                        <input 
                          type="checkbox"
                          checked={file.selected !== false}
                          onChange={() => toggleSingleFile(file)}
                          className="rounded accent-[#D4AF37] cursor-pointer"
                        />
                        <File className="w-3.5 h-3.5 text-blue-400 shrink-0" />

                        {renamingId === file.id ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input 
                              type="text" 
                              value={renamingVal}
                              onChange={(e) => setRenamingVal(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleApplyRename(file); }}
                              className="bg-[#080808] border border-[#D4AF37] px-2 py-0.5 rounded text-xs text-[#F5F5F5] w-full"
                              autoFocus
                            />
                            <button 
                              type="button"
                              onClick={() => handleApplyRename(file)}
                              className="p-1 bg-[#D4AF37] text-[#080808] rounded"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#9CA3AF] group-hover:text-[#F5F5F5] transition-colors truncate">
                            {file.renamedName || file.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] text-[#6B7280]">
                          {formatBytes(file.size)}
                        </span>
                        <button 
                          type="button"
                          onClick={() => handleStartRename(file.id, file.renamedName || file.name)}
                          className="p-1 text-[#9CA3AF] hover:text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Rename file"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {remainingCount > 0 && (
                    <div 
                      style={{ paddingLeft: `${(depth + 1) * 1.25 + 0.5}rem` }}
                      className="py-1 px-2"
                    >
                      <button
                        type="button"
                        onClick={() => toggleExpandFolderFiles(node.id)}
                        className="text-[11px] font-mono text-[#D4AF37] hover:underline cursor-pointer flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[#181F25] border border-[#D4AF37]/30"
                      >
                        <span>↳ Showing 50 of {filtered.length} files • Click to reveal all (+{remainingCount} more)</span>
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">

      {/* 1. TOP AUTH & FARAZ BRANDING HEADER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#12161A] to-[#0A0D10] border border-[#485563]/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Zap className="w-6 h-6 fill-current" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#F5F5F5] font-display">
                BUILDBYFARAZ DriveUp Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono font-bold">
                64x SPEED • v6.8.2
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                token ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-[#D4AF37] border border-amber-500/30'
              }`}>
                {token ? '● GOOGLE CONNECTED' : '○ AUTH PENDING'}
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Lead Architect: <strong className="text-[#F5F5F5]">Faraz (Founder @ BUILDBYFARAZ)</strong> &bull; Zero-Bandwidth Cloud Duplication
            </p>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {userProfile ? (
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#080808] border border-emerald-500/30 text-xs font-mono">
              <img 
                src={userProfile.user?.photoLink || "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"} 
                alt="Avatar" 
                className="w-6 h-6 rounded-full border border-emerald-400/40"
              />
              <div className="text-left">
                <span className="text-[#F5F5F5] font-bold block leading-tight">{userProfile.user?.displayName || 'Connected User'}</span>
                <span className="text-[10px] text-emerald-400">{userProfile.user?.emailAddress}</span>
              </div>
              <button 
                type="button" 
                onClick={handleLogout}
                className="text-rose-400 hover:text-rose-300 ml-2 p-1"
                title="Disconnect Google Drive"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConnectModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Connect Google Account</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setConnectModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-[#181F25] hover:bg-[#222B34] border border-[#485563]/40 text-[#9CA3AF] hover:text-[#F5F5F5] text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Direct Token & OAuth Settings"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Connection Hub</span>
          </button>

          <button
            type="button"
            onClick={() => setDeveloperModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-[#181F25] hover:bg-[#222B34] border border-[#485563]/40 text-[#9CA3AF] hover:text-[#D4AF37] text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Faraz Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const enabled = sound.toggleSound();
              setSoundEnabled(enabled);
            }}
            className="p-2 rounded-xl bg-[#181F25] hover:bg-[#222B34] border border-[#485563]/40 text-[#9CA3AF] hover:text-[#D4AF37] transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* 2. AHM-INSPIRED TOP 4-TAB NAVIGATION BAR */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#12161A] border border-[#485563]/40 overflow-x-auto">
        <button
          type="button"
          onClick={() => { sound.playClick(); setActiveMainTab('overview'); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
            activeMainTab === 'overview'
              ? 'bg-[#D4AF37] text-[#080808] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              : 'text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#181F25]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview &amp; Metrics</span>
        </button>

        <button
          type="button"
          onClick={() => { sound.playClick(); handleOpenDriveBrowser(); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
            activeMainTab === 'drive'
              ? 'bg-[#D4AF37] text-[#080808] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              : 'text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#181F25]'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>My Drive Explorer</span>
        </button>

        <button
          type="button"
          onClick={() => { sound.playClick(); setActiveMainTab('tools'); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
            activeMainTab === 'tools'
              ? 'bg-[#D4AF37] text-[#080808] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              : 'text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#181F25]'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Tools &amp; Cloner Suite</span>
        </button>

        <button
          type="button"
          onClick={() => { sound.playClick(); setActiveMainTab('activity'); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
            activeMainTab === 'activity'
              ? 'bg-[#D4AF37] text-[#080808] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              : 'text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#181F25]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Activity Log</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#080808] text-[10px] text-[#D4AF37]">
            {activityHistory.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: OVERVIEW & COMMAND CENTER                                          */}
      {/* ========================================================================= */}
      {activeMainTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Storage Meter Gauge */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12161A] border border-[#485563]/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">STORAGE TELEMETRY</span>
                <h3 className="text-xl font-bold font-display text-[#F5F5F5]">Google Drive Quota Meter</h3>
              </div>
              <div className="text-xs font-mono text-[#9CA3AF]">
                {userProfile ? (
                  <span>Used: <strong className="text-[#F5F5F5]">{formatBytes(userProfile.storageQuota?.usage)}</strong> / {formatBytes(userProfile.storageQuota?.limit)}</span>
                ) : (
                  <span>Demo Mode: <strong className="text-[#F5F5F5]">2.4 GB</strong> / 15.0 GB</span>
                )}
              </div>
            </div>

            {/* Storage Bar */}
            <div className="w-full h-3.5 rounded-full bg-[#080808] border border-[#485563]/40 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-400 rounded-full transition-all duration-500"
                style={{
                  width: userProfile && userProfile.storageQuota?.limit 
                    ? `${Math.min(100, (userProfile.storageQuota.usage / userProfile.storageQuota.limit) * 100)}%`
                    : '16%'
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
              <span>Cloud Server: Active 24/7</span>
              <span>Speed Profile: 64 Continuous Streams</span>
              <span className="text-emerald-400 font-bold">100% Zero-Bandwidth</span>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#12161A] border border-[#485563]/40">
              <span className="text-xs font-mono text-[#9CA3AF] block">Folders Mirrored</span>
              <strong className="text-2xl font-bold text-[#F5F5F5] font-display mt-1 block">18.4K</strong>
              <span className="text-[10px] text-[#D4AF37] font-mono">100% Direct Cloud-to-Cloud</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#12161A] border border-[#485563]/40">
              <span className="text-xs font-mono text-[#9CA3AF] block">Total Files Transferred</span>
              <strong className="text-2xl font-bold text-[#F5F5F5] font-display mt-1 block">942.8K</strong>
              <span className="text-[10px] text-emerald-400 font-mono">Zero corrupted bytes</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#12161A] border border-[#485563]/40">
              <span className="text-xs font-mono text-[#9CA3AF] block">Local Bandwidth Saved</span>
              <strong className="text-2xl font-bold text-[#D4AF37] font-display mt-1 block">124.6 TB</strong>
              <span className="text-[10px] text-[#9CA3AF] font-mono">Zero PC internet used</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#12161A] border border-[#485563]/40">
              <span className="text-xs font-mono text-[#9CA3AF] block">Turbo Engine Rate</span>
              <strong className="text-2xl font-bold text-emerald-400 font-display mt-1 block">64x Speed</strong>
              <span className="text-[10px] text-[#9CA3AF] font-mono">500MB - 1.5GB/sec</span>
            </div>
          </div>

          {/* Quick Launchpad for 5 Workflows */}
          <div className="p-6 rounded-3xl bg-[#12161A] border border-[#485563]/40 space-y-4">
            <h3 className="text-lg font-bold font-display text-[#F5F5F5]">
              Core Workflows &amp; Actions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => { setActiveMainTab('tools'); setActiveToolSubTab('clone'); }}
                className="p-5 rounded-2xl bg-[#080808] border border-[#485563]/40 hover:border-[#D4AF37] transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#D4AF37] font-bold">01 — COPY IN</span>
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#D4AF37] transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-[#F5F5F5]">Turbo Folder Cloner</h4>
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Duplicate any shared folder directly into your Google Drive with nested subfolders at 64x speed.
                </p>
              </div>

              <div 
                onClick={() => { setActiveMainTab('drive'); fetchMyDriveFolder('root'); }}
                className="p-5 rounded-2xl bg-[#080808] border border-[#485563]/40 hover:border-[#D4AF37] transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-400 font-bold">02 — BROWSE</span>
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-blue-400 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-[#F5F5F5]">My Drive Explorer</h4>
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Navigate your Drive folders live, view sizes, and launch 1-click clones, tags, or size checks.
                </p>
              </div>

              <div 
                onClick={() => { setActiveMainTab('tools'); setActiveToolSubTab('weigh'); }}
                className="p-5 rounded-2xl bg-[#080808] border border-[#485563]/40 hover:border-[#D4AF37] transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold">03 — WEIGH / SIZE</span>
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-emerald-400 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-[#F5F5F5]">Folder Weight Calculator</h4>
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Deep scan any folder to calculate total bytes, subfolders, and media breakdown (Videos, Audio, Docs).
                </p>
              </div>

              <div 
                onClick={() => { setActiveMainTab('tools'); setActiveToolSubTab('tag'); }}
                className="p-5 rounded-2xl bg-[#080808] border border-[#485563]/40 hover:border-[#D4AF37] transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold">04 — TAG / UNTAG</span>
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-amber-400 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-[#F5F5F5]">Batch File Tagger</h4>
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Stamp custom branding tags like [BUILDBYFARAZ] across an entire folder tree, or cleanly strip existing tags.
                </p>
              </div>

              <div 
                onClick={() => { setActiveMainTab('tools'); setActiveToolSubTab('promo'); }}
                className="p-5 rounded-2xl bg-[#080808] border border-[#485563]/40 hover:border-[#D4AF37] transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400 font-bold">05 — PROMO SEED</span>
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-purple-400 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-[#F5F5F5]">README &amp; Notice Injector</h4>
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Automatically create and seed a customized notice or promo file into the target folder and all subfolders.
                </p>
              </div>

              <div 
                onClick={() => { setActiveMainTab('tools'); setActiveToolSubTab('renamer'); }}
                className="p-5 rounded-2xl bg-[#080808] border border-[#485563]/40 hover:border-[#D4AF37] transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-rose-400 font-bold">06 — BATCH RENAME</span>
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-rose-400 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-[#F5F5F5]">Find &amp; Replace / Numbering</h4>
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Format files sequentially (e.g. Video 01), replace unwanted strings, or add prefix/suffix rules.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: AHM-INSPIRED INTERACTIVE "MY DRIVE" BROWSER                       */}
      {/* ========================================================================= */}
      {activeMainTab === 'drive' && (
        <div className="rounded-3xl bg-[#12161A] border border-[#485563]/40 p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#485563]/30 pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block mb-1">
                MY DRIVE DIRECT EXPLORER
              </span>
              <h3 className="text-xl font-bold text-[#F5F5F5] font-display">
                Browse Google Drive Workspace
              </h3>
              <p className="text-xs font-mono text-[#9CA3AF] mt-1">
                Live navigation inside your authenticated account &bull; Select any folder to clone, weigh, or tag
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchMyDriveFolder(myDriveFolderId)}
                disabled={myDriveLoading}
                className="px-3.5 py-2 rounded-xl bg-[#080808] border border-[#485563]/40 text-xs font-mono text-[#F5F5F5] hover:border-[#D4AF37] flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${myDriveLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#080808] border border-[#485563]/40 overflow-x-auto text-xs font-mono">
            {myDriveCrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id + idx}>
                {idx > 0 && <span className="text-[#485563]">/</span>}
                <button
                  type="button"
                  onClick={() => handleCrumbClick(idx)}
                  className={`hover:underline cursor-pointer ${
                    idx === myDriveCrumbs.length - 1 ? 'text-[#D4AF37] font-bold' : 'text-[#9CA3AF]'
                  }`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Items Table */}
          {myDriveLoading ? (
            <div className="py-16 text-center text-xs font-mono text-[#9CA3AF] space-y-3">
              <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
              <span>Fetching Drive folder hierarchy...</span>
            </div>
          ) : myDriveItems.length === 0 ? (
            <div className="py-16 text-center text-xs font-mono text-[#9CA3AF]">
              Folder is empty.
            </div>
          ) : (
            <div className="divide-y divide-[#485563]/20 rounded-2xl bg-[#080808] border border-[#485563]/40 overflow-hidden text-xs font-mono">
              {myDriveItems.map((item) => {
                const isFolder = item.mimeType === FOLDER_MIME;
                return (
                  <div 
                    key={item.id}
                    className="p-3.5 hover:bg-[#181F25] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div 
                      onClick={() => isFolder && handleNavigateMyDrive(item)}
                      className={`flex items-center gap-3 flex-1 min-w-0 ${isFolder ? 'cursor-pointer' : ''}`}
                    >
                      {isFolder ? (
                        <Folder className="w-5 h-5 text-[#D4AF37] shrink-0" />
                      ) : (
                        <File className="w-5 h-5 text-blue-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className={`font-bold block truncate ${isFolder ? 'text-[#F5F5F5] hover:text-[#D4AF37]' : 'text-[#9CA3AF]'}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#6B7280]">
                          {isFolder ? 'Folder' : formatBytes(item.size)} &bull; {item.modifiedTime ? item.modifiedTime.slice(0, 10) : 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons per item */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isFolder ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setFolderUrl(item.id);
                              setActiveMainTab('tools');
                              setActiveToolSubTab('clone');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-[#080808] text-[11px] font-bold cursor-pointer transition-colors"
                            title="Clone this folder"
                          >
                            ⚡ Clone
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setWeighTargetUrl(item.id);
                              setActiveMainTab('tools');
                              setActiveToolSubTab('weigh');
                              handleRunWeigh(item.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black text-[11px] cursor-pointer transition-colors"
                            title="Check folder size"
                          >
                            ⚖️ Weigh
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setFolderUrl(item.id);
                              setTagModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#181F25] text-[#9CA3AF] border border-[#485563]/40 hover:text-[#F5F5F5] text-[11px] cursor-pointer"
                            title="Tag files"
                          >
                            🏷️ Tag
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-[#6B7280]">
                          {formatBytes(item.size)}
                        </span>
                      )}

                      <a
                        href={`https://drive.google.com/drive/folders/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-[#9CA3AF] hover:text-[#F5F5F5]"
                        title="Open in Google Drive"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: TOOLS & CLONER SUITE                                              */}
      {/* ========================================================================= */}
      {activeMainTab === 'tools' && (
        <div className="space-y-6">

          {/* Sub-tool Selector Bar */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#080808] border border-[#485563]/40 overflow-x-auto text-xs font-mono">
            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveToolSubTab('clone'); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeToolSubTab === 'clone' ? 'bg-[#D4AF37] text-[#080808]' : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
              }`}
            >
              01 — 64x Cloud Clone
            </button>
            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveToolSubTab('weigh'); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeToolSubTab === 'weigh' ? 'bg-[#D4AF37] text-[#080808]' : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
              }`}
            >
              02 — Weigh &amp; Size
            </button>
            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveToolSubTab('tag'); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeToolSubTab === 'tag' ? 'bg-[#D4AF37] text-[#080808]' : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
              }`}
            >
              03 — Tag / Untag
            </button>
            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveToolSubTab('promo'); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeToolSubTab === 'promo' ? 'bg-[#D4AF37] text-[#080808]' : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
              }`}
            >
              04 — Promo / Seed
            </button>
            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveToolSubTab('renamer'); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeToolSubTab === 'renamer' ? 'bg-[#D4AF37] text-[#080808]' : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
              }`}
            >
              05 — Batch Renamer
            </button>
          </div>

          {/* SUB-TOOL 01: 64X CLONER */}
          {activeToolSubTab === 'clone' && (
            <div className="space-y-6">
              
              {/* Step 1: Input & Configuration */}
              <div className="rounded-3xl bg-[#12161A] border border-[#485563]/40 p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#485563]/30 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block mb-1">
                      STEP 1 // SOURCE FOLDER &amp; SCANNER
                    </span>
                    <h3 className="text-xl font-bold text-[#F5F5F5] font-display">
                      Google Drive Shared Folder Link
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setFolderUrl('root');
                        setScanError('');
                      }}
                      className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Folder className="w-3.5 h-3.5" />
                      <span>📂 My Drive (Root)</span>
                    </button>
                    <span className="text-[#485563]">|</span>
                    <button
                      type="button"
                      onClick={handleLoadDemo}
                      className="text-xs font-mono text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>⚡ Load Sample Demo Link</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleScan} className="space-y-4">
                  <div className="relative">
                    <FolderOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input 
                      type="text" 
                      placeholder="Paste public or shared Google Drive folder URL (e.g. https://drive.google.com/drive/folders/1BxiMVs0XRA5... or 'root')"
                      value={folderUrl}
                      onChange={(e) => setFolderUrl(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] text-xs sm:text-sm font-mono focus:border-[#D4AF37] focus:outline-none placeholder-[#9CA3AF]/40 shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-[#9CA3AF] block mb-1">
                        Destination Folder Name:
                      </label>
                      <input 
                        type="text" 
                        placeholder="Copy of Shared Folder"
                        value={destFolderName}
                        onChange={(e) => setDestFolderName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] text-xs font-mono focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-[#9CA3AF] block mb-1">
                        Parallel Concurrency (Warp Speed):
                      </label>
                      <select
                        value={concurrency}
                        onChange={(e) => setConcurrency(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] text-xs font-mono focus:border-[#D4AF37] focus:outline-none cursor-pointer"
                      >
                        <option value={64}>⚡ 64x Warp Speed (64 Continuous Streams • 500+ MB/s - 1.5 GB/s)</option>
                        <option value={48}>🚀 48x Turbo Speed (48 Parallel Streams • 250+ MB/s)</option>
                        <option value={32}>🚄 32x Ultra Speed (32 Parallel Streams • 100+ MB/s)</option>
                        <option value={16}>🛡️ 16 Parallel Streams (Fast Safe Mode)</option>
                        <option value={8}>⚖️ 8 Parallel Streams (Balanced Mode)</option>
                      </select>
                    </div>
                  </div>

                  {scanError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{scanError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
                    <span className="text-xs font-mono text-[#9CA3AF]">
                      {scanMessage || '100% cloud server-side duplication • Zero local bandwidth used'}
                    </span>

                    <button
                      type="submit"
                      disabled={isScanning}
                      className="px-7 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>SCANNING HIERARCHY...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>SCAN FOLDER CONTENT</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Step 2: Tree Preview & Actions */}
              {treeData && (
                <div className="rounded-3xl bg-[#12161A] border border-[#485563]/40 p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#485563]/30 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block mb-1">
                        STEP 2 // HIERARCHY PREVIEW &amp; BATCH CUSTOMIZER
                      </span>
                      <h3 className="text-xl font-bold text-[#F5F5F5] font-display">
                        {treeData.metrics.rootName}
                      </h3>
                      <p className="text-xs font-mono text-[#9CA3AF] mt-1">
                        {treeData.metrics.totalFiles} Files &bull; {treeData.metrics.totalFolders} Folders &bull; Total: <strong className="text-[#D4AF37]">{treeData.metrics.formattedSize}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setBatchRenameOpen(true)}
                        className="px-3 py-2 rounded-xl bg-[#181F25] hover:bg-[#222B34] border border-[#485563]/40 text-[#F5F5F5] text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Batch Rename</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTagModalOpen(true)}
                        className="px-3 py-2 rounded-xl bg-[#181F25] hover:bg-[#222B34] border border-[#485563]/40 text-[#F5F5F5] text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>🏷️ Tag / Untag</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPromoModalOpen(true)}
                        className="px-3 py-2 rounded-xl bg-[#181F25] hover:bg-[#222B34] border border-[#485563]/40 text-emerald-400 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>📌 Promo Seed</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDownloadModalOpen(true)}
                        className="px-3 py-2 rounded-xl bg-[#181F25] hover:bg-[#222B34] border border-blue-500/40 text-blue-400 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Stream ZIP</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleStartClone}
                        disabled={isCloning}
                        className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Zap className="w-4 h-4 fill-current" />
                        <span>START CLOUD CLONE</span>
                      </button>
                    </div>
                  </div>

                  {/* Storage Breakdown & Folder Weigh Inspector */}
                  {(() => {
                    const breakdown = computeMetricsBreakdown(treeData.root);
                    if (!breakdown) return null;
                    return (
                      <div className="p-4 rounded-2xl bg-[#080808] border border-[#485563]/30 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-[#12161A] border border-rose-500/20">
                          <span className="text-rose-400 block font-bold">🎬 Videos</span>
                          <strong className="text-[#F5F5F5]">{breakdown.videos.count} files</strong>
                          <span className="text-[10px] text-[#9CA3AF] block">{formatBytes(breakdown.videos.bytes)}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#12161A] border border-blue-500/20">
                          <span className="text-blue-400 block font-bold">🎵 Audio</span>
                          <strong className="text-[#F5F5F5]">{breakdown.audios.count} files</strong>
                          <span className="text-[10px] text-[#9CA3AF] block">{formatBytes(breakdown.audios.bytes)}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#12161A] border border-amber-500/20">
                          <span className="text-amber-400 block font-bold">📄 Documents</span>
                          <strong className="text-[#F5F5F5]">{breakdown.docs.count} files</strong>
                          <span className="text-[10px] text-[#9CA3AF] block">{formatBytes(breakdown.docs.bytes)}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#12161A] border border-emerald-500/20">
                          <span className="text-emerald-400 block font-bold">🖼️ Images</span>
                          <strong className="text-[#F5F5F5]">{breakdown.images.count} files</strong>
                          <span className="text-[10px] text-[#9CA3AF] block">{formatBytes(breakdown.images.bytes)}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#12161A] border border-purple-500/20 col-span-2 sm:col-span-1">
                          <span className="text-purple-400 block font-bold">📦 Archives/Other</span>
                          <strong className="text-[#F5F5F5]">{breakdown.archives.count + breakdown.other.count} files</strong>
                          <span className="text-[10px] text-[#9CA3AF] block">{formatBytes(breakdown.archives.bytes + breakdown.other.bytes)}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Search Filter in Tree */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                      <input 
                        type="text" 
                        placeholder="Filter files in tree by name..."
                        value={treeFilter}
                        onChange={(e) => setTreeFilter(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080808] border border-[#485563]/40 text-xs font-mono text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleNodeSelection(treeData.root, true)}
                        className="text-xs font-mono text-[#D4AF37] hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-[#485563]">|</span>
                      <button
                        type="button"
                        onClick={() => toggleNodeSelection(treeData.root, false)}
                        className="text-xs font-mono text-[#9CA3AF] hover:underline cursor-pointer"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  {/* Tree Scroll View */}
                  <div className="max-h-[420px] overflow-y-auto rounded-2xl bg-[#080808] border border-[#485563]/40 p-4 divide-y divide-[#485563]/10">
                    {renderNode(treeData.root)}
                  </div>
                </div>
              )}

              {/* Step 3: Cloud Cloning Progress */}
              {isCloning && (
                <div className="rounded-3xl bg-[#12161A] border border-[#D4AF37]/50 p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#485563]/30 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#D4AF37] animate-ping" />
                      <div>
                        <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block">
                          STEP 3 // CLOUD CLONING IN PROGRESS
                        </span>
                        <h3 className="text-lg font-bold text-[#F5F5F5] font-display">
                          Copying Files on Google Cloud Servers...
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCancelClone}
                      className="px-4 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Cancel Operation</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full h-3 rounded-full bg-[#080808] border border-[#485563]/40 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-300 rounded-full"
                        style={{ width: `${cloneProgress.percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
                      <span>Copied: <strong className="text-[#F5F5F5]">{cloneProgress.copiedFiles} / {cloneProgress.totalFiles}</strong> files</span>
                      <span>Speed: <strong className="text-[#D4AF37]">{cloneProgress.speedFilesPerSec} files/s</strong> ({cloneProgress.speedFormatted})</span>
                      <span>ETA: <strong className="text-[#F5F5F5]">{cloneProgress.etaSeconds}s</strong></span>
                      <span className="text-[#D4AF37] font-bold text-sm">{cloneProgress.percent}%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080808] border border-[#485563]/30 text-xs font-mono flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37] animate-spin shrink-0" />
                    <span className="text-[#9CA3AF]">Current:</span>
                    <span className="text-[#F5F5F5] truncate">{cloneProgress.currentFile || 'Initializing batch...'}</span>
                  </div>
                </div>
              )}

              {/* Step 4: Success Card */}
              {cloneResult && (
                <div className="rounded-3xl bg-[#12161A] border border-emerald-500/50 p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-3 border-b border-[#485563]/30 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase block">
                        STEP 4 // CLONING COMPLETE
                      </span>
                      <h3 className="text-xl font-bold text-[#F5F5F5] font-display">
                        Folder Successfully Cloned to Your Google Drive!
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-[#080808] border border-[#485563]/30">
                      <span className="text-[#9CA3AF] block">Files Cloned:</span>
                      <strong className="text-base text-[#F5F5F5]">{cloneResult.copiedFiles}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[#080808] border border-[#485563]/30">
                      <span className="text-[#9CA3AF] block">Total Size:</span>
                      <strong className="text-base text-[#D4AF37]">{formatBytes(cloneResult.totalBytes)}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[#080808] border border-[#485563]/30">
                      <span className="text-[#9CA3AF] block">Elapsed Time:</span>
                      <strong className="text-base text-[#F5F5F5]">{cloneResult.elapsedTime}s</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[#080808] border border-[#485563]/30">
                      <span className="text-[#9CA3AF] block">Status:</span>
                      <strong className="text-base text-emerald-400">100% Mirrored</strong>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* SUB-TOOL 02: WEIGH & SIZE ENGINE */}
          {activeToolSubTab === 'weigh' && (
            <div className="rounded-3xl bg-[#12161A] border border-[#485563]/40 p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
              <div className="border-b border-[#485563]/30 pb-4">
                <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block mb-1">
                  WORKFLOW 02 // WEIGH &amp; SIZE ENGINE
                </span>
                <h3 className="text-xl font-bold text-[#F5F5F5] font-display">
                  Folder Weight &amp; Media Breakdown Calculator
                </h3>
                <p className="text-xs font-mono text-[#9CA3AF] mt-1">
                  Calculate recursive file size and inspect video, audio, document, and archive proportions before downloading
                </p>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Paste Google Drive folder URL or ID (or 'demo')"
                  value={weighTargetUrl}
                  onChange={(e) => setWeighTargetUrl(e.target.value)}
                  className="flex-1 bg-[#080808] border border-[#485563]/60 px-4 py-3 rounded-xl text-xs font-mono text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRunWeigh()}
                  disabled={isWeighing}
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold rounded-xl text-xs font-mono flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isWeighing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>⚖️ Calculate Weight</span>}
                </button>
              </div>

              {weighData && (
                <div className="space-y-6 pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="p-4 rounded-xl bg-[#080808] border border-[#485563]/30">
                      <span className="text-[#9CA3AF] block">Folder Name:</span>
                      <strong className="text-sm text-[#F5F5F5] truncate block mt-0.5">{weighData.metrics?.rootName}</strong>
                    </div>
                    <div className="p-4 rounded-xl bg-[#080808] border border-[#485563]/30">
                      <span className="text-[#9CA3AF] block">Total Size:</span>
                      <strong className="text-lg text-[#D4AF37] block mt-0.5">{weighData.metrics?.formattedSize}</strong>
                    </div>
                    <div className="p-4 rounded-xl bg-[#080808] border border-[#485563]/30">
                      <span className="text-[#9CA3AF] block">Files Count:</span>
                      <strong className="text-lg text-[#F5F5F5] block mt-0.5">{weighData.metrics?.totalFiles} items</strong>
                    </div>
                    <div className="p-4 rounded-xl bg-[#080808] border border-[#485563]/30">
                      <span className="text-[#9CA3AF] block">Subfolders:</span>
                      <strong className="text-lg text-emerald-400 block mt-0.5">{weighData.metrics?.totalFolders} folders</strong>
                    </div>
                  </div>

                  {/* Breakdown Cards */}
                  {weighData.breakdown && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-[#080808] border border-rose-500/30">
                        <span className="text-rose-400 block font-bold">🎬 Videos</span>
                        <strong className="text-base text-[#F5F5F5] block mt-1">{weighData.breakdown.videos.count} files</strong>
                        <span className="text-[10px] text-[#9CA3AF]">{formatBytes(weighData.breakdown.videos.bytes)}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#080808] border border-blue-500/30">
                        <span className="text-blue-400 block font-bold">🎵 Audio</span>
                        <strong className="text-base text-[#F5F5F5] block mt-1">{weighData.breakdown.audios.count} files</strong>
                        <span className="text-[10px] text-[#9CA3AF]">{formatBytes(weighData.breakdown.audios.bytes)}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#080808] border border-amber-500/30">
                        <span className="text-amber-400 block font-bold">📄 Documents</span>
                        <strong className="text-base text-[#F5F5F5] block mt-1">{weighData.breakdown.docs.count} files</strong>
                        <span className="text-[10px] text-[#9CA3AF]">{formatBytes(weighData.breakdown.docs.bytes)}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#080808] border border-emerald-500/30">
                        <span className="text-emerald-400 block font-bold">🖼️ Images</span>
                        <strong className="text-base text-[#F5F5F5] block mt-1">{weighData.breakdown.images.count} files</strong>
                        <span className="text-[10px] text-[#9CA3AF]">{formatBytes(weighData.breakdown.images.bytes)}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#080808] border border-purple-500/30">
                        <span className="text-purple-400 block font-bold">📦 Archives</span>
                        <strong className="text-base text-[#F5F5F5] block mt-1">{weighData.breakdown.archives.count} files</strong>
                        <span className="text-[10px] text-[#9CA3AF]">{formatBytes(weighData.breakdown.archives.bytes)}</span>
                      </div>
                    </div>
                  )}

                  {/* Top 5 Largest Files */}
                  {weighData.topFiles && weighData.topFiles.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[#080808] border border-[#485563]/30 space-y-2">
                      <span className="text-xs font-mono text-[#D4AF37] font-bold block">Top Largest Files in Folder:</span>
                      <div className="divide-y divide-[#485563]/20 text-xs font-mono">
                        {weighData.topFiles.map((f, i) => (
                          <div key={i} className="py-2 flex items-center justify-between">
                            <span className="text-[#F5F5F5] truncate max-w-md">{f.name}</span>
                            <span className="text-[#D4AF37] font-bold">{formatBytes(f.size)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SUB-TOOL 03: TAG / UNTAG */}
          {activeToolSubTab === 'tag' && (
            <div className="rounded-3xl bg-[#12161A] border border-[#485563]/40 p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn text-xs font-mono">
              <div className="border-b border-[#485563]/30 pb-4">
                <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block mb-1">
                  WORKFLOW 03 // TAG &amp; UNTAG ENGINE
                </span>
                <h3 className="text-xl font-bold text-[#F5F5F5] font-display">
                  Batch Tag &amp; Watermark Stamping
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Prepend brand tags to every file in a tree or strip existing prefixes cleanly
                </p>
              </div>

              <div className="flex rounded-xl bg-[#080808] p-1 border border-[#485563]/40 max-w-md">
                <button
                  type="button"
                  onClick={() => setTagActionType('add')}
                  className={`flex-1 py-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                    tagActionType === 'add' ? 'bg-[#D4AF37] text-[#080808]' : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
                  }`}
                >
                  ➕ Add Tag (Prefix)
                </button>
                <button
                  type="button"
                  onClick={() => setTagActionType('remove')}
                  className={`flex-1 py-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                    tagActionType === 'remove' ? 'bg-rose-500 text-white' : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
                  }`}
                >
                  ✂️ Strip Tag (Remove)
                </button>
              </div>

              <div className="space-y-2 max-w-md">
                <label className="text-[#9CA3AF] block font-bold">
                  {tagActionType === 'add' ? 'Tag Label to Prepend:' : 'Tag String to Strip:'}
                </label>
                <input 
                  type="text" 
                  value={tagInputValue}
                  onChange={(e) => setTagInputValue(e.target.value)}
                  placeholder="e.g. [BUILDBYFARAZ] or — Faraz"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <span className="text-[#9CA3AF] block text-[11px]">Quick Tag Presets:</span>
                <div className="flex gap-2 flex-wrap">
                  {['[BUILDBYFARAZ]', '[FARAZ]', '[VIP]', '[4K-MASTER]', '[ARCHIVE]'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTagInputValue(p)}
                      className="px-3 py-1 rounded-lg bg-[#080808] border border-[#485563]/40 text-[#D4AF37] hover:border-[#D4AF37] cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (treeData) {
                    if (tagActionType === 'add') handleAddTagToAll(tagInputValue);
                    else handleRemoveTagFromAll(tagInputValue);
                  } else {
                    addLog('info', `Tag preset "${tagInputValue}" ready. Scan a folder to apply.`);
                  }
                }}
                className={`px-6 py-3 rounded-xl font-bold cursor-pointer transition-all ${
                  tagActionType === 'add' ? 'bg-[#D4AF37] text-[#080808]' : 'bg-rose-600 text-white'
                }`}
              >
                {tagActionType === 'add' ? 'Apply Tag Everywhere' : 'Strip Tag Everywhere'}
              </button>
            </div>
          )}

          {/* SUB-TOOL 04: PROMO / SEED INJECTOR */}
          {activeToolSubTab === 'promo' && (
            <div className="rounded-3xl bg-[#12161A] border border-[#485563]/40 p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn text-xs font-mono">
              <div className="border-b border-[#485563]/30 pb-4">
                <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block mb-1">
                  WORKFLOW 04 // PROMO &amp; NOTICE SEED INJECTOR
                </span>
                <h3 className="text-xl font-bold text-[#F5F5F5] font-display">
                  Inject Notice / README File in Target Trees
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Automatically creates promotional or documentation text files inside cloned Google Drive folders &amp; ZIPs
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#080808] border border-emerald-500/30 flex items-center justify-between max-w-xl">
                <div>
                  <strong className="text-emerald-400 block font-bold">Active Notice Seeder</strong>
                  <span className="text-[10px] text-[#9CA3AF]">
                    When enabled, this file will be automatically inserted into the root and all subfolders.
                  </span>
                </div>
                <input 
                  type="checkbox"
                  checked={promoNotice.enabled}
                  onChange={(e) => setPromoNotice({ ...promoNotice, enabled: e.target.checked })}
                  className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="text-[#9CA3AF] block mb-1">File Name:</label>
                  <input 
                    type="text" 
                    value={promoNotice.filename}
                    onChange={(e) => setPromoNotice({ ...promoNotice, filename: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/40 text-[#F5F5F5] focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#9CA3AF] block mb-1">Notice Content:</label>
                  <textarea 
                    rows={8}
                    value={promoNotice.content}
                    onChange={(e) => setPromoNotice({ ...promoNotice, content: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/40 text-[#F5F5F5] focus:border-emerald-500 focus:outline-none leading-relaxed text-[11px]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    addLog('success', `Promo seed "${promoNotice.filename}" configured!`);
                  }}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold cursor-pointer"
                >
                  Save Notice Template
                </button>
              </div>
            </div>
          )}

          {/* SUB-TOOL 05: BATCH RENAMER */}
          {activeToolSubTab === 'renamer' && (
            <div className="rounded-3xl bg-[#12161A] border border-[#485563]/40 p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn text-xs font-mono">
              <div className="border-b border-[#485563]/30 pb-4">
                <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block mb-1">
                  WORKFLOW 05 // BATCH RENAMING RULES
                </span>
                <h3 className="text-xl font-bold text-[#F5F5F5] font-display">
                  Find &amp; Replace and Pattern Formatter
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <div>
                  <label className="text-[#9CA3AF] block mb-1">Target File Type:</label>
                  <select
                    value={batchRule.targetType}
                    onChange={(e) => setBatchRule({ ...batchRule, targetType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/40 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="all">All Files &amp; Folders</option>
                    <option value="videos">Videos Only (.mp4, .mkv, .mov)</option>
                    <option value="docs">Documents Only (.pdf, .txt, .docx)</option>
                    <option value="folders">Folders Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#9CA3AF] block mb-1">Sequential Pattern:</label>
                  <input 
                    type="text" 
                    value={batchRule.pattern}
                    onChange={(e) => setBatchRule({ ...batchRule, pattern: e.target.value })}
                    placeholder="Video {N}"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/40 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#9CA3AF] block mb-1">Find Text:</label>
                  <input 
                    type="text" 
                    value={batchRule.findText}
                    onChange={(e) => setBatchRule({ ...batchRule, findText: e.target.value })}
                    placeholder="e.g. Unwanted_Watermark"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/40 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#9CA3AF] block mb-1">Replace With:</label>
                  <input 
                    type="text" 
                    value={batchRule.replaceText}
                    onChange={(e) => setBatchRule({ ...batchRule, replaceText: e.target.value })}
                    placeholder="e.g. BUILDBYFARAZ"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/40 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleApplyBatchRename}
                  className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold cursor-pointer"
                >
                  Apply Rules to Scanned Tree
                </button>
                <button
                  type="button"
                  onClick={handleResetRenames}
                  className="px-4 py-3 rounded-xl bg-[#080808] border border-[#485563]/40 text-[#9CA3AF] hover:text-[#F5F5F5] cursor-pointer"
                >
                  Reset to Original Names
                </button>
              </div>
            </div>
          )}

          {/* Terminal Console Logs */}
          <div className="rounded-3xl bg-[#080808] border border-[#485563]/40 p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#485563]/30 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-mono font-bold text-[#F5F5F5]">
                  DriveUp Cloud Cloner Execution Telemetry
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  className="text-[10px] font-mono text-[#9CA3AF] hover:text-[#D4AF37] cursor-pointer"
                >
                  Clear Console
                </button>
                <span className="text-[10px] font-mono text-emerald-400">
                  ● 24/7 Serverless Stream
                </span>
              </div>
            </div>

            <div 
              ref={logContainerRef}
              className="h-32 overflow-y-auto space-y-1 text-[11px] font-mono pr-2 scrollbar-thin"
            >
              {logs.map(l => (
                <div key={l.id} className="flex items-start gap-2">
                  <span className="text-[#6B7280] shrink-0">[{l.time}]</span>
                  <span className={
                    l.type === 'error' ? 'text-rose-400' :
                    l.type === 'warning' ? 'text-amber-400' :
                    l.type === 'success' ? 'text-emerald-400' : 'text-[#9CA3AF]'
                  }>
                    {l.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: ACTIVITY LOG                                                      */}
      {/* ========================================================================= */}
      {activeMainTab === 'activity' && (
        <div className="rounded-3xl bg-[#12161A] border border-[#485563]/40 p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn text-xs font-mono">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#485563]/30 pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block mb-1">
                SESSION OPERATIONS HISTORY
              </span>
              <h3 className="text-xl font-bold text-[#F5F5F5] font-display">
                DriveUp Operations Audit Log
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActivityHistory([]);
                  try { localStorage.removeItem('bbf_driveup_activity'); } catch(e) {}
                }}
                className="px-3 py-1.5 rounded-lg bg-[#080808] border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              >
                Clear History
              </button>
            </div>
          </div>

          {/* Activity Table */}
          <div className="divide-y divide-[#485563]/20 rounded-2xl bg-[#080808] border border-[#485563]/40 overflow-hidden">
            {activityHistory.length === 0 ? (
              <div className="py-12 text-center text-[#9CA3AF]">
                No recent activity recorded. Run a scan, clone, or weigh operation to see logs here.
              </div>
            ) : (
              activityHistory.map(act => (
                <div key={act.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#12161A] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      act.type === 'CLONE' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30' :
                      act.type === 'WEIGH' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      act.type === 'TAG' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {act.type}
                    </span>
                    <div>
                      <strong className="text-[#F5F5F5] block">{act.target}</strong>
                      <span className="text-[10px] text-[#6B7280]">
                        {act.count} items &bull; {act.size ? formatBytes(act.size) : 'Calculated'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-400 font-bold block">{act.status}</span>
                    <span className="text-[10px] text-[#6B7280]">{act.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: BUILDBYFARAZ GOOGLE CONNECTION HUB                                */}
      {/* ========================================================================= */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-3xl bg-[#12161A] border border-[#D4AF37]/50 p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn text-xs font-mono max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#485563]/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-[#F5F5F5]">
                    BUILDBYFARAZ Google Drive Connect Hub
                  </h3>
                  <span className="text-[10px] text-[#9CA3AF]">
                    Architect: Faraz (Founder &amp; Principal Engineer @ BUILDBYFARAZ)
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setConnectModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#F5F5F5] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Notice regarding Google Console Branding */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300 leading-relaxed">
              <strong className="block text-[#D4AF37] font-bold mb-0.5">ℹ️ Google OAuth Screen Branding Note:</strong>
              Google Cloud displays the registered project name (<code className="bg-[#080808] px-1 py-0.5 rounded text-[#F5F5F5]">cssaspirants</code>) when authorizing Client ID <code className="bg-[#080808] px-1 py-0.5 rounded text-[#F5F5F5]">683510638536...</code>. To rename this on Google&apos;s screen, update the OAuth Consent Screen in <a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" rel="noopener noreferrer" className="underline text-[#D4AF37]">Google Cloud Console</a> to <strong>BUILDBYFARAZ</strong>. Alternatively, use <strong>Method 2</strong> below for instant 1-click connection without any Google screens or redirects!
            </div>

            {/* Method 1: 1-Click Google Sign-in */}
            <div className="p-4 rounded-2xl bg-[#080808] border border-[#D4AF37]/30 space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-sm text-[#D4AF37]">Method 1: Instant Google Sign-In</strong>
                <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold">FASTEST</span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                Connect your personal Google account directly through Faraz&apos;s deployed high-speed bridge. When authorization completes, the window automatically closes in &lt;400ms and links your Drive workspace.
              </p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Launch Google Sign-In Window</span>
              </button>
            </div>

            {/* Method 2: Paste Access Token / OAuth Playground */}
            <div className="p-4 rounded-2xl bg-[#080808] border border-[#485563]/40 space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-sm text-blue-400">Method 2: Direct Bearer Token (Zero-Auth)</strong>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">100% RELIABLE</span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                Paste any valid Google Drive access token (e.g. from Google OAuth Playground) for instant connection without redirects:
              </p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="ya29.a0AcM612..." 
                  value={manualTokenInput}
                  onChange={(e) => setManualTokenInput(e.target.value)}
                  className="flex-1 bg-[#12161A] border border-[#485563]/60 px-3 py-2 rounded-lg text-xs font-mono text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSaveToken(manualTokenInput)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold cursor-pointer"
                >
                  Verify &amp; Save
                </button>
              </div>
              <a
                href="https://developers.google.com/oauthplayground/#step1&apisSelect=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#D4AF37] hover:underline"
              >
                <span>↗ Open Google OAuth Playground with Drive Scope preselected</span>
              </a>
            </div>

            {/* Method 3: Custom Google Cloud Client ID */}
            <div className="p-4 rounded-2xl bg-[#080808] border border-[#485563]/40 space-y-2">
              <strong className="text-sm text-[#F5F5F5] block">Method 3: Custom Google Cloud Client ID</strong>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                Want to use your own Google Cloud console project? Enter your Client ID here:
              </p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="your-custom-client-id.apps.googleusercontent.com" 
                  value={customClientId}
                  onChange={(e) => {
                    setCustomClientId(e.target.value);
                    try { localStorage.setItem('bbf_custom_client_id', e.target.value); } catch(err) {}
                  }}
                  className="flex-1 bg-[#12161A] border border-[#485563]/60 px-3 py-2 rounded-lg text-xs font-mono text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-[#6B7280]">
                Support: faggaf786678@gmail.com &bull; WhatsApp: +92 328 4487595
              </span>
              <button
                type="button"
                onClick={() => setConnectModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#181F25] text-[#F5F5F5] hover:bg-[#222B34] cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FARAZ ARCHITECT PROFILE                                          */}
      {/* ========================================================================= */}
      {developerModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-[#12161A] border border-[#D4AF37]/50 p-6 sm:p-8 space-y-5 shadow-2xl animate-fadeIn text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#485563]/30">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="text-base font-bold font-display text-[#F5F5F5]">
                  Architect &amp; Platform Profile
                </h4>
              </div>
              <button 
                type="button"
                onClick={() => setDeveloperModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#F5F5F5] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 py-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#8B5E3C] flex items-center justify-center text-2xl font-bold text-[#080808] shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                BF
              </div>
              <h3 className="text-lg font-bold font-display text-[#F5F5F5]">Muhammad Faraz</h3>
              <p className="text-[#D4AF37] font-bold">Founder &amp; Lead Architect @ BUILDBYFARAZ</p>
              <p className="text-[#9CA3AF] text-[11px] leading-relaxed max-w-xs">
                Creator of high-throughput cloud automation platforms, AI speech synthesis studios, and universal media engines.
              </p>
            </div>

            <div className="space-y-2.5">
              <a 
                href="mailto:faggaf786678@gmail.com" 
                className="p-3 rounded-xl bg-[#080808] border border-[#485563]/40 flex items-center justify-between hover:border-[#D4AF37] transition-colors"
              >
                <span className="text-[#9CA3AF]">Direct Email:</span>
                <span className="text-[#F5F5F5] font-bold">faggaf786678@gmail.com</span>
              </a>
              <a 
                href="https://wa.me/923284487595?text=Hello%20Muhammad%20Faraz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#080808] border border-[#485563]/40 flex items-center justify-between hover:border-emerald-500 transition-colors"
              >
                <span className="text-[#9CA3AF]">WhatsApp Direct:</span>
                <span className="text-emerald-400 font-bold">+92 328 4487595</span>
              </a>
              <a 
                href="https://discord.gg/sgYfp5KaFJ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#080808] border border-[#485563]/40 flex items-center justify-between hover:border-[#5865F2] transition-colors"
              >
                <span className="text-[#9CA3AF]">Discord Server:</span>
                <span className="text-[#5865F2] font-bold">BUILDBYFARAZ Community</span>
              </a>
              <a 
                href="https://buildbyfaraz.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#080808] border border-[#485563]/40 flex items-center justify-between hover:border-[#D4AF37] transition-colors"
              >
                <span className="text-[#9CA3AF]">Official Portal:</span>
                <span className="text-[#D4AF37] font-bold">buildbyfaraz.com</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setDeveloperModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-[#080808] font-bold hover:bg-[#C59F2D] cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BATCH RENAMER MODAL (From Step 2)                                 */}
      {/* ========================================================================= */}
      {batchRenameOpen && (
        <div className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#12161A] border border-[#D4AF37]/50 p-6 space-y-4 shadow-2xl animate-fadeIn text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#485563]/30">
              <h4 className="text-base font-bold font-display text-[#F5F5F5]">
                ⚡ Batch Renaming Rules
              </h4>
              <button 
                type="button"
                onClick={() => setBatchRenameOpen(false)}
                className="text-[#9CA3AF] hover:text-[#F5F5F5] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[#9CA3AF] block mb-1">Target:</label>
                <select
                  value={batchRule.targetType}
                  onChange={(e) => setBatchRule({ ...batchRule, targetType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080808] border border-[#485563]/40 text-[#F5F5F5]"
                >
                  <option value="all">All Items</option>
                  <option value="videos">Videos Only</option>
                  <option value="docs">Documents Only</option>
                  <option value="folders">Folders Only</option>
                </select>
              </div>

              <div>
                <label className="text-[#9CA3AF] block mb-1">Prefix to Add:</label>
                <input 
                  type="text" 
                  value={batchRule.prefix}
                  onChange={(e) => setBatchRule({ ...batchRule, prefix: e.target.value })}
                  placeholder="e.g. [BUILDBYFARAZ]_"
                  className="w-full px-3 py-2 rounded-lg bg-[#080808] border border-[#485563]/40 text-[#F5F5F5]"
                />
              </div>

              <div>
                <label className="text-[#9CA3AF] block mb-1">Sequential Numbering Pattern:</label>
                <input 
                  type="text" 
                  value={batchRule.pattern}
                  onChange={(e) => setBatchRule({ ...batchRule, pattern: e.target.value })}
                  placeholder="Video {N}"
                  className="w-full px-3 py-2 rounded-lg bg-[#080808] border border-[#485563]/40 text-[#F5F5F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#9CA3AF] block mb-1">Find Text:</label>
                  <input 
                    type="text" 
                    value={batchRule.findText}
                    onChange={(e) => setBatchRule({ ...batchRule, findText: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080808] border border-[#485563]/40 text-[#F5F5F5]"
                  />
                </div>
                <div>
                  <label className="text-[#9CA3AF] block mb-1">Replace With:</label>
                  <input 
                    type="text" 
                    value={batchRule.replaceText}
                    onChange={(e) => setBatchRule({ ...batchRule, replaceText: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080808] border border-[#485563]/40 text-[#F5F5F5]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleApplyBatchRename}
                className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] text-[#080808] font-bold cursor-pointer hover:bg-[#C59F2D]"
              >
                Apply Rules
              </button>
              <button
                type="button"
                onClick={() => setBatchRenameOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#181F25] text-[#9CA3AF] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: TAG MODAL (From Step 2)                                          */}
      {/* ========================================================================= */}
      {tagModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#12161A] border border-[#D4AF37]/50 p-6 space-y-4 shadow-2xl animate-fadeIn text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#485563]/30">
              <h4 className="text-base font-bold font-display text-[#F5F5F5]">
                🏷️ Folder Tag &amp; Branding Tool
              </h4>
              <button 
                type="button"
                onClick={() => setTagModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#F5F5F5] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex rounded-xl bg-[#080808] p-1 border border-[#485563]/40">
              <button
                type="button"
                onClick={() => setTagActionType('add')}
                className={`flex-1 py-2 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                  tagActionType === 'add' ? 'bg-[#D4AF37] text-[#080808]' : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
                }`}
              >
                ➕ Add Tag
              </button>
              <button
                type="button"
                onClick={() => setTagActionType('remove')}
                className={`flex-1 py-2 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                  tagActionType === 'remove' ? 'bg-rose-500 text-white' : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
                }`}
              >
                ✂️ Strip Tag
              </button>
            </div>

            <div>
              <label className="text-[#9CA3AF] block mb-1 font-bold">
                {tagActionType === 'add' ? 'Tag Label to Prepend:' : 'Tag String to Strip:'}
              </label>
              <input 
                type="text" 
                value={tagInputValue}
                onChange={(e) => setTagInputValue(e.target.value)}
                placeholder="e.g. [BUILDBYFARAZ]"
                className="w-full px-3 py-2 rounded-lg bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (tagActionType === 'add') handleAddTagToAll(tagInputValue);
                  else handleRemoveTagFromAll(tagInputValue);
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold cursor-pointer ${
                  tagActionType === 'add' ? 'bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D]' : 'bg-rose-600 text-white'
                }`}
              >
                {tagActionType === 'add' ? 'Apply Tag Everywhere' : 'Strip Tag from All'}
              </button>
              <button
                type="button"
                onClick={() => setTagModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#181F25] text-[#9CA3AF] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: PROMO INJECTOR MODAL (From Step 2)                                */}
      {/* ========================================================================= */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#12161A] border border-emerald-500/50 p-6 space-y-4 shadow-2xl animate-fadeIn text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#485563]/30">
              <h4 className="text-base font-bold font-display text-[#F5F5F5]">
                📌 Promo &amp; Notice File Injector
              </h4>
              <button 
                type="button"
                onClick={() => setPromoModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#F5F5F5] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#080808] border border-emerald-500/30 flex items-center justify-between">
              <div>
                <strong className="text-emerald-400 block font-bold">Inject Notice on Clone / ZIP</strong>
                <span className="text-[10px] text-[#9CA3AF]">Creates a notice file across cloned folders</span>
              </div>
              <input 
                type="checkbox"
                checked={promoNotice.enabled}
                onChange={(e) => setPromoNotice({ ...promoNotice, enabled: e.target.checked })}
                className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[#9CA3AF] block mb-1">Notice File Name:</label>
              <input 
                type="text" 
                value={promoNotice.filename}
                onChange={(e) => setPromoNotice({ ...promoNotice, filename: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080808] border border-[#485563]/40 text-[#F5F5F5] focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[#9CA3AF] block mb-1">Notice Text Content:</label>
              <textarea 
                rows={6}
                value={promoNotice.content}
                onChange={(e) => setPromoNotice({ ...promoNotice, content: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080808] border border-[#485563]/40 text-[#F5F5F5] focus:border-emerald-500 focus:outline-none text-[11px]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setPromoModalOpen(false);
                  addLog('info', promoNotice.enabled ? `Promo file "${promoNotice.filename}" activated.` : 'Promo disabled.');
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold cursor-pointer"
              >
                Save &amp; Confirm
              </button>
              <button
                type="button"
                onClick={() => setPromoModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#181F25] text-[#9CA3AF] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: DOWNLOAD STREAMING ZIP MODAL                                     */}
      {/* ========================================================================= */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#12161A] border border-blue-500/40 p-6 space-y-4 shadow-2xl animate-fadeIn text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#485563]/30">
              <h4 className="text-base font-bold font-display text-[#F5F5F5]">
                ⚡ Instant Download &amp; ZIP Generator
              </h4>
              <button 
                type="button"
                onClick={() => setDownloadModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#F5F5F5] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#080808] border border-[#485563]/40 space-y-2">
              <h5 className="text-sm font-bold text-blue-400">
                📦 Fast Browser Stream ZIP (STORE Mode)
              </h5>
              <p className="text-[#9CA3AF] text-[11px] leading-relaxed">
                Bundles all selected files directly in your browser without re-compression, maximizing download speed with live ETA countdown.
              </p>
              <button
                type="button"
                onClick={handleDownloadZip}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
              >
                Start Streaming ZIP Download
              </button>
            </div>

            <button
              type="button"
              onClick={() => setDownloadModalOpen(false)}
              className="w-full py-2 rounded-xl bg-[#181F25] text-[#9CA3AF] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
