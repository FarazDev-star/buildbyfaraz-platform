import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  Play, 
  Pause, 
  Heart, 
  Sparkles, 
  Volume2, 
  Check, 
  Globe, 
  User, 
  Mic, 
  Layers, 
  Filter, 
  Flame, 
  RefreshCw 
} from 'lucide-react';
import { 
  searchFishAudioModels, 
  getAhmNeuralVoices, 
  getFavoriteVoiceIds, 
  toggleFavoriteVoice 
} from '../services/ttsService';

export default function VoiceExplorerModal({ isOpen, onClose, onSelectVoice, currentVoice }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'fish' | 'neural' | 'favorites' | 'urdu' | 'english'
  const [searchQuery, setSearchQuery] = useState('');
  const [fishModels, setFishModels] = useState([]);
  const [loadingFish, setLoadingFish] = useState(false);
  const [neuralVoices, setNeuralVoices] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(getFavoriteVoiceIds());
  
  // Audio preview playback state
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    // Load Neural Voices
    const ahm = getAhmNeuralVoices();
    setNeuralVoices(ahm);
    setFavoriteIds(getFavoriteVoiceIds());

    // Fetch initial models
    fetchFishModels('');
  }, [isOpen]);

  // Debounced live search across 20,000+ voices as user types
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      fetchFishModels(searchQuery.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, isOpen]);

  const fetchFishModels = async (q, tag = '') => {
    setLoadingFish(true);
    try {
      const res = await searchFishAudioModels({ query: q, tag, page: 1, pageSize: 60, sortBy: 'score' });
      setFishModels(res.items || []);
    } catch (err) {
      console.warn('Failed to load live Fish models:', err);
    } finally {
      setLoadingFish(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFishModels(searchQuery.trim());
  };

  const handleToggleFav = (e, voiceId) => {
    e.stopPropagation();
    const updated = toggleFavoriteVoice(voiceId);
    setFavoriteIds([...updated]);
  };

  const handlePlaySample = (e, voice) => {
    e.stopPropagation();
    if (playingAudioId === voice.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingAudioId(null);
      }
      return;
    }

    if (audioRef.current) audioRef.current.pause();

    let sampleUrl = voice.sampleAudio;
    if (sampleUrl) {
      if (sampleUrl.includes('platform.r2.fish.audio/')) {
        sampleUrl = sampleUrl.replace('https://platform.r2.fish.audio', '/audio-proxy');
      } else if (sampleUrl.includes('public-platform.r2.fish.audio/')) {
        sampleUrl = sampleUrl.replace('https://public-platform.r2.fish.audio', '/fish-cdn');
      }
    } else {
      const voiceParam = voice.edgeVoice || voice.id || voice.name;
      sampleUrl = `/api/tts?voice=${encodeURIComponent(voiceParam)}&text=${encodeURIComponent('Hello from ' + voice.name + ' studio.')}`;
    }

    const aud = new Audio(sampleUrl);
    audioRef.current = aud;
    setPlayingAudioId(voice.id);
    aud.play().catch(err => {
      console.warn('Audio preview error:', err);
      setPlayingAudioId(null);
    });
    aud.onended = () => setPlayingAudioId(null);
  };

  if (!isOpen) return null;

  // Filter combined voices based on activeTab and search
  const q = searchQuery.toLowerCase();
  
  let combined = [];
  if (activeTab === 'all') {
    combined = [...fishModels, ...neuralVoices];
  } else if (activeTab === 'fish') {
    combined = fishModels;
  } else if (activeTab === 'neural') {
    combined = neuralVoices;
  } else if (activeTab === 'favorites') {
    combined = [...fishModels, ...neuralVoices].filter(v => favoriteIds.includes(v.id));
  } else if (activeTab === 'urdu') {
    combined = [...fishModels, ...neuralVoices].filter(v => 
      v.language?.toLowerCase().includes('urdu') || 
      v.country?.toLowerCase().includes('pakistan') ||
      v.tags?.some(t => t.toLowerCase().includes('urdu'))
    );
  } else if (activeTab === 'english') {
    combined = [...fishModels, ...neuralVoices].filter(v => 
      v.language?.toLowerCase().includes('en') || 
      v.language?.toLowerCase().includes('english')
    );
  }

  if (searchQuery.trim()) {
    combined = combined.filter(v => 
      v.name?.toLowerCase().includes(q) ||
      v.language?.toLowerCase().includes(q) ||
      v.country?.toLowerCase().includes(q) ||
      v.tags?.some(t => t.toLowerCase().includes(q)) ||
      v.description?.toLowerCase().includes(q)
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-[#0E1114] border border-[#485563]/50 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#12161A] border-b border-[#485563]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#F5F5F5] font-display">
                  Voice & Model Explorer
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#D4AF37] text-[#080808]">
                  20,000+ VOICES
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF]">
                Faraz AI Neural voice models & Studio voices with live audio audition
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#181F25] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-5 bg-[#080808] border-b border-[#485563]/30 space-y-3 shrink-0">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search voices by name (e.g. Farid, Ali, Jenny, Asad), language, or tags (e.g. anime, calm, gaming)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12161A] border border-[#485563]/50 text-xs text-[#F5F5F5] placeholder-[#9CA3AF]/50 focus:border-[#D4AF37] outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#080808] font-bold text-xs font-mono hover:bg-[#C59F2D] transition-colors flex items-center gap-1.5"
            >
              {loadingFish ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Search</span>
            </button>
          </form>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-mono">
            {[
              { id: 'all', label: 'All Voices', count: neuralVoices.length + 20000 },
              { id: 'fish', label: 'Faraz AI (20K+)', icon: Sparkles },
              { id: 'neural', label: 'Studio Neural (583)', icon: Globe },
              { id: 'favorites', label: `Favorites (${favoriteIds.length})`, icon: Heart },
              { id: 'urdu', label: 'Urdu / Pakistan 🇵🇰' },
              { id: 'english', label: 'English 🇺🇸' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#D4AF37] text-[#080808] font-bold shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'bg-[#12161A] text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#181F25] border border-[#485563]/30'
                }`}
              >
                {tab.icon && <tab.icon className="w-3 h-3" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voices Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#0E1114]">
          {loadingFish && fishModels.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
              <p className="text-xs font-mono text-[#9CA3AF]">Querying Faraz AI 20,000+ voice registry...</p>
            </div>
          ) : combined.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Mic className="w-8 h-8 text-[#9CA3AF] mx-auto opacity-40" />
              <h4 className="text-sm font-bold text-[#F5F5F5]">No voices match your search</h4>
              <p className="text-xs text-[#9CA3AF]">Try a broader search term like "English", "Female", or "Male".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {combined.slice(0, 90).map((voice) => {
                const isSelected = currentVoice?.id === voice.id || currentVoice?.name === voice.name;
                const isFav = favoriteIds.includes(voice.id);
                const isPlaying = playingAudioId === voice.id;

                return (
                  <div
                    key={voice.id}
                    onClick={() => {
                      onSelectVoice(voice);
                      onClose();
                    }}
                    className={`p-4 rounded-2xl bg-[#12161A] border transition-all cursor-pointer group flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                        : 'border-[#485563]/30 hover:border-[#D4AF37]/60 hover:bg-[#181F25]'
                    }`}
                  >
                    {/* Top Row: Avatar & Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#181F25] border border-[#485563]/50 flex items-center justify-center font-bold text-xs text-[#D4AF37] overflow-hidden shrink-0">
                          {voice.coverImage ? (
                            <img src={voice.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            voice.name[0]?.toUpperCase() || 'V'
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                              {voice.name}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#9CA3AF] mt-0.5">
                            <span>{voice.gender || 'Neural'}</span>
                            <span>•</span>
                            <span className="text-[#D4AF37] truncate max-w-[120px]">{voice.language}</span>
                          </div>
                        </div>
                      </div>

                      {/* Favorite Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFav(e, voice.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isFav ? 'text-red-400 bg-red-500/10' : 'text-[#9CA3AF] hover:text-red-400 hover:bg-white/5'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-400' : ''}`} />
                      </button>
                    </div>

                    {/* Description or Quote */}
                    <p className="text-[11px] text-[#9CA3AF] line-clamp-2 leading-relaxed">
                      {voice.sampleText || voice.description || voice.previewText || 'High quality expressive voice model.'}
                    </p>

                    {/* Footer Row: Tags, Audition Audio Button, Select Button */}
                    <div className="pt-2 border-t border-[#485563]/30 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          voice.source === 'fish_audio'
                            ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}>
                          {voice.source === 'fish_audio' ? 'FARAZ AI' : 'STUDIO HD'}
                        </span>
                        {voice.likes && (
                          <span className="text-[10px] font-mono text-[#9CA3AF]">
                            ★ {voice.likes}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Sample Play Button */}
                        {voice.sampleAudio && (
                          <button
                            type="button"
                            onClick={(e) => handlePlaySample(e, voice)}
                            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-mono font-semibold ${
                              isPlaying 
                                ? 'bg-[#D4AF37] text-[#080808]' 
                                : 'bg-[#080808] text-[#9CA3AF] hover:text-white border border-[#485563]/40'
                            }`}
                            title="Audition sample audio"
                          >
                            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            <span>{isPlaying ? 'Playing' : 'Listen'}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#080808] transition-colors"
                        >
                          Select
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#12161A] border-t border-[#485563]/40 flex items-center justify-between text-xs text-[#9CA3AF] shrink-0">
          <span className="font-mono">Showing {Math.min(combined.length, 90)} of {combined.length.toLocaleString()} matching voices</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#181F25] text-[#F5F5F5] hover:bg-[#485563]/50 transition-colors font-medium"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
