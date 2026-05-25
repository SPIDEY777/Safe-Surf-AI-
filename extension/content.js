// SafeSurf AI Content Script
console.log('%c[SafeSurf AI] Shield Active', 'color: #00f2fe; font-weight: bold; font-size: 1.2em;');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SHOW_THREAT_BANNER') {
    injectThreatBanner(message.data);
  }
});

function injectThreatBanner(data) {
  // Check if banner already exists
  if (document.getElementById('safesurf-threat-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'safesurf-threat-banner';
  
  const isDangerous = data.risk === 'Dangerous';
  const color = isDangerous ? '#ff0055' : '#ffb800';
  const shadow = isDangerous ? 'rgba(255, 0, 85, 0.5)' : 'rgba(255, 184, 0, 0.5)';

  banner.innerHTML = `
    <div class="safesurf-banner-content">
      <div class="safesurf-icon">⚠️</div>
      <div class="safesurf-text">
        <span class="safesurf-title">SAFESURF AI ALERT: ${data.risk.toUpperCase()} SITE DETECTED</span>
        <span class="safesurf-desc">${data.explanation.substring(0, 150)}...</span>
      </div>
      <button id="safesurf-close-btn">DISMISS</button>
    </div>
    <style>
      #safesurf-threat-banner {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #0a0b10;
        color: white;
        z-index: 2147483647;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        border-bottom: 3px solid ${color};
        box-shadow: 0 4px 30px ${shadow};
        animation: safesurf-slide-down 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        padding: 12px 24px;
      }
      .safesurf-banner-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .safesurf-icon {
        font-size: 24px;
        filter: drop-shadow(0 0 5px ${color});
      }
      .safesurf-text {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      .safesurf-title {
        font-weight: 800;
        font-size: 14px;
        color: ${color};
        letter-spacing: 1px;
      }
      .safesurf-desc {
        font-size: 12px;
        color: #8892b0;
      }
      #safesurf-close-btn {
        background: transparent;
        border: 1px solid #444;
        color: #8892b0;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 10px;
        font-weight: 800;
        transition: all 0.2s;
      }
      #safesurf-close-btn:hover {
        border-color: #8892b0;
        color: white;
      }
      @keyframes safesurf-slide-down {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
      }
    </style>
  `;

  document.body.prepend(banner);

  document.getElementById('safesurf-close-btn').addEventListener('click', () => {
    banner.style.transition = 'transform 0.3s ease-in';
    banner.style.transform = 'translateY(-100%)';
    setTimeout(() => banner.remove(), 300);
  });
}
