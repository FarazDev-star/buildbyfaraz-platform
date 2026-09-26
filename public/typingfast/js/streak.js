/**
 * TypeFlow Gamification & Notifications Library
 * Handles toast alerts and achievement modals for streaks, XP, and badge unlocks.
 */

(function () {
  // 1. Inject Styles dynamically for self-contained UI styling
  const style = document.createElement('style');
  style.textContent = `
    .tf-notification-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 9999;
      pointer-events: none;
    }

    .tf-toast {
      pointer-events: auto;
      min-width: 320px;
      max-width: 400px;
      background: rgba(30, 30, 40, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(108, 99, 255, 0.1);
      padding: 16px;
      color: #ffffff;
      display: flex;
      gap: 14px;
      align-items: center;
      backdrop-filter: blur(10px);
      transform: translateX(120%);
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s;
      opacity: 0;
    }

    .tf-toast.show {
      transform: translateX(0);
      opacity: 1;
    }

    .tf-toast-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .tf-streak-toast .tf-toast-icon {
      background: rgba(255, 107, 53, 0.15);
      color: #ff6b35;
      border: 1px solid rgba(255, 107, 53, 0.3);
      box-shadow: 0 0 10px rgba(255, 107, 53, 0.2);
    }

    .tf-badge-toast .tf-toast-icon {
      background: rgba(255, 215, 0, 0.15);
      color: #ffd700;
      border: 1px solid rgba(255, 215, 0, 0.3);
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
    }

    .tf-toast-content {
      flex-grow: 1;
    }

    .tf-toast-title {
      font-weight: 700;
      font-size: 15px;
      margin-bottom: 2px;
      color: #ffffff;
    }

    .tf-toast-desc {
      font-size: 13px;
      color: #a0aec0;
      line-height: 1.4;
    }

    /* Modal Overlay styling for important badges */
    .tf-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .tf-modal-overlay.show {
      opacity: 1;
    }

    .tf-modal-card {
      background: linear-gradient(135deg, #1e1e28 0%, #13131a 100%);
      border: 2px solid rgba(255, 215, 0, 0.3);
      border-radius: 20px;
      padding: 32px;
      text-align: center;
      max-width: 420px;
      width: 90%;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.15);
      transform: scale(0.7);
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .tf-modal-overlay.show .tf-modal-card {
      transform: scale(1);
    }

    .tf-modal-badge-img {
      width: 120px;
      height: 120px;
      margin: 0 auto 20px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 64px;
      animation: floatBadge 3s ease-in-out infinite;
    }

    @keyframes floatBadge {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .tf-modal-title {
      font-size: 24px;
      font-weight: 800;
      color: #ffd700;
      margin-bottom: 8px;
    }

    .tf-modal-subtitle {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #a0aec0;
      margin-bottom: 16px;
    }

    .tf-modal-desc {
      font-size: 16px;
      color: #cbd5e0;
      line-height: 1.5;
      margin-bottom: 24px;
    }

    .tf-modal-btn {
      background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
      border: none;
      color: #000000;
      font-weight: 700;
      padding: 12px 32px;
      border-radius: 30px;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .tf-modal-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
    }
  `;
  document.head.appendChild(style);

  // 2. Initialize Container
  let container = document.querySelector('.tf-notification-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'tf-notification-container';
    document.body.appendChild(container);
  }

  const StreakManager = {
    /**
     * Show custom streak toast
     */
    showStreak: function (days, xpEarned = 20) {
      const toast = document.createElement('div');
      toast.className = 'tf-toast tf-streak-toast';
      toast.innerHTML = `
        <div class="tf-toast-icon">🔥</div>
        <div class="tf-toast-content">
          <div class="tf-toast-title">${days}-Day Streak!</div>
          <div class="tf-toast-desc">Keep typing daily to protect your progress. Reward: <strong>+${xpEarned} XP</strong>.</div>
        </div>
      `;
      container.appendChild(toast);
      
      // Trigger animations
      setTimeout(() => toast.classList.add('show'), 100);
      
      // Auto dismiss
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, 5000);
    },

    /**
     * Show custom badge toast
     */
    showBadgeToast: function (badgeTitle, badgeDesc) {
      const toast = document.createElement('div');
      toast.className = 'tf-toast tf-badge-toast';
      toast.innerHTML = `
        <div class="tf-toast-icon">🏆</div>
        <div class="tf-toast-content">
          <div class="tf-toast-title">New Badge Earned!</div>
          <div class="tf-toast-desc">Unlocked <strong>${badgeTitle}</strong>: ${badgeDesc}</div>
        </div>
      `;
      container.appendChild(toast);
      
      // Trigger animations
      setTimeout(() => toast.classList.add('show'), 100);
      
      // Auto dismiss
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, 6000);
    },

    /**
     * Show high-impact achievement modal overlay
     */
    showBadgeModal: function (badge) {
      const overlay = document.createElement('div');
      overlay.className = 'tf-modal-overlay';
      
      // Pick a suitable icon based on title/criteria
      let icon = '🎖️';
      if (badge.title.includes('Streak')) icon = '🔥';
      else if (badge.title.includes('Gonzales') || badge.title.includes('Speed')) icon = '⚡';
      else if (badge.title.includes('Home Row')) icon = '🎹';
      else if (badge.title.includes('Graduate')) icon = '🎓';
      else if (badge.title.includes('Accuracy') || badge.title.includes('Master')) icon = '🎯';

      overlay.innerHTML = `
        <div class="tf-modal-card">
          <div class="tf-modal-badge-img">${icon}</div>
          <div class="tf-modal-title">Achievement Unlocked!</div>
          <div class="tf-modal-subtitle">${badge.title}</div>
          <div class="tf-modal-desc">${badge.description}</div>
          <button class="tf-modal-btn">Awesome!</button>
        </div>
      `;

      document.body.appendChild(overlay);

      // Trigger animations
      setTimeout(() => overlay.classList.add('show'), 50);

      // Bind close action
      overlay.querySelector('.tf-modal-btn').addEventListener('click', () => {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
      });
    },

    /**
     * Automatically handle the backend API session response objects
     */
    handleSessionResults: function (data) {
      if (!data || !data.success) return;

      // 1. Check streak notification
      if (data.xp_earned > 0 && data.streak > 0) {
        // Assume streak was updated/maintained
        this.showStreak(data.streak, data.xp_earned);
      }

      // 2. Check badge unlocks
      if (data.badges_unlocked && Array.isArray(data.badges_unlocked)) {
        data.badges_unlocked.forEach((badge, index) => {
          // Stagger modal / toast triggers
          setTimeout(() => {
            if (index === 0) {
              this.showBadgeModal(badge);
            } else {
              this.showBadgeToast(badge.title, badge.description);
            }
          }, index * 800);
        });
      }
    }
  };

  // Expose globally
  window.StreakManager = StreakManager;
})();
