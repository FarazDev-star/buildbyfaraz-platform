/**
 * TypeFlow â€” Global App Initializer
 * Runs on every page: sets up Lucide icons, dark mode, global event bus,
 * keyboard shortcut hints, and common UI helpers.
 */
(function () {
    'use strict';

    // â”€â”€ Lucide Icons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    function initIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // â”€â”€ Simple global event bus â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const EventBus = {
        _handlers: {},
        on(event, fn) {
            if (!this._handlers[event]) this._handlers[event] = [];
            this._handlers[event].push(fn);
        },
        off(event, fn) {
            if (!this._handlers[event]) return;
            this._handlers[event] = this._handlers[event].filter(h => h !== fn);
        },
        emit(event, data) {
            (this._handlers[event] || []).forEach(fn => {
                try { fn(data); } catch (e) { console.error('EventBus error:', e); }
            });
        }
    };
    window.TypeFlowEvents = EventBus;

    // â”€â”€ Toast helper (global) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    function showToast(message, type = 'info', duration = 4000) {
        const colors = {
            info:    { bg: 'rgba(108,99,255,0.15)', border: 'rgba(108,99,255,0.4)', text: '#a89fff' },
            success: { bg: 'rgba(0,212,170,0.12)',  border: 'rgba(0,212,170,0.4)',  text: '#00D4AA' },
            error:   { bg: 'rgba(255,107,53,0.12)', border: 'rgba(255,107,53,0.4)', text: '#FF6B35' },
            warning: { bg: 'rgba(255,215,0,0.10)',  border: 'rgba(255,215,0,0.35)', text: '#FFD700' }
        };
        const c = colors[type] || colors.info;

        const toast = document.createElement('div');
        toast.style.cssText = `
            position:fixed; bottom:24px; right:24px; z-index:99999;
            background:${c.bg}; border:1px solid ${c.border}; color:${c.text};
            padding:14px 20px; border-radius:12px; font-family:inherit;
            font-size:0.875rem; max-width:360px; line-height:1.5;
            backdrop-filter:blur(12px); box-shadow:0 8px 24px rgba(0,0,0,0.3);
            transform:translateX(120%); transition:transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, duration);
    }
    window.TypeFlowToast = showToast;

    // â”€â”€ Active nav link highlighter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    function highlightActiveNav() {
        const path = window.location.pathname;
        document.querySelectorAll('nav a, .nav-link').forEach(link => {
            try {
                const href = new URL(link.href, window.location.origin).pathname;
                if (path.endsWith(href) || (href !== '/' && path.includes(href.split('/').pop().replace('.php', '')))) {
                    link.classList.add('active');
                }
            } catch (e) { /* skip bad hrefs */ }
        });
    }

    // â”€â”€ Confirm dialogs for dangerous actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.addEventListener('click', function (e) {
        const el = e.target.closest('[data-confirm]');
        if (!el) return;
        const msg = el.getAttribute('data-confirm') || 'Are you sure?';
        if (!window.confirm(msg)) e.preventDefault();
    });

    // â”€â”€ Auto-dismiss flash messages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    function autoDismissAlerts() {
        document.querySelectorAll('.alert-auto-dismiss').forEach(el => {
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s';
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 500);
            }, 5000);
        });
    }

    // â”€â”€ Smooth scroll for anchor links â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // â”€â”€ Init on DOM ready â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initIcons();
            highlightActiveNav();
            autoDismissAlerts();
        });
    } else {
        initIcons();
        highlightActiveNav();
        autoDismissAlerts();
    }

    // ── Global Fetch Interceptor for CSRF ───────────────────────────────────
    const originalFetch = window.fetch;
    window.fetch = async function () {
        let [resource, config] = arguments;
        if (!config) config = {};
        if (!config.headers) config.headers = {};
        
        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        if (csrfMeta && csrfMeta.content) {
            if (config.headers instanceof Headers) {
                if (!config.headers.has('X-CSRF-Token')) {
                    config.headers.append('X-CSRF-Token', csrfMeta.content);
                }
            } else {
                if (!config.headers['X-CSRF-Token'] && !config.headers['x-csrf-token']) {
                    config.headers['X-CSRF-Token'] = csrfMeta.content;
                }
            }
        }
        return originalFetch(resource, config);
    };

    // Expose helpers
    window.TypeFlowApp = { showToast, initIcons, EventBus };
})();

