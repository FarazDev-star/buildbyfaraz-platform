/**
 * TypeFlow Typing Engine Core
 * Tracks typing states, calculates WPM metrics, records telemetry, and dispatches events.
 */
class TypingEngine {
  constructor(text, container, options = {}) {
    this.text = text;
    this.container = container;
    
    // Config Options
    this.mode = options.mode || 'paragraph'; // 'word' | 'sentence' | 'paragraph'
    this.allowBackspace = options.allowBackspace !== false;
    this.backspacePenalty = !!options.backspacePenalty;
    this.forceCorrectKey = !!options.forceCorrectKey;
    
    // Stats & State
    this.index = 0;
    this.totalKeystrokes = 0;
    this.errorCount = 0;
    this.uncorrectedErrors = 0;
    this.correctedErrors = 0;
    
    // Timers
    this.startTime = null;
    this.elapsedTime = 0; // Cumulative ms (excluding paused periods)
    this.timerInterval = null;
    
    this.isPaused = false;
    this.isActive = false;
    this.isFinished = false;
    
    // Telemetry & Analysis
    this.keystrokeTelemetry = [];
    this.keyPairDelays = [];
    this.charStates = Array.from({ length: text.length }, () => ({
      state: 'unread', // 'unread' | 'correct' | 'incorrect'
      errorCount: 0
    }));
    
    this.listeners = {};
    this.lastOffsetTop = undefined;

    // Bind event handlers
    this.handleKeyDown = this.handleKeyDown.bind(this);
    
    this.init();
  }

  /**
   * Initializes the engine and renders the text display
   */
  init() {
    this.index = 0;
    this.totalKeystrokes = 0;
    this.errorCount = 0;
    this.uncorrectedErrors = 0;
    this.correctedErrors = 0;
    this.startTime = null;
    this.elapsedTime = 0;
    this.isPaused = false;
    this.isActive = false;
    this.isFinished = false;
    this.keystrokeTelemetry = [];
    this.keyPairDelays = [];
    this.charStates = Array.from({ length: this.text.length }, () => ({
      state: 'unread',
      errorCount: 0
    }));
    this.lastOffsetTop = undefined;

    this.render();
  }

  /**
   * Starts the typing session and binds the keydown listener
   */
  start() {
    if (this.isActive || this.isFinished) return;
    
    this.isActive = true;
    this.isPaused = false;
    
    document.addEventListener('keydown', this.handleKeyDown);
    this.dispatchEvent('session:start', this.calculateStats());
    if (this.index < this.text.length) {
      this.dispatchEvent('char:change', {
        char: this.text[this.index],
        index: this.index
      });
    }
  }

  /**
   * Pauses the session timer and input recording
   */
  pause() {
    if (!this.isActive || this.isPaused || this.isFinished) return;
    
    this.isPaused = true;
    if (this.startTime !== null) {
      this.elapsedTime += Date.now() - this.startTime;
      this.startTime = null;
    }
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    this.dispatchEvent('session:paused', this.calculateStats());
  }

  /**
   * Resumes the session timer and input recording
   */
  resume() {
    if (!this.isActive || !this.isPaused || this.isFinished) return;
    
    this.isPaused = false;
    this.startTime = Date.now();
    this.startStatsTimer();
    
    this.dispatchEvent('session:resumed', this.calculateStats());
  }

  /**
   * Stops and completely resets the typing engine
   */
  stop() {
    this.isActive = false;
    this.isPaused = false;
    this.isFinished = false;
    
    document.removeEventListener('keydown', this.handleKeyDown);
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    this.init();
    this.dispatchEvent('session:reset', null);
  }

  /**
   * Ends the typing session and dispatches telemetry results
   */
  finish() {
    this.isFinished = true;
    this.isActive = false;
    
    document.removeEventListener('keydown', this.handleKeyDown);
    
    if (this.startTime !== null) {
      this.elapsedTime += Date.now() - this.startTime;
      this.startTime = null;
    }
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    const finalStats = this.calculateStats();
    const weakKeys = this.analyzeWeakKeys();
    
    this.dispatchEvent('session:complete', {
      stats: finalStats,
      telemetry: this.keystrokeTelemetry,
      keyPairDelays: this.keyPairDelays,
      weakKeys: weakKeys
    });
  }

  /**
   * Registers a callback listener for engine events
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Dispatches events to local listeners and as DOM custom events
   */
  dispatchEvent(event, detail) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(detail);
        } catch (err) {
          console.error(`Error in TypingEngine event listener for ${event}:`, err);
        }
      });
    }

    const domEvent = new CustomEvent(event, {
      detail: detail,
      bubbles: true,
      cancelable: true
    });
    this.container.dispatchEvent(domEvent);
  }

  /**
   * Background timer to push stats updates
   */
  startStatsTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      if (!this.isPaused && !this.isFinished) {
        this.dispatchStats();
      }
    }, 250);
  }

  /**
   * Calculates raw WPM, Net WPM, accuracy, and key telemetry
   */
  calculateStats() {
    const elapsedMinutes = this.getElapsedMinutes();
    let rawWPM = 0;
    let netWPM = 0;
    let accuracy = 100;
    
    if (elapsedMinutes > 0) {
      rawWPM = (this.totalKeystrokes / 5) / elapsedMinutes;
      netWPM = rawWPM - (this.uncorrectedErrors / elapsedMinutes);
      netWPM = Math.max(0, netWPM);
    }
    
    if (this.totalKeystrokes > 0) {
      accuracy = ((this.totalKeystrokes - this.errorCount) / this.totalKeystrokes) * 100;
      accuracy = Math.max(0, Math.min(100, accuracy));
    }
    
    return {
      rawWPM: Math.round(rawWPM),
      netWPM: Math.round(netWPM),
      accuracy: parseFloat(accuracy.toFixed(1)),
      elapsedTime: this.getElapsedTime(),
      totalKeystrokes: this.totalKeystrokes,
      errorCount: this.errorCount,
      uncorrectedErrors: this.uncorrectedErrors,
      correctedErrors: this.correctedErrors
    };
  }

  getElapsedTime() {
    let currentStretch = 0;
    if (this.startTime !== null && !this.isPaused && !this.isFinished) {
      currentStretch = Date.now() - this.startTime;
    }
    return this.elapsedTime + currentStretch;
  }

  getElapsedMinutes() {
    return this.getElapsedTime() / 60000;
  }

  /**
   * Pushes latest metrics updates to listeners
   */
  dispatchStats() {
    const stats = this.calculateStats();
    
    this.dispatchEvent('wpm:update', {
      wpm: stats.netWPM,
      rawWpm: stats.rawWPM,
      elapsed: stats.elapsedTime
    });
    
    this.dispatchEvent('accuracy:update', {
      accuracy: stats.accuracy,
      errors: stats.errorCount
    });
    
    this.dispatchEvent('stats:change', stats);
  }

  /**
   * Compiles and parses text into structure of sentences and words
   */
  parseText() {
    const words = [];
    let currentWord = [];
    let sentenceIdx = 0;
    let wordIdx = 0;
    
    for (let i = 0; i < this.text.length; i++) {
      const char = this.text[i];
      const charObj = {
        char: char,
        globalIdx: i,
        wordIdx: wordIdx,
        sentenceIdx: sentenceIdx
      };
      
      currentWord.push(charObj);
      
      if (char === ' ' || char === '\n' || char === '\t') {
        words.push({
          chars: currentWord,
          wordIdx: wordIdx,
          sentenceIdx: sentenceIdx
        });
        wordIdx++;
        currentWord = [];
      }
      
      if (i > 0 && /[.!?]/.test(this.text[i - 1]) && /\s/.test(char)) {
        sentenceIdx++;
      }
    }
    
    if (currentWord.length > 0) {
      words.push({
        chars: currentWord,
        wordIdx: wordIdx,
        sentenceIdx: sentenceIdx
      });
    }
    
    return words;
  }

  /**
   * Renders target text wrapped inside word/char span tags
   */
  render() {
    this.container.innerHTML = '';
    this.wordsData = this.parseText();
    
    const fragment = document.createDocumentFragment();
    
    this.wordsData.forEach(wordData => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      wordSpan.setAttribute('data-word-idx', wordData.wordIdx);
      wordSpan.setAttribute('data-sentence-idx', wordData.sentenceIdx);
      
      wordData.chars.forEach(charData => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char unread';
        
        if (charData.char === ' ') {
          charSpan.innerHTML = '&nbsp;';
          charSpan.classList.add('space-char');
        } else if (charData.char === '\n') {
          charSpan.innerHTML = '&crarr;<br>';
          charSpan.classList.add('newline-char');
        } else {
          charSpan.textContent = charData.char;
        }
        
        charSpan.setAttribute('data-idx', charData.globalIdx);
        charSpan.setAttribute('data-word-idx', charData.wordIdx);
        charSpan.setAttribute('data-sentence-idx', charData.sentenceIdx);
        
        wordSpan.appendChild(charSpan);
      });
      
      fragment.appendChild(wordSpan);
    });
    
    this.container.appendChild(fragment);
    this.updateDOMClasses();
  }

  /**
   * Applies active, correct, incorrect, dimmed, or hidden classes to text elements
   */
  updateDOMClasses() {
    const chars = this.container.querySelectorAll('.char');
    const words = this.container.querySelectorAll('.word');
    
    let currentWordIdx = 0;
    let currentSentenceIdx = 0;
    
    for (const word of this.wordsData) {
      const firstChar = word.chars[0];
      const lastChar = word.chars[word.chars.length - 1];
      if (this.index >= firstChar.globalIdx && this.index <= lastChar.globalIdx) {
        currentWordIdx = word.wordIdx;
        currentSentenceIdx = word.sentenceIdx;
        break;
      }
    }
    
    if (this.index >= this.text.length && this.wordsData.length > 0) {
      const lastWord = this.wordsData[this.wordsData.length - 1];
      currentWordIdx = lastWord.wordIdx;
      currentSentenceIdx = lastWord.sentenceIdx;
    }
    
    chars.forEach(charSpan => {
      const idx = parseInt(charSpan.getAttribute('data-idx'), 10);
      charSpan.classList.remove('current', 'correct', 'incorrect', 'unread', 'has-error');
      
      if (idx === this.index) {
        charSpan.classList.add('current');
        if (this.charStates[idx].state === 'incorrect') {
          charSpan.classList.add('has-error');
        }
      } else if (idx < this.index) {
        const state = this.charStates[idx].state;
        charSpan.classList.add(state);
      } else {
        charSpan.classList.add('unread');
      }
    });
    
    words.forEach(wordSpan => {
      const wIdx = parseInt(wordSpan.getAttribute('data-word-idx'), 10);
      const sIdx = parseInt(wordSpan.getAttribute('data-sentence-idx'), 10);
      
      wordSpan.classList.remove('current-word', 'completed-word', 'upcoming-word', 'dimmed', 'hidden');
      
      if (wIdx === currentWordIdx) {
        wordSpan.classList.add('current-word');
      } else if (wIdx < currentWordIdx) {
        wordSpan.classList.add('completed-word');
      } else {
        wordSpan.classList.add('upcoming-word');
      }
      
      // Mode filtering
      if (this.mode === 'word') {
        if (wIdx !== currentWordIdx) {
          wordSpan.classList.add('hidden');
        }
      } else if (this.mode === 'sentence') {
        if (sIdx !== currentSentenceIdx) {
          wordSpan.classList.add('dimmed');
        }
      }
    });
    
    this.autoScroll();
  }

  /**
   * Centers the line of the current cursor dynamically, triggered only when line changes
   */
  autoScroll() {
    const currentEl = this.container.querySelector('.char.current');
    if (!currentEl) return;
    
    const elementOffsetTop = currentEl.offsetTop;
    if (this.lastOffsetTop === undefined) {
      this.lastOffsetTop = elementOffsetTop;
    }
    
    if (elementOffsetTop !== this.lastOffsetTop) {
      this.lastOffsetTop = elementOffsetTop;
      
      const containerHeight = this.container.clientHeight;
      const elementHeight = currentEl.clientHeight;
      const targetScrollTop = elementOffsetTop - (containerHeight / 2) + (elementHeight / 2);
      
      this.container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
    }
  }

  /**
   * Input event dispatcher responding to keydown actions
   */
  handleKeyDown(e) {
    if (!this.isActive || this.isPaused || this.isFinished) return;
    
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const key = e.key;
    
    // Backspace handling
    if (key === 'Backspace') {
      if (!this.allowBackspace) return;
      e.preventDefault();
      
      if (this.index > 0) {
        this.index--;
        
        const oldState = this.charStates[this.index].state;
        if (oldState === 'incorrect') {
          this.uncorrectedErrors = Math.max(0, this.uncorrectedErrors - 1);
        }
        
        this.charStates[this.index].state = 'unread';
        this.correctedErrors++;
        
        if (this.backspacePenalty) {
          this.totalKeystrokes++;
          this.errorCount++;
        }
        
        this.updateDOMClasses();
        this.dispatchStats();
        
        this.dispatchEvent('char:change', {
          char: this.text[this.index],
          index: this.index
        });
      }
      return;
    }
    
    // Non-character key filters (Shift, Control, Alt, CapsLock, etc.)
    if (key.length > 1) return;
    
    if (key === ' ') {
      e.preventDefault();
    }
    
    const now = Date.now();
    if (this.startTime === null) {
      this.startTime = now;
      this.startStatsTimer();
    }
    
    const expectedChar = this.text[this.index];
    const isCorrect = key === expectedChar;
    
    // Log delay
    let delay = 0;
    if (this.keystrokeTelemetry.length > 0) {
      const lastKeystroke = this.keystrokeTelemetry[this.keystrokeTelemetry.length - 1];
      delay = now - lastKeystroke.timestamp;
      
      const cleanLast = lastKeystroke.key === ' ' ? '[space]' : lastKeystroke.key;
      const cleanCurrent = key === ' ' ? '[space]' : key;
      
      this.keyPairDelays.push({
        pair: cleanLast + '->' + cleanCurrent,
        delay: delay,
        isCorrect: isCorrect,
        timestamp: now
      });
    }
    
    this.keystrokeTelemetry.push({
      key: key,
      expected: expectedChar,
      timestamp: now,
      index: this.index,
      isCorrect: isCorrect,
      delay: delay
    });
    
    this.totalKeystrokes++;
    
    if (this.forceCorrectKey) {
      if (isCorrect) {
        if (this.charStates[this.index].state === 'incorrect') {
          this.uncorrectedErrors = Math.max(0, this.uncorrectedErrors - 1);
          this.correctedErrors++;
        }
        this.charStates[this.index].state = 'correct';
        this.index++;
      } else {
        if (this.charStates[this.index].state !== 'incorrect') {
          this.charStates[this.index].state = 'incorrect';
          this.uncorrectedErrors++;
        }
        this.charStates[this.index].errorCount++;
        this.errorCount++;
        
        this.dispatchEvent('error:keystroke', {
          key: key,
          expected: expectedChar,
          index: this.index
        });
      }
    } else {
      if (isCorrect) {
        this.charStates[this.index].state = 'correct';
        this.index++;
      } else {
        this.charStates[this.index].state = 'incorrect';
        this.charStates[this.index].errorCount++;
        this.errorCount++;
        this.uncorrectedErrors++;
        
        this.dispatchEvent('error:keystroke', {
          key: key,
          expected: expectedChar,
          index: this.index
        });
        
        this.index++;
      }
    }
    
    this.updateDOMClasses();
    this.dispatchStats();
    
    if (this.index >= this.text.length) {
      this.finish();
    } else {
      this.dispatchEvent('char:change', {
        char: this.text[this.index],
        index: this.index
      });
    }
  }

  /**
   * Compiles weak keypair speeds and error ratios
   */
  analyzeWeakKeys() {
    const summary = {};
    
    this.keyPairDelays.forEach(item => {
      const pair = item.pair;
      if (!summary[pair]) {
        summary[pair] = {
          key_pair: pair,
          error_count: 0,
          total_delay: 0,
          count: 0
        };
      }
      
      summary[pair].count++;
      summary[pair].total_delay += item.delay;
      if (!item.isCorrect) {
        summary[pair].error_count++;
      }
    });
    
    const results = [];
    for (const pair in summary) {
      const item = summary[pair];
      results.push({
        key_pair: item.key_pair,
        error_count: item.error_count,
        avg_delay_ms: Math.round(item.total_delay / item.count),
        count: item.count
      });
    }
    
    results.sort((a, b) => {
      if (b.error_count !== a.error_count) {
        return b.error_count - a.error_count;
      }
      return b.avg_delay_ms - a.avg_delay_ms;
    });
    
    return results;
  }
}

// Expose globally
window.TypingEngine = TypingEngine;
