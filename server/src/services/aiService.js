const axios = require('axios');

/**
 * Service to interact with the TRAE AI Intelligence layer
 */
const analyzeWithAI = async (urlData) => {
  const { url, indicators, ssl, score, risk } = urlData;

  const apiKey = process.env.TRAE_API_KEY;
  const apiUrl = process.env.TRAE_API_URL;

  console.log(`[AI DIAGNOSTIC] Target Endpoint: ${apiUrl}`);
  console.log(`[AI DIAGNOSTIC] API Key Present: ${apiKey && apiKey !== 'your_key_here' ? 'YES' : 'NO'}`);

  if (!apiKey || apiKey === 'your_key_here' || !apiUrl) {
    console.warn('⚠️ TRAE_API credentials missing or using placeholder in .env. AI Enrichment disabled.');
    return null;
  }

  const prompt = `
    You are a Cybersecurity Expert. Analyze this website threat:
    - URL: ${url}
    - Score: ${score}/100 (Where 0 is safe, 100 is critical)
    - Risk: ${risk}
    - SSL: ${ssl ? 'Secure' : 'Unsecured/Missing'}
    - Red Flags: ${indicators.join(', ')}

    Return a valid JSON object with EXACTLY these 3 fields:
    1. reasoning: Why this URL is dangerous or safe.
    2. explanation: A simple educational sentence for a non-tech user.
    3. recommendation: One specific step to stay safe.

    Output ONLY the JSON object.
  `;

  try {
    console.log(`[AI DIAGNOSTIC] Sending Request to: ${apiUrl}`);
    console.log(`[AI DIAGNOSTIC] Auth Header Format: Bearer ${apiKey.substring(0, 4)}***`);

    const response = await axios.post(apiUrl, {
      model: "MiniMax-M2.7", 
      messages: [
        { role: "system", content: "Cybersecurity Analyst Mode Active. You analyze URLs and provide JSON responses." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 300
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });

    console.log(`✅ TRAE API Success | Status: ${response.status}`);
    
    const content = response.data.choices[0].message.content;
    console.log('[AI RESPONSE]', content);

    return typeof content === 'string' ? JSON.parse(content) : content;

  } catch (error) {
    console.error(`❌ TRAE API Failure | Status: ${error.response?.status || 'TIMEOUT/NETWORK'}`);
    if (error.response?.status === 401) {
      console.error('[AUTH ERROR] 401 Unauthorized. Please verify your TRAE_API_KEY in .env.');
    } else if (error.response?.status === 404) {
      console.error('[PATH ERROR] 404 Not Found. Check if TRAE_API_URL is correct.');
    } else {
      console.error(`[AI ERROR] ${error.message}`);
    }
    return null; 
  }
};

const analyzeScamMessage = async (message) => {
  const apiKey = process.env.TRAE_API_KEY;
  const apiUrl = process.env.TRAE_API_URL;

  if (!apiKey || apiKey === 'your_key_here' || !apiUrl) {
    console.warn('⚠️ TRAE_API credentials missing. AI Scam Analysis disabled.');
    return null;
  }

  const prompt = `
    You are a Scam Detection Expert. Analyze this message for potential fraud:
    - Message: "${message}"

    Identify these characteristics and return a valid JSON object:
    1. riskScore: 0-100 (0 safe, 100 high risk)
    2. urgencyLevel: String (High, Medium, Low)
    3. manipulationDetected: Boolean
    4. impersonationDetected: Boolean
    5. phishingLanguage: Boolean
    6. emotionalPressure: Boolean
    7. reasoning: Short explanation of the indicators found.
    8. simpleExplanation: One simple sentence for a non-expert user.
    9. recommendations: Array of 3 specific safety steps.

    Output ONLY the JSON object.
  `;

  try {
    const response = await axios.post(apiUrl, {
      model: "MiniMax-M2.7",
      messages: [
        { role: "system", content: "Scam Detection Mode Active. Return JSON only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 400
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    const content = response.data.choices[0].message.content;
    return typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    console.error(`❌ Scam AI Analysis failed: ${error.message}`);
    return null;
  }
};

const analyzeEmailPhishing = async (emailData) => {
  const { sender, subject, body } = emailData;
  const apiKey = process.env.TRAE_API_KEY;
  const apiUrl = process.env.TRAE_API_URL;

  if (!apiKey || apiKey === 'your_key_here' || !apiUrl) {
    console.warn('⚠️ TRAE_API credentials missing. AI Email Analysis disabled.');
    return null;
  }

  const prompt = `
    You are an Email Security Expert. Analyze this email for phishing/fraud:
    - Sender: "${sender}"
    - Subject: "${subject}"
    - Body: "${body}"

    Analyze for: phishing intent, impersonation, urgency tactics, suspicious links, credential harvesting, and scam patterns.
    Return a valid JSON object:
    1. threatScore: 0-100
    2. phishingProbability: 0-100
    3. indicators: Array of specific red flags found.
    4. impersonationDetected: Boolean
    5. urgencyTactics: Boolean
    6. harvestingLanguage: Boolean
    7. explanation: Professional AI reasoning.
    8. recommendations: Array of 4 safety steps.

    Output ONLY the JSON object.
  `;

  try {
    const response = await axios.post(apiUrl, {
      model: "MiniMax-M2.7",
      messages: [
        { role: "system", content: "Email Phishing Security Mode Active. Return JSON only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 12000
    });

    const content = response.data.choices[0].message.content;
    return typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    console.error(`❌ Email AI Analysis failed: ${error.message}`);
    return null;
  }
};

module.exports = {
  analyzeWithAI,
  analyzeScamMessage,
  analyzeEmailPhishing
};
