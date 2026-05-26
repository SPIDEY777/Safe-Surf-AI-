// SafeSurf AI Background Service Worker
const API_BASE = 'https://safe-surf-ai.onrender.com/api';

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only trigger when the page has finished loading
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    console.log(`[SafeSurf] Monitoring: ${tab.url}`);
    
    try {
      const response = await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: tab.url })
      });

      if (response.ok) {
        const data = await response.json();
        
        // If the site is dangerous or suspicious, notify the content script
        if (data.risk === 'Dangerous' || data.risk === 'Suspicious') {
          chrome.tabs.sendMessage(tabId, {
            type: 'SHOW_THREAT_BANNER',
            data: data
          });
          
          // Set badge text
          chrome.action.setBadgeText({ text: '!', tabId: tabId });
          chrome.action.setBadgeBackgroundColor({ color: data.risk === 'Dangerous' ? '#ff0055' : '#ffb800', tabId: tabId });
        } else {
          chrome.action.setBadgeText({ text: '', tabId: tabId });
        }
      }
    } catch (err) {
      console.warn('[SafeSurf] Background scan skipped (server offline?)');
    }
  }
});
