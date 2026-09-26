/**
 * TypeFlow Charting Engine
 * Visual wrappers and configurations for Chart.js (dark theme styled)
 */

window.TypeFlowCharts = {
    // Global dark theme configuration defaults
    theme: {
        primary: '#6C63FF',      // Purple
        primaryGlow: 'rgba(108, 99, 255, 0.15)',
        secondary: '#00D4AA',    // Teal
        secondaryGlow: 'rgba(0, 212, 170, 0.15)',
        warning: '#FF6B35',      // Orange
        warningGlow: 'rgba(255, 107, 53, 0.15)',
        text: '#8892B0',
        textLight: '#F0F4FF',
        gridLines: 'rgba(255, 255, 255, 0.06)',
        tooltipBg: '#151D35',
        tooltipBorder: 'rgba(255, 255, 255, 0.1)'
    },

    /**
     * Helper to get default options for dark-theme charts
     */
    getDefaultOptions(titleText) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: this.theme.text,
                        font: {
                            family: 'Inter, sans-serif',
                            size: 12
                        }
                    }
                },
                title: {
                    display: !!titleText,
                    text: titleText || '',
                    color: this.theme.textLight,
                    font: {
                        family: 'Outfit, sans-serif',
                        size: 16,
                        weight: '600'
                    },
                    padding: { bottom: 15 }
                },
                tooltip: {
                    backgroundColor: this.theme.tooltipBg,
                    titleColor: this.theme.textLight,
                    bodyColor: this.theme.textLight,
                    borderColor: this.theme.tooltipBorder,
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    bodyFont: {
                        family: 'Inter, sans-serif'
                    },
                    titleFont: {
                        family: 'Outfit, sans-serif',
                        weight: '600'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: this.theme.gridLines,
                        borderColor: this.theme.gridLines
                    },
                    ticks: {
                        color: this.theme.text,
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: this.theme.gridLines,
                        borderColor: this.theme.gridLines
                    },
                    ticks: {
                        color: this.theme.text,
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11
                        }
                    }
                }
            }
        };
    },

    /**
     * Initializes the 30-day WPM line chart with a target overlay
     * @param {string} canvasId
     * @param {Array<string>} labels - Date labels
     * @param {Array<number>} wpmData - Student WPM values
     * @param {Array<number>} targetData - Target WPM overlay
     */
    initWpmTrendChart(canvasId, labels, wpmData, targetData) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // Create gradient fill for WPM line
        const gradientCtx = ctx.getContext('2d');
        const gradient = gradientCtx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(108, 99, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(108, 99, 255, 0.0)');

        const options = this.getDefaultOptions();
        options.plugins.legend.position = 'top';
        options.scales.y.suggestedMin = 10;
        options.scales.y.suggestedMax = 80;
        options.scales.y.title = {
            display: true,
            text: 'Words Per Minute (WPM)',
            color: this.theme.text,
            font: { family: 'Inter, sans-serif', size: 12 }
        };

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Your WPM',
                        data: wpmData,
                        borderColor: this.theme.primary,
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: this.theme.primary,
                        pointBorderColor: '#fff',
                        pointHoverRadius: 7,
                        pointRadius: 4
                    },
                    {
                        label: '30-Day Goal Pathway (to 70 WPM)',
                        data: targetData,
                        borderColor: this.theme.secondary,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.1,
                        borderWidth: 2,
                        pointRadius: 0, // hide points
                        pointHoverRadius: 0
                    }
                ]
            },
            options: options
        });
    },

    /**
     * Initializes the daily accuracy bar chart
     * @param {string} canvasId
     * @param {Array<string>} labels
     * @param {Array<number>} accuracyData
     */
    initAccuracyChart(canvasId, labels, accuracyData) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const options = this.getDefaultOptions();
        options.scales.y.min = 70;
        options.scales.y.max = 100;
        options.scales.y.title = {
            display: true,
            text: 'Accuracy %',
            color: this.theme.text,
            font: { family: 'Inter, sans-serif', size: 12 }
        };
        options.plugins.legend.display = false;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Accuracy',
                    data: accuracyData,
                    backgroundColor: this.theme.secondary,
                    borderColor: this.theme.secondary,
                    borderRadius: 4,
                    borderWidth: 0,
                    barPercentage: 0.6
                }]
            },
            options: options
        });
    },

    /**
     * Initializes the practice duration bar chart
     * @param {string} canvasId
     * @param {Array<string>} labels
     * @param {Array<number>} durationData
     */
    initDurationChart(canvasId, labels, durationData) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const options = this.getDefaultOptions();
        options.scales.y.suggestedMin = 0;
        options.scales.y.title = {
            display: true,
            text: 'Practice (Minutes)',
            color: this.theme.text,
            font: { family: 'Inter, sans-serif', size: 12 }
        };
        options.plugins.legend.display = false;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Minutes Practiced',
                    data: durationData,
                    backgroundColor: this.theme.warning,
                    borderColor: this.theme.warning,
                    borderRadius: 4,
                    borderWidth: 0,
                    barPercentage: 0.6
                }]
            },
            options: options
        });
    },

    /**
     * Creates an accuracy donut (ring) chart for session results
     * @param {string} canvasId
     * @param {number} accuracy - Accuracy percentage (0-100)
     */
    createSessionResultsDonut(canvasId, accuracy) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const remaining = 100 - accuracy;
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Correct', 'Errors'],
                datasets: [{
                    data: [accuracy, remaining],
                    backgroundColor: [this.theme.secondary, '#1E293B'],
                    borderWidth: 0,
                    hoverOffset: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    },

    /**
     * Renders a QWERTY weak key heatmap visualization overlay
     * Map of keys and their error weights
     * @param {string} keyboardContainerId
     * @param {Array} weakKeys - Array of weak keypair records
     */
    renderKeyboardHeatmap(keyboardContainerId, weakKeys) {
        const container = document.getElementById(keyboardContainerId);
        if (!container) return;

        // Build a weight dictionary for individual keys based on keypair errors
        const keyWeights = {};
        let maxWeight = 0;

        weakKeys.forEach(item => {
            const pair = item.key_pair.toLowerCase();
            const errors = parseInt(item.error_count) || 0;
            // Split the pair (e.g. "a-s" or "as")
            const parts = pair.includes('-') ? pair.split('-') : pair.split('');
            parts.forEach(char => {
                if (char && char.length === 1) {
                    keyWeights[char] = (keyWeights[char] || 0) + errors;
                    if (keyWeights[char] > maxWeight) {
                        maxWeight = keyWeights[char];
                    }
                }
            });
        });

        // Get all key elements inside the visual keyboard
        const keyElements = container.querySelectorAll('.keyboard-key');
        keyElements.forEach(el => {
            const keyCode = el.getAttribute('data-code');
            if (!keyCode) return;

            // Map KeyA => 'a', Digit1 => '1', etc.
            let charVal = '';
            if (keyCode.startsWith('Key')) {
                charVal = keyCode.replace('Key', '').toLowerCase();
            } else if (keyCode.startsWith('Digit')) {
                charVal = keyCode.replace('Digit', '');
            } else {
                charVal = keyCode.toLowerCase();
            }
            if (keyWeights[charVal]) {
                // Calculate percentage heat
                const ratio = maxWeight > 0 ? (keyWeights[charVal] / maxWeight) : 0;
                // Transition from transparent / default background to red/orange accent
                // CSS variable lookup or fallback colors
                el.style.backgroundColor = `rgba(255, 107, 53, ${Math.max(0.15, ratio * 0.85)})`;
                el.style.borderColor = `rgba(255, 107, 53, ${Math.max(0.3, ratio)})`;
                el.style.boxShadow = `0 0 ${Math.round(ratio * 15)}px rgba(255, 107, 53, ${ratio * 0.4})`;
                
                // Add a small indicator of key error count
                let badge = el.querySelector('.heat-badge');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'heat-badge';
                    badge.style.position = 'absolute';
                    badge.style.bottom = '2px';
                    badge.style.right = '4px';
                    badge.style.fontSize = '8px';
                    badge.style.color = '#F0F4FF';
                    badge.style.opacity = '0.7';
                    el.appendChild(badge);
                }
                badge.innerText = keyWeights[charVal];
            } else {
                // Reset style
                el.style.backgroundColor = '';
                el.style.borderColor = '';
                el.style.boxShadow = '';
                const badge = el.querySelector('.heat-badge');
                if (badge) badge.remove();
            }
        });
    }
};
