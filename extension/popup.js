// API_BASE is loaded globally from config.js

document.addEventListener('DOMContentLoaded', async () => {
  const currentUrlElement = document.getElementById('current-url');
  const scanBtn = document.getElementById('scan-btn');
  const rescanBtn = document.getElementById('rescan-btn');
  const initialView = document.getElementById('initial-view');
  const loadingView = document.getElementById('loading-view');
  const resultsView = document.getElementById('results-view');
  
  // Get active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || 'Unknown URL';
  currentUrlElement.textContent = url;

  // Handle Scan Button
  scanBtn.addEventListener('click', async () => {
    await performScan(url);
  });

  // Handle Rescan
  rescanBtn.addEventListener('click', async () => {
    resultsView.classList.add('hidden');
    initialView.classList.remove('hidden');
  });

  async function performScan(targetUrl) {
    initialView.classList.add('hidden');
    loadingView.classList.remove('hidden');
    document.getElementById('scan-status-badge').textContent = 'SCANNING';
    document.getElementById('scan-status-badge').style.background = '#4facfe';

    try {
      const response = await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) throw new Error('Scan failed');
      
      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error('Scan error:', error);
      alert('Failed to connect to SafeSurf AI backend. Ensure the server is online.');
      loadingView.classList.add('hidden');
      initialView.classList.remove('hidden');
    }
  }

  function displayResults(data) {
    loadingView.classList.add('hidden');
    resultsView.classList.remove('hidden');
    
    const score = data.score || 0;
    const risk = data.risk || 'Unknown';
    const explanation = data.explanation || 'No analysis available.';
    const recommendation = data.recommendation || 'Use caution.';

    // Update UI
    document.getElementById('threat-score').textContent = score;
    document.getElementById('risk-level').textContent = risk.toUpperCase();
    document.getElementById('analysis-explanation').textContent = explanation;
    document.getElementById('analysis-recommendation').textContent = recommendation;

    // Infrastructure data
    const infraView = document.getElementById('infra-view');
    if (data.infrastructure) {
      infraView.classList.remove('hidden');
      document.getElementById('infra-ip').textContent = data.infrastructure.ip || '-';
      document.getElementById('infra-org').textContent = data.infrastructure.org || '-';
      
      const infraRiskIndicators = data.indicators ? data.indicators.filter(i => i.toLowerCase().includes('infrastructure') || i.toLowerCase().includes('port') || i.toLowerCase().includes('hosted')) : [];
      document.getElementById('infra-indicators-count').textContent = `${infraRiskIndicators.length} Security Markers`;
      document.getElementById('infra-indicators-count').style.color = infraRiskIndicators.length > 0 ? '#ffb800' : '#00ff88';
    } else {
      infraView.classList.add('hidden');
    }

    // Update Score Circle
    const scorePath = document.getElementById('score-path');
    scorePath.setAttribute('stroke-dasharray', `${score}, 100`);
    
    // UI Classes based on risk
    const scoreCard = document.querySelector('.score-card');
    const riskHeading = document.getElementById('risk-level');
    const badge = document.getElementById('scan-status-badge');

    // Reset classes
    scoreCard.className = 'score-card';
    riskHeading.className = '';
    scorePath.className.baseVal = 'circle';

    if (risk === 'Safe') {
      scoreCard.classList.add('risk-safe');
      riskHeading.classList.add('risk-safe');
      scorePath.classList.add('circle-safe');
      badge.textContent = 'SECURE';
      badge.style.background = '#00ff88';
    } else if (risk === 'Suspicious') {
      scoreCard.classList.add('risk-suspicious');
      riskHeading.classList.add('risk-suspicious');
      scorePath.classList.add('circle-suspicious');
      badge.textContent = 'WARNING';
      badge.style.background = '#ffb800';
    } else {
      scoreCard.classList.add('risk-dangerous');
      riskHeading.classList.add('risk-dangerous');
      scorePath.classList.add('circle-dangerous');
      badge.textContent = 'CRITICAL';
      badge.style.background = '#ff0055';
    }
  }
});
