class VisualKeyboard {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = Object.assign({
            showFingerGuides: true,
            heatmapMode: false
        }, options);
        
        this.fingerMap = {
            // Row 1
            'Backquote': 'left-pinky', 'Digit1': 'left-pinky', 'Digit2': 'left-ring', 'Digit3': 'left-middle', 'Digit4': 'left-index', 'Digit5': 'left-index',
            'Digit6': 'right-index', 'Digit7': 'right-index', 'Digit8': 'right-middle', 'Digit9': 'right-ring', 'Digit0': 'right-pinky', 'Minus': 'right-pinky', 'Equal': 'right-pinky', 'Backspace': 'right-pinky',
            // Row 2
            'Tab': 'left-pinky', 'KeyQ': 'left-pinky', 'KeyW': 'left-ring', 'KeyE': 'left-middle', 'KeyR': 'left-index', 'KeyT': 'left-index',
            'KeyY': 'right-index', 'KeyU': 'right-index', 'KeyI': 'right-middle', 'KeyO': 'right-ring', 'KeyP': 'right-pinky', 'BracketLeft': 'right-pinky', 'BracketRight': 'right-pinky', 'Backslash': 'right-pinky',
            // Row 3
            'CapsLock': 'left-pinky', 'KeyA': 'left-pinky', 'KeyS': 'left-ring', 'KeyD': 'left-middle', 'KeyF': 'left-index', 'KeyG': 'left-index',
            'KeyH': 'right-index', 'KeyJ': 'right-index', 'KeyK': 'right-middle', 'KeyL': 'right-ring', 'Semicolon': 'right-pinky', 'Quote': 'right-pinky', 'Enter': 'right-pinky',
            // Row 4
            'ShiftLeft': 'left-pinky', 'KeyZ': 'left-pinky', 'KeyX': 'left-ring', 'KeyC': 'left-middle', 'KeyV': 'left-index', 'KeyB': 'left-index',
            'KeyN': 'right-index', 'KeyM': 'right-index', 'Comma': 'right-middle', 'Period': 'right-ring', 'Slash': 'right-pinky', 'ShiftRight': 'right-pinky',
            // Row 5
            'ControlLeft': 'left-pinky', 'MetaLeft': 'thumb', 'AltLeft': 'thumb', 'Space': 'thumb', 'AltRight': 'thumb', 'ControlRight': 'right-pinky'
        };

        this.keyDefinitions = [
            [
                { code: 'Backquote', main: '`', shift: '~' },
                { code: 'Digit1', main: '1', shift: '!' },
                { code: 'Digit2', main: '2', shift: '@' },
                { code: 'Digit3', main: '3', shift: '#' },
                { code: 'Digit4', main: '4', shift: '$' },
                { code: 'Digit5', main: '5', shift: '%' },
                { code: 'Digit6', main: '6', shift: '^' },
                { code: 'Digit7', main: '7', shift: '&' },
                { code: 'Digit8', main: '8', shift: '*' },
                { code: 'Digit9', main: '9', shift: '(' },
                { code: 'Digit0', main: '0', shift: ')' },
                { code: 'Minus', main: '-', shift: '_' },
                { code: 'Equal', main: '=', shift: '+' },
                { code: 'Backspace', main: 'Backspace', class: 'key-backspace' }
            ],
            [
                { code: 'Tab', main: 'Tab', class: 'key-tab' },
                { code: 'KeyQ', main: 'q', shift: 'Q' },
                { code: 'KeyW', main: 'w', shift: 'W' },
                { code: 'KeyE', main: 'e', shift: 'E' },
                { code: 'KeyR', main: 'r', shift: 'R' },
                { code: 'KeyT', main: 't', shift: 'T' },
                { code: 'KeyY', main: 'y', shift: 'Y' },
                { code: 'KeyU', main: 'u', shift: 'U' },
                { code: 'KeyI', main: 'i', shift: 'I' },
                { code: 'KeyO', main: 'o', shift: 'O' },
                { code: 'KeyP', main: 'p', shift: 'P' },
                { code: 'BracketLeft', main: '[', shift: '{' },
                { code: 'BracketRight', main: ']', shift: '}' },
                { code: 'Backslash', main: '\\', shift: '|', class: 'key-backslash' }
            ],
            [
                { code: 'CapsLock', main: 'Caps', class: 'key-caps' },
                { code: 'KeyA', main: 'a', shift: 'A' },
                { code: 'KeyS', main: 's', shift: 'S' },
                { code: 'KeyD', main: 'd', shift: 'D' },
                { code: 'KeyF', main: 'f', shift: 'F' },
                { code: 'KeyG', main: 'g', shift: 'G' },
                { code: 'KeyH', main: 'h', shift: 'H' },
                { code: 'KeyJ', main: 'j', shift: 'J' },
                { code: 'KeyK', main: 'k', shift: 'K' },
                { code: 'KeyL', main: 'l', shift: 'L' },
                { code: 'Semicolon', main: ';', shift: ':' },
                { code: 'Quote', main: "'", shift: '"' },
                { code: 'Enter', main: 'Enter', class: 'key-enter' }
            ],
            [
                { code: 'ShiftLeft', main: 'Shift', class: 'key-shift-left' },
                { code: 'KeyZ', main: 'z', shift: 'Z' },
                { code: 'KeyX', main: 'x', shift: 'X' },
                { code: 'KeyC', main: 'c', shift: 'C' },
                { code: 'KeyV', main: 'v', shift: 'V' },
                { code: 'KeyB', main: 'b', shift: 'B' },
                { code: 'KeyN', main: 'n', shift: 'N' },
                { code: 'KeyM', main: 'm', shift: 'M' },
                { code: 'Comma', main: ',', shift: '<' },
                { code: 'Period', main: '.', shift: '>' },
                { code: 'Slash', main: '/', shift: '?' },
                { code: 'ShiftRight', main: 'Shift', class: 'key-shift-right' }
            ],
            [
                { code: 'ControlLeft', main: 'Ctrl', class: 'key-ctrl' },
                { code: 'MetaLeft', main: 'Win', class: 'key-meta' },
                { code: 'AltLeft', main: 'Alt', class: 'key-alt' },
                { code: 'Space', main: 'Space', class: 'key-space' },
                { code: 'AltRight', main: 'Alt', class: 'key-alt' },
                { code: 'ControlRight', main: 'Ctrl', class: 'key-ctrl' }
            ]
        ];

        this.render();

        // ── Keyboard Sound Engine (Web Audio API) ──────────────────────────
        this.soundEnabled = true;
        this._audioCtx = null;
        this._initAudio();
    }

    _initAudio() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this._audioCtx = new AudioCtx();
            }
        } catch (e) {
            // Audio not available — silent mode
        }
    }

    /**
     * Plays a mechanical keyboard click sound via Web Audio API.
     * @param {'correct'|'incorrect'|'pressed'} type
     */
    playKeySound(type = 'pressed') {
        if (!this.soundEnabled || !this._audioCtx) return;
        try {
            const ctx = this._audioCtx;
            // Resume context on first user interaction (Chrome policy)
            if (ctx.state === 'suspended') ctx.resume();

            const oscillator = ctx.createOscillator();
            const gainNode   = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            const now = ctx.currentTime;

            if (type === 'incorrect') {
                // Slightly lower pitched thud for errors
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(120, now);
                oscillator.frequency.exponentialRampToValueAtTime(60, now + 0.08);
                gainNode.gain.setValueAtTime(0.06, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
            } else {
                // Clean mechanical click for correct/normal keys
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(800, now);
                oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.04);
                gainNode.gain.setValueAtTime(0.04, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                oscillator.start(now);
                oscillator.stop(now + 0.06);
            }
        } catch (e) {
            // Ignore audio errors silently
        }
    }

    /** Toggle sound on/off */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'keyboard-wrapper';
        if (this.options.showFingerGuides) {
            wrapper.className += ' show-finger-guides';
        }
        
        this.keyElements = {};
        
        this.keyDefinitions.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            
            row.forEach(keyDef => {
                const keyDiv = document.createElement('div');
                keyDiv.className = 'keyboard-key ' + (keyDef.class || '');
                keyDiv.setAttribute('data-code', keyDef.code);
                
                const finger = this.fingerMap[keyDef.code];
                if (finger) {
                    keyDiv.setAttribute('data-finger', finger);
                }
                
                if (keyDef.shift) {
                    const shiftSpan = document.createElement('span');
                    shiftSpan.className = 'key-label-shift';
                    shiftSpan.textContent = keyDef.shift;
                    keyDiv.appendChild(shiftSpan);
                }
                
                const mainSpan = document.createElement('span');
                mainSpan.className = 'key-label-main';
                mainSpan.textContent = keyDef.main;
                keyDiv.appendChild(mainSpan);
                
                
                // Micro-interaction: Magnetic Key Effect
                keyDiv.addEventListener('mousemove', (e) => {
                    const rect = keyDiv.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    keyDiv.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
                    keyDiv.style.zIndex = '10';
                });
                keyDiv.addEventListener('mouseleave', () => {
                    keyDiv.style.transform = `translate(0px, 0px) scale(1)`;
                    keyDiv.style.zIndex = '1';
                });

                rowDiv.appendChild(keyDiv);
                this.keyElements[keyDef.code] = keyDiv;
            });
            
            wrapper.appendChild(rowDiv);
        });
        
        this.container.appendChild(wrapper);
    }
    
    highlightKey(code, type = 'pressed') {
        const el = this.keyElements[code];
        if (el) {
            el.classList.add(`key-${type}`);
            if (type === 'correct' || type === 'incorrect') {
                setTimeout(() => {
                    el.classList.remove(`key-${type}`);
                }, 300);
            }
        }
        // Play keystroke sound on every key event
        if (type === 'pressed' || type === 'correct' || type === 'incorrect') {
            this.playKeySound(type);
        }
    }
    
    clearPressState(code) {
        const el = this.keyElements[code];
        if (el) {
            el.classList.remove('key-pressed');
        }
    }
    
    setHint(code) {
        // Clear old hints
        Object.values(this.keyElements).forEach(el => el.classList.remove('key-hint'));
        if (code) {
            const el = this.keyElements[code];
            if (el) el.classList.add('key-hint');
        }
    }

    getKeyCodeForChar(char) {
        if (!char) return null;
        if (char === ' ' || char === '\u00A0') return 'Space';
        if (char === '\n') return 'Enter';
        if (char === '\t') return 'Tab';
        
        const lowerChar = char.toLowerCase();
        for (const row of this.keyDefinitions) {
            for (const key of row) {
                if (key.main === lowerChar || (key.shift && key.shift.toLowerCase() === lowerChar)) {
                    return key.code;
                }
            }
        }
        return null;
    }

    setHeatmap(heatmapData) {
        // heatmapData = { 'KeyA': 0.8, 'KeyB': 0.2 } values 0 to 1
        Object.entries(this.keyElements).forEach(([code, el]) => {
            const weight = heatmapData[code];
            if (weight && weight > 0) {
                el.classList.add('in-heatmap-mode');
                // interpolate between green (#00D4AA) to red/orange (#FF6B35)
                const r = Math.round(0 + (255 - 0) * weight);
                const g = Math.round(212 + (107 - 212) * weight);
                const b = Math.round(170 + (53 - 170) * weight);
                el.style.setProperty('--heatmap-color', `rgba(${r}, ${g}, ${b}, 0.75)`);
            } else {
                el.classList.remove('in-heatmap-mode');
                el.style.removeProperty('--heatmap-color');
            }
        });
    }
}
