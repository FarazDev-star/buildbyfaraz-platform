import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Download, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Mic, 
  Trash2, 
  Plus, 
  Heart, 
  RotateCcw, 
  Tag, 
  Wand2, 
  ChevronDown, 
  RefreshCw, 
  Layers, 
  Check, 
  Copy, 
  Code, 
  Settings2, 
  History, 
  Sliders, 
  Globe, 
  ShieldCheck, 
  ArrowRight,
  Headphones,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import VoiceExplorerModal from './VoiceExplorerModal';
import { 
  DEFAULT_VOICES, 
  EMOTION_TAGS, 
  autoTagSentence, 
  autoTagFullText, 
  generateSpeech, 
  getFavoriteVoiceIds, 
  toggleFavoriteVoice,
  getFishApiKey,
  setFishApiKey
} from '../services/ttsService';

export default function SpeechSterStudio({ currentUser, onLogActivity }) {
  // Active Voices & Multi-Speaker Dialog Blocks
  const [speakers, setSpeakers] = useState([
    {
      id: 'spk-1',
      voice: DEFAULT_VOICES[1] || DEFAULT_VOICES[0], // Sarah (Fish Audio Official)
      text: '[happy] Welcome to BUILDBYFARAZ studio! Life is full of incredible moments when you create something new and expressive.'
    },
    {
      id: 'spk-2',
      voice: DEFAULT_VOICES[0], // Andrew Multilingual
      text: 'Type your text with audio tags like [laughs] to turn into expressive speech...'
    }
  ]);

  // Active Selected Speaker Index for Sidebar Voice Binding
  const [activeSpeakerIdx, setActiveSpeakerIdx] = useState(0);

  // Right Sidebar Tab: 'settings' | 'history'
  const [activeSidebarTab, setActiveSidebarTab] = useState('settings');

  // Selected AI Model
  const [selectedModel, setSelectedModel] = useState('Faraz Neural Engine v2.1 Pro (Ultra-HD)');
  const [tagFilterCategory, setTagFilterCategory] = useState('All');

  // Fish Audio Cloud API Key
  const [fishApiKey, setFishApiKeyState] = useState(getFishApiKey());

  // Audio Controls Settings
  const [volumeDb, setVolumeDb] = useState(0); // -10 to +10 dB
  const [speechSpeed, setSpeechSpeed] = useState(1.0); // 0.5x to 2.0x
  const [speechPitch, setSpeechPitch] = useState(0); // -10 to +10
  const [loudnessNorm, setLoudnessNorm] = useState(true);
  const [textNorm, setTextNorm] = useState(true);
  const [tagCompatible, setTagCompatible] = useState(true);

  // Voice Explorer Modal State
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [editingSpeakerIdxForVoice, setEditingSpeakerIdxForVoice] = useState(0);

  // Tag Popover State
  const [openTagMenuSpeakerId, setOpenTagMenuSpeakerId] = useState(null);

  // Audio Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStatusText, setGenStatusText] = useState('');
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState(null);
  const [audioBlobSize, setAudioBlobSize] = useState('1.2 MB');

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioPlayerRef = useRef(null);

  // Sync playback speed with audio player
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = speechSpeed;
    }
  }, [speechSpeed]);

  // History Log State
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('bbf_tts_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'hist-1',
        timestamp: '10m ago',
        text: 'Sometimes I think we make life more complicated than it really needs to be...',
        voiceName: 'Ali ali - Female',
        model: 'Faraz Neural Engine v2.1 Pro',
        duration: '14s',
        audioUrl: 'https://platform.r2.fish.audio/task/265105e4556b4c0f906b0f426de988da.mp3'
      }
    ];
  });

  // Sync History
  useEffect(() => {
    try {
      localStorage.setItem('bbf_tts_history', JSON.stringify(historyList));
    } catch (e) {
      console.warn(e);
    }
  }, [historyList]);

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState(getFavoriteVoiceIds());

  // Currently active voice for the selected speaker
  const currentActiveVoice = speakers[activeSpeakerIdx]?.voice || DEFAULT_VOICES[0];

  // Character calculation
  const totalCharacters = speakers.reduce((acc, spk) => acc + spk.text.length, 0);

  // Handler: Add Speaker Block
  const handleAddSpeaker = () => {
    const nextVoice = DEFAULT_VOICES[(speakers.length) % DEFAULT_VOICES.length];
    const newSpk = {
      id: 'spk-' + Date.now(),
      voice: nextVoice,
      text: ''
    };
    setSpeakers([...speakers, newSpk]);
    setActiveSpeakerIdx(speakers.length);
  };

  // Handler: Delete Speaker Block
  const handleDeleteSpeaker = (idx) => {
    if (speakers.length <= 1) return;
    const filtered = speakers.filter((_, i) => i !== idx);
    setSpeakers(filtered);
    setActiveSpeakerIdx(Math.max(0, idx - 1));
  };

  // Handler: Update Text for a Speaker
  const handleTextChange = (idx, newText) => {
    const updated = [...speakers];
    updated[idx].text = newText;
    setSpeakers(updated);
  };

  // Handler: Open Voice Modal for a specific speaker
  const handleOpenVoicePicker = (idx) => {
    setEditingSpeakerIdxForVoice(idx);
    setActiveSpeakerIdx(idx);
    setIsVoiceModalOpen(true);
  };

  // Handler: Voice Selected from Explorer Modal
  const handleVoiceSelected = (selectedVoice) => {
    const updated = [...speakers];
    if (updated[editingSpeakerIdxForVoice]) {
      const spk = updated[editingSpeakerIdxForVoice];
      spk.voice = selectedVoice;
      if (selectedVoice.sampleAudio) {
        spk.useSampleAudio = true;
        spk.text = selectedVoice.sampleText || selectedVoice.previewText || spk.text;
      }
      setSpeakers(updated);
    }
  };

  // Handler: Insert Tag into active textarea
  const handleInsertTag = (idx, tagString) => {
    const spk = speakers[idx];
    const newText = spk.text ? `${spk.text} ${tagString} ` : `${tagString} `;
    handleTextChange(idx, newText);
    setOpenTagMenuSpeakerId(null);
  };

  // Handler: Auto-Tag a single speaker
  const handleAutoTagSpeaker = (idx) => {
    const spk = speakers[idx];
    if (!spk.text.trim()) return;
    const tagged = autoTagFullText(spk.text);
    handleTextChange(idx, tagged);
  };

  // Handler: Auto-Tag All speakers
  const handleAutoTagAll = () => {
    const updated = speakers.map(spk => ({
      ...spk,
      text: autoTagFullText(spk.text)
    }));
    setSpeakers(updated);
  };

  // Toggle favorite for current voice
  const handleToggleCurrentFav = () => {
    const updated = toggleFavoriteVoice(currentActiveVoice.id);
    setFavoriteIds([...updated]);
  };

  // Generate Speech Execution
  const handleGenerateSpeech = async () => {
    const validSpeakers = speakers.filter(s => s.text.trim().length > 0);
    if (validSpeakers.length === 0) {
      alert('Please enter text to generate speech.');
      return;
    }

    setIsGenerating(true);
    setGenProgress(10);
    setGenStatusText('Initializing neural acoustic graph...');

    try {
      // Synthesize each speaker's lines
      const audioBlobs = [];
      let currentProgress = 15;

      for (let i = 0; i < validSpeakers.length; i++) {
        const spk = validSpeakers[i];
        setGenStatusText(`Synthesizing speaker ${i + 1}/${validSpeakers.length}: ${spk.voice.name}...`);
        
        const res = await generateSpeech({
          text: spk.text,
          voice: spk.voice,
          pitch: Math.round(speechPitch * 10),
          rate: Math.round((speechSpeed - 1) * 100),
          apiKey: fishApiKey,
          useSampleAudio: spk.useSampleAudio ?? Boolean(spk.voice?.sampleAudio),
          onProgress: (pct) => {
            const overall = Math.round(currentProgress + (pct / validSpeakers.length) * 0.7);
            setGenProgress(Math.min(overall, 94));
          }
        });

        audioBlobs.push(res.blob);
        currentProgress += Math.round(80 / validSpeakers.length);
      }

      setGenProgress(98);
      setGenStatusText('Merging multi-speaker tracks into studio master MP3...');

      // Merge into continuous MP3 stream
      const mergedBlob = new Blob(audioBlobs, { type: 'audio/mpeg' });
      const newUrl = URL.createObjectURL(mergedBlob);
      const sizeMb = (mergedBlob.size / (1024 * 1024)).toFixed(2);

      setGeneratedAudioUrl(newUrl);
      setAudioBlobSize(`${sizeMb} MB`);
      setGenProgress(100);

      // Add to history
      const newHistItem = {
        id: 'hist-' + Date.now(),
        timestamp: 'Just now',
        text: validSpeakers[0].text.substring(0, 80) + '...',
        voiceName: validSpeakers[0].voice.name,
        model: selectedModel,
        duration: `${Math.round(mergedBlob.size / 3200)}s`,
        audioUrl: newUrl
      };
      setHistoryList(prev => [newHistItem, ...prev.slice(0, 19)]);

      // Log platform activity
      if (onLogActivity) {
        onLogActivity({
          user: currentUser?.name || currentUser?.email?.split('@')[0] || 'User',
          role: currentUser?.role || 'user',
          action: 'Generated Speech',
          target: `${validSpeakers.length} speaker(s) via ${selectedModel}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString()
        });
      }

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

      // Auto play audio once ready
      setTimeout(() => {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }, 300);

    } catch (err) {
      console.error('Speech generation failed:', err);
      alert('Speech generation error: ' + err.message);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 400);
    }
  };

  // Keyboard shortcut: Ctrl + Enter to generate
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGenerateSpeech();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [speakers, selectedModel, speechSpeed, speechPitch]);

  // Audio player time sync
  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      setCurrentTime(audioPlayerRef.current.currentTime);
      setDuration(audioPlayerRef.current.duration || 0);
    }
  };

  const togglePlayPause = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const seekTo = parseFloat(e.target.value);
    setCurrentTime(seekTo);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = seekTo;
    }
  };

  const formatSecs = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Workbench Grid: Canvas (Left) + Settings/History Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT MAIN CANVAS (SPEAKER BLOCKS) ================= */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="double-bezel shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <div className="double-bezel-inner p-5 sm:p-7 bg-[#12161A] border border-[#485563]/40 space-y-5">
              
              {/* Speaker Dialogue Blocks */}
              <div className="space-y-4">
                {speakers.map((spk, idx) => {
                  const isCurActive = activeSpeakerIdx === idx;
                  const isMenuOpen = openTagMenuSpeakerId === spk.id;

                  return (
                    <div 
                      key={spk.id}
                      onClick={() => setActiveSpeakerIdx(idx)}
                      className={`rounded-2xl border transition-all relative overflow-hidden bg-[#0A0D10] ${
                        isCurActive 
                          ? 'border-[#D4AF37]/80 ring-1 ring-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                          : 'border-[#485563]/40 hover:border-[#485563]/70'
                      }`}
                    >
                      {/* Speaker Header Bar */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-[#14191E] border-b border-[#485563]/30">
                        
                        {/* Voice Selector Pill */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenVoicePicker(idx)}
                            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#080808] hover:bg-[#181F25] border border-[#485563]/50 text-xs font-semibold text-[#F5F5F5] hover:border-[#D4AF37] transition-all group"
                          >
                            <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[10px] text-[#D4AF37] font-bold">
                              {spk.voice.name[0]?.toUpperCase() || 'S'}
                            </div>
                            <span className="max-w-[140px] sm:max-w-[200px] truncate">
                              {spk.voice.name}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#D4AF37] transition-colors" />
                          </button>

                          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/25 uppercase">
                            {spk.voice.source === 'fish_audio' ? 'FARAZ AI' : 'STUDIO HD'}
                          </span>

                          {spk.voice.sampleAudio && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = [...speakers];
                                const isNowSample = updated[idx].useSampleAudio === false;
                                updated[idx].useSampleAudio = isNowSample;
                                if (isNowSample && spk.voice.sampleText) {
                                  updated[idx].text = spk.voice.sampleText;
                                }
                                setSpeakers(updated);
                              }}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                                spk.useSampleAudio !== false
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                  : 'bg-[#181F25] text-[#9CA3AF] border border-[#485563]/40 hover:text-white'
                              }`}
                              title={spk.useSampleAudio !== false ? "Using 100% Authentic Voice Audio" : "Click to switch to Authentic Voice Mode"}
                            >
                              <span>{spk.useSampleAudio !== false ? '● 100% Authentic Audio Match' : '○ Neural TTS Mode'}</span>
                            </button>
                          )}
                        </div>

                        {/* Right: Speaker Delete & Actions */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#9CA3AF]">
                            {spk.text.length} chars
                          </span>

                          {speakers.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSpeaker(idx);
                              }}
                              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Remove speaker block"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                      </div>

                      {/* Text Input Area */}
                      <div className="p-4 relative">
                        {spk.voice.sampleAudio && spk.voice.sampleText && (
                          <div className="flex items-center justify-between px-2.5 py-1.5 mb-2.5 bg-[#12161A] rounded-xl border border-[#D4AF37]/30 text-[11px] font-mono">
                            <span className="text-[#9CA3AF] truncate max-w-[70%]">
                              <span className="text-[#D4AF37] font-bold">Authentic Dialogue: </span>
                              "{spk.voice.sampleText}"
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTextChange(idx, spk.voice.sampleText);
                                const updated = [...speakers];
                                updated[idx].useSampleAudio = true;
                                setSpeakers(updated);
                              }}
                              className="px-2 py-0.5 rounded bg-[#D4AF37] text-[#080808] font-bold text-[10px] hover:bg-[#C59F2D] transition-colors shrink-0"
                            >
                              Load Authentic Audio Line
                            </button>
                          </div>
                        )}
                        <textarea
                          rows={3}
                          value={spk.text}
                          onChange={(e) => handleTextChange(idx, e.target.value)}
                          placeholder="Type your text with audio tags like [laughs] or (pause) to turn into expressive speech..."
                          className="w-full bg-transparent text-[#F5F5F5] text-sm leading-relaxed placeholder-[#9CA3AF]/40 outline-none resize-none"
                        />

                        {/* Speaker Action Toolbar */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#485563]/20 mt-2">
                          <div className="flex items-center gap-2">
                            
                            {/* Tags Popover Trigger */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenTagMenuSpeakerId(isMenuOpen ? null : spk.id);
                                }}
                                className="px-3 py-1 rounded-lg bg-[#14191E] hover:bg-[#1C2228] border border-[#485563]/40 text-xs font-mono text-[#9CA3AF] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 flex items-center gap-1.5 transition-colors"
                              >
                                <Tag className="w-3.5 h-3.5" />
                                <span>Tags &rsaquo;</span>
                              </button>

                              {/* Tags Popover Dropdown */}
                              {isMenuOpen && (
                                <div 
                                  className="absolute left-0 bottom-10 z-40 w-[340px] sm:w-[440px] p-3.5 rounded-2xl bg-[#12161A] border border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-3 animate-fadeIn"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex items-center justify-between pb-2 border-b border-[#485563]/30">
                                    <div className="flex items-center gap-2">
                                      <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                                      <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-wider">
                                        Expressive Audio & Emotion Tags
                                      </span>
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={() => setOpenTagMenuSpeakerId(null)}
                                      className="w-6 h-6 rounded-lg bg-[#080808] hover:bg-[#181F25] text-[#9CA3AF] hover:text-white flex items-center justify-center text-sm"
                                    >
                                      &times;
                                    </button>
                                  </div>

                                  {/* Filter Category Pills */}
                                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono">
                                    {['All', 'Emotion', 'Reaction', 'Style', 'Pacing'].map((cat) => (
                                      <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setTagFilterCategory(cat)}
                                        className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                                          tagFilterCategory === cat
                                            ? 'bg-[#D4AF37] text-[#080808] font-bold'
                                            : 'bg-[#080808] text-[#9CA3AF] hover:text-white border border-[#485563]/30'
                                        }`}
                                      >
                                        {cat}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Tags Grid - Clean 2-column layout with full labels and emojis */}
                                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                                    {EMOTION_TAGS
                                      .filter(et => tagFilterCategory === 'All' || et.category === tagFilterCategory)
                                      .map((et) => (
                                        <button
                                          key={et.tag}
                                          type="button"
                                          onClick={() => handleInsertTag(idx, et.tag)}
                                          className="p-2 rounded-xl bg-[#080808] hover:bg-[#D4AF37] border border-[#485563]/40 text-left transition-all group/tag flex items-center gap-2"
                                        >
                                          <span className="text-base shrink-0">{et.emoji}</span>
                                          <div className="flex flex-col min-w-0">
                                            <span className="text-[11px] font-bold text-[#F5F5F5] group-hover/tag:text-[#080808] leading-tight">
                                              {et.label}
                                            </span>
                                            <span className="text-[10px] font-mono text-[#D4AF37] group-hover/tag:text-[#080808]/80 leading-tight">
                                              {et.tag}
                                            </span>
                                          </div>
                                        </button>
                                      ))}
                                  </div>

                                  <div className="text-[10px] font-mono text-[#9CA3AF] pt-1 border-t border-[#485563]/20 flex items-center justify-between">
                                    <span>Click tag to insert into speech</span>
                                    <span className="text-[#D4AF37] font-semibold">{EMOTION_TAGS.length} tags</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Auto Tag Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAutoTagSpeaker(idx);
                              }}
                              className="px-3 py-1 rounded-lg bg-[#14191E] hover:bg-[#1C2228] border border-[#485563]/40 text-xs font-mono text-[#9CA3AF] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 flex items-center gap-1.5 transition-colors"
                              title="Automatically detect tone and insert emotion tags"
                            >
                              <Wand2 className="w-3.5 h-3.5" />
                              <span>Auto Tag</span>
                            </button>

                          </div>

                          <div className="text-[11px] font-mono text-[#9CA3AF]">
                            Speaker {idx + 1}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Speaker Button */}
              <button
                type="button"
                onClick={handleAddSpeaker}
                className="px-4 py-2 rounded-xl bg-[#080808] hover:bg-[#181F25] border border-[#485563]/50 hover:border-[#D4AF37] text-xs font-semibold font-mono text-[#F5F5F5] flex items-center gap-2 transition-all group"
              >
                <Plus className="w-4 h-4 text-[#D4AF37] group-hover:rotate-90 transition-transform" />
                <span>+ Add Speaker</span>
              </button>

              {/* Bottom Canvas Controls & Generate Button */}
              <div className="pt-4 border-t border-[#485563]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Character Counter & Auto Tag All */}
                <div className="flex items-center gap-3 text-xs font-mono text-[#9CA3AF]">
                  <span>{totalCharacters} / 5000 characters</span>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={handleAutoTagAll}
                    className="text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Auto Tag All</span>
                  </button>
                </div>

                {/* Primary Generate Speech Button */}
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateSpeech}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono transition-all shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-95"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>GENERATING SPEECH...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Generate Speech <kbd className="ml-1 px-1.5 py-0.5 rounded bg-black/20 text-[10px]">Ctrl ↵</kbd></span>
                    </>
                  )}
                </button>

              </div>

              {/* Real-Time Generation Progress Bar */}
              {isGenerating && (
                <div className="p-4 rounded-xl bg-[#080808] border border-[#D4AF37]/30 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#D4AF37] font-semibold">{genStatusText}</span>
                    <span className="text-[#F5F5F5] font-bold">{genProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#181F25] overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-300 rounded-full"
                      style={{ width: `${genProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* INTEGRATED AUDIO PLAYER (WHEN GENERATED) */}
              {generatedAudioUrl && (
                <div className="p-5 rounded-2xl bg-[#080808] border border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.15)] space-y-4 animate-fadeIn">
                  <audio
                    ref={audioPlayerRef}
                    src={generatedAudioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />

                  {/* Top Bar: Title & Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-xs font-mono font-bold text-[#F5F5F5]">
                        SpeechSter Master Audio Output
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                        READY // MP3
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-[#9CA3AF]">
                      Payload: <strong className="text-[#F5F5F5]">{audioBlobSize}</strong>
                    </div>
                  </div>

                  {/* Player Controls */}
                  <div className="flex items-center gap-4">
                    {/* Play/Pause Button */}
                    <button
                      type="button"
                      onClick={togglePlayPause}
                      className="w-11 h-11 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] flex items-center justify-center transition-transform active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>

                    {/* Seeker Slider */}
                    <div className="flex-1 space-y-1">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full accent-[#D4AF37] cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-[#9CA3AF]">
                        <span>{formatSecs(currentTime)}</span>
                        <span>{formatSecs(duration)}</span>
                      </div>
                    </div>

                    {/* Download MP3 Button */}
                    <a
                      href={generatedAudioUrl}
                      download="SpeechSter_audio.mp3"
                      className="px-4 py-2.5 rounded-xl bg-[#12161A] hover:bg-[#181F25] text-[#F5F5F5] hover:text-[#D4AF37] border border-[#485563]/50 text-xs font-mono font-bold flex items-center gap-2 transition-colors shrink-0"
                    >
                      <Download className="w-4 h-4 text-[#D4AF37]" />
                      <span>Download MP3</span>
                    </a>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDEBAR (SETTINGS & HISTORY) ================= */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="rounded-3xl bg-[#12161A] border border-[#485563]/40 overflow-hidden shadow-2xl">
            
            {/* Sidebar Tabs: Settings | History */}
            <div className="grid grid-cols-2 p-1.5 bg-[#080808] border-b border-[#485563]/40 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveSidebarTab('settings')}
                className={`py-2 rounded-xl transition-all font-bold ${
                  activeSidebarTab === 'settings'
                    ? 'bg-[#12161A] text-[#D4AF37] shadow-sm border border-[#485563]/40'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                Settings
              </button>
              <button
                type="button"
                onClick={() => setActiveSidebarTab('history')}
                className={`py-2 rounded-xl transition-all font-bold ${
                  activeSidebarTab === 'history'
                    ? 'bg-[#12161A] text-[#D4AF37] shadow-sm border border-[#485563]/40'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                History ({historyList.length})
              </button>
            </div>

            {/* TAB 1: SETTINGS */}
            {activeSidebarTab === 'settings' && (
              <div className="p-5 space-y-6">
                
                {/* Voice Profile Card */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-[#D4AF37] tracking-wider uppercase font-semibold block">
                    Active Speaker Voice
                  </span>

                  <div 
                    onClick={() => handleOpenVoicePicker(activeSpeakerIdx)}
                    className="p-4 rounded-2xl bg-[#080808] border border-[#485563]/50 hover:border-[#D4AF37]/70 transition-all cursor-pointer group space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#181F25] border border-[#485563]/50 flex items-center justify-center font-bold text-sm text-[#D4AF37] shrink-0 overflow-hidden">
                        {currentActiveVoice.coverImage ? (
                          <img src={currentActiveVoice.coverImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          currentActiveVoice.name[0]?.toUpperCase() || 'V'
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors truncate">
                            {currentActiveVoice.name}
                          </h4>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCurrentFav();
                            }}
                            className="text-[#9CA3AF] hover:text-red-400"
                          >
                            <Heart className={`w-3.5 h-3.5 ${favoriteIds.includes(currentActiveVoice.id) ? 'fill-red-400 text-red-400' : ''}`} />
                          </button>
                        </div>
                        <p className="text-[10px] text-[#9CA3AF] line-clamp-1 mt-0.5">
                          {currentActiveVoice.sampleText || currentActiveVoice.previewText || 'Expressive neural voice model'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[9px] font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-[#181F25] text-[#F5F5F5]">
                            {currentActiveVoice.language}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#181F25] text-[#9CA3AF]">
                            {currentActiveVoice.gender}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37]">
                            {currentActiveVoice.likes || '51'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full py-2 rounded-xl text-xs font-mono font-bold bg-[#14191E] group-hover:bg-[#D4AF37] group-hover:text-[#080808] text-[#F5F5F5] border border-[#485563]/40 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Browse 20,000+ Voices</span>
                    </button>
                  </div>
                </div>

                {/* Model Selector Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-[#9CA3AF] uppercase block">
                    AI Engine Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/50 text-xs text-[#F5F5F5] outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Faraz Neural Engine v2.1 Pro (Ultra-HD)">Faraz Neural Engine v2.1 Pro (Ultra-HD)</option>
                    <option value="Faraz Studio Expressive v2.0">Faraz Studio Expressive v2.0</option>
                    <option value="Faraz Multilingual Acoustic Synthesis">Faraz Multilingual Acoustic Synthesis</option>
                    <option value="Faraz High-Speed Low Latency Engine">Faraz High-Speed Low Latency Engine</option>
                  </select>
                </div>

                {/* Faraz AI Cloud API Key Manager */}
                <div className="p-4 rounded-2xl bg-[#080808] border border-[#485563]/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#D4AF37] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Faraz AI Cloud API Key</span>
                    </span>
                    {fishApiKey ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 font-bold">
                        ● AUTHENTIC CLONING ACTIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30">
                        OPTIONAL
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] leading-relaxed">
                    Paste your Cloud API Key from <a href="https://fish.audio/app/api-keys" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline">fish.audio/app/api-keys</a> to synthesize 100% authentic voices for all 20,000+ community models.
                  </p>
                  <input
                    type="password"
                    placeholder="Enter Cloud Bearer API Key..."
                    value={fishApiKey}
                    onChange={(e) => {
                      setFishApiKeyState(e.target.value);
                      setFishApiKey(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#12161A] border border-[#485563]/50 text-xs text-[#F5F5F5] font-mono outline-none focus:border-[#D4AF37]"
                  />
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#9CA3AF]">
                    <a
                      href="https://fish.audio/app/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37] hover:underline flex items-center gap-1"
                    >
                      <span>Get free API key</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <span>Stored locally</span>
                  </div>
                </div>

                {/* Audio Controls Sliders */}
                <div className="space-y-4 pt-2 border-t border-[#485563]/30">
                  <span className="text-[11px] font-mono text-[#D4AF37] tracking-wider uppercase font-semibold block">
                    Audio Controls
                  </span>

                  {/* Volume Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-[#9CA3AF]">
                      <span>Volume</span>
                      <span className="text-[#F5F5F5] font-bold">{volumeDb} dB</span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      value={volumeDb}
                      onChange={(e) => setVolumeDb(parseInt(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>

                  {/* Speed Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-[#9CA3AF]">
                      <span>Speed</span>
                      <span className="text-[#D4AF37] font-bold">{speechSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={speechSpeed}
                      onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>

                  {/* Pitch Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-[#9CA3AF]">
                      <span>Pitch</span>
                      <span className="text-[#F5F5F5] font-bold">{speechPitch > 0 ? '+' + speechPitch : speechPitch}</span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      value={speechPitch}
                      onChange={(e) => setSpeechPitch(parseInt(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>

                  {/* Normalization & Tag Toggles */}
                  <div className="space-y-2.5 pt-2">
                    
                    {/* Loudness Normalization */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#9CA3AF]">Loudness Normalization</span>
                      <div className="flex items-center gap-1 bg-[#080808] p-1 rounded-lg border border-[#485563]/40 text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => setLoudnessNorm(false)}
                          className={`px-2 py-0.5 rounded ${!loudnessNorm ? 'bg-[#D4AF37] text-[#080808] font-bold' : 'text-[#9CA3AF]'}`}
                        >
                          Off
                        </button>
                        <button
                          type="button"
                          onClick={() => setLoudnessNorm(true)}
                          className={`px-2 py-0.5 rounded ${loudnessNorm ? 'bg-[#D4AF37] text-[#080808] font-bold' : 'text-[#9CA3AF]'}`}
                        >
                          On
                        </button>
                      </div>
                    </div>

                    {/* Text Normalization */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#9CA3AF]">Text Normalization</span>
                      <div className="flex items-center gap-1 bg-[#080808] p-1 rounded-lg border border-[#485563]/40 text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => setTextNorm(false)}
                          className={`px-2 py-0.5 rounded ${!textNorm ? 'bg-[#D4AF37] text-[#080808] font-bold' : 'text-[#9CA3AF]'}`}
                        >
                          Off
                        </button>
                        <button
                          type="button"
                          onClick={() => setTextNorm(true)}
                          className={`px-2 py-0.5 rounded ${textNorm ? 'bg-[#D4AF37] text-[#080808] font-bold' : 'text-[#9CA3AF]'}`}
                        >
                          On
                        </button>
                      </div>
                    </div>

                    {/* Tag Compatible Mode */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#9CA3AF]">Tag Compatible Mode</span>
                      <div className="flex items-center gap-1 bg-[#080808] p-1 rounded-lg border border-[#485563]/40 text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => setTagCompatible(false)}
                          className={`px-2 py-0.5 rounded ${!tagCompatible ? 'bg-[#D4AF37] text-[#080808] font-bold' : 'text-[#9CA3AF]'}`}
                        >
                          Off
                        </button>
                        <button
                          type="button"
                          onClick={() => setTagCompatible(true)}
                          className={`px-2 py-0.5 rounded ${tagCompatible ? 'bg-[#D4AF37] text-[#080808] font-bold' : 'text-[#9CA3AF]'}`}
                        >
                          On
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: HISTORY */}
            {activeSidebarTab === 'history' && (
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {historyList.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#9CA3AF] space-y-2">
                    <History className="w-8 h-8 mx-auto opacity-40" />
                    <p>No speeches generated yet.</p>
                  </div>
                ) : (
                  historyList.map(item => (
                    <div 
                      key={item.id} 
                      className="p-3 rounded-xl bg-[#080808] border border-[#485563]/30 hover:border-[#D4AF37]/50 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#F5F5F5] line-clamp-1">{item.voiceName}</span>
                        <span className="text-[10px] font-mono text-[#9CA3AF]">{item.timestamp}</span>
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] line-clamp-2">{item.text}</p>
                      
                      <div className="pt-1.5 flex items-center justify-between border-t border-[#485563]/20">
                        <span className="text-[9px] font-mono text-[#D4AF37]">{item.model}</span>
                        <a
                          href={item.audioUrl}
                          download="SpeechSter_sample.mp3"
                          className="px-2 py-0.5 rounded text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/15 hover:bg-[#D4AF37] hover:text-[#080808] transition-colors flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>MP3</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* VOICE EXPLORER MODAL */}
      <VoiceExplorerModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSelectVoice={handleVoiceSelected}
        currentVoice={currentActiveVoice}
      />

    </div>
  );
}
