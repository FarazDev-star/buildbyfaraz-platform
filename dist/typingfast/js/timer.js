class SessionTimer {
    constructor(options = {}) {
        this.blocks = [
            { id: 'warmup', name: 'Warm-up', duration: options.warmupDuration || 15 * 60, colorClass: 'warmup' },
            { id: 'drills', name: 'Lesson Drills', duration: options.drillsDuration || 60 * 60, colorClass: 'drills' },
            { id: 'speedtest', name: 'Speed Test', duration: options.speedtestDuration || 10 * 60, colorClass: 'speedtest' },
            { id: 'review', name: 'Review & Unlock', duration: options.reviewDuration || 15 * 60, colorClass: 'review' }
        ];

        this.currentBlockIndex = 0;
        this.totalDuration = this.blocks.reduce((acc, b) => acc + b.duration, 0);
        this.totalSecondsElapsed = 0;
        this.blockSecondsElapsed = 0;
        this.timerId = null;
        this.isPaused = true;
        this.breakInterval = options.breakInterval || 45 * 60; // 45 minutes

        this.onTick = options.onTick || null;
        this.onBlockComplete = options.onBlockComplete || null;
        this.onBreakReminder = options.onBreakReminder || null;
        this.onSessionComplete = options.onSessionComplete || null;
    }

    start() {
        if (!this.timerId) {
            this.isPaused = false;
            this.timerId = setInterval(() => this.tick(), 1000);
        }
    }

    pause() {
        this.isPaused = true;
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    tick() {
        if (this.isPaused) return;

        this.totalSecondsElapsed++;
        this.blockSecondsElapsed++;

        const currentBlock = this.blocks[this.currentBlockIndex];
        const blockSecondsRemaining = Math.max(0, currentBlock.duration - this.blockSecondsElapsed);

        // 45-min break reminder check
        if (this.totalSecondsElapsed > 0 && this.totalSecondsElapsed % this.breakInterval === 0) {
            this.pause();
            if (this.onBreakReminder) {
                this.onBreakReminder();
            }
        }

        // Fire onTick
        if (this.onTick) {
            this.onTick({
                currentBlockIndex: this.currentBlockIndex,
                currentBlock: currentBlock,
                blockSecondsElapsed: this.blockSecondsElapsed,
                blockSecondsRemaining: blockSecondsRemaining,
                blockPercent: (this.blockSecondsElapsed / currentBlock.duration) * 100,
                totalSecondsElapsed: this.totalSecondsElapsed,
                totalSecondsRemaining: Math.max(0, this.totalDuration - this.totalSecondsElapsed),
                totalPercent: (this.totalSecondsElapsed / this.totalDuration) * 100
            });
        }

        // Handle block completion
        if (this.blockSecondsElapsed >= currentBlock.duration) {
            this.nextBlock();
        }
    }

    nextBlock() {
        this.blockSecondsElapsed = 0;
        const completedBlock = this.blocks[this.currentBlockIndex];
        
        if (this.currentBlockIndex < this.blocks.length - 1) {
            this.currentBlockIndex++;
            if (this.onBlockComplete) {
                this.onBlockComplete(completedBlock, this.blocks[this.currentBlockIndex]);
            }
        } else {
            this.pause();
            if (this.onSessionComplete) {
                this.onSessionComplete();
            }
        }
    }

    reset() {
        this.pause();
        this.currentBlockIndex = 0;
        this.totalSecondsElapsed = 0;
        this.blockSecondsElapsed = 0;
    }
}
