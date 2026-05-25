const axios = require('axios');

/**
 * Shodan Intelligence Service
 */
class ShodanService {
    constructor() {
        this.apiKey = process.env.SHODAN_API_KEY;
        this.baseUrl = 'https://api.shodan.io';
    }

    /**
     * Get host information for an IP address
     * @param {string} ip 
     */
    async getHostInfo(ip) {
        if (!this.apiKey || this.apiKey === '') {
            console.warn('[SHODAN] API Key missing. Skipping infrastructure check.');
            return null;
        }

        try {
            console.log(`[SHODAN] Querying intelligence for IP: ${ip}`);
            const response = await axios.get(`${this.baseUrl}/shodan/host/${ip}?key=${this.apiKey}`, {
                timeout: 5000
            });

            const data = response.data;
            return {
                ip: data.ip_str,
                org: data.org || 'Unknown Provider',
                country: data.country_name || 'Unknown Location',
                ports: data.ports || [],
                os: data.os || 'Unknown OS',
                lastUpdate: data.last_update,
                tags: data.tags || [],
                vulns: data.vulns || [],
                hostnames: data.hostnames || []
            };

        } catch (error) {
            if (error.response?.status === 404) {
                console.warn(`[SHODAN] No intelligence found for IP: ${ip}`);
                return { ip, status: 'Not Found' };
            }
            console.error(`[SHODAN ERROR] ${error.message}`);
            return null;
        }
    }

    /**
     * Analyze risk indicators from Shodan data
     */
    analyzeInfrastructureRisk(shodanData) {
        if (!shodanData || shodanData.status === 'Not Found') return { score: 10, indicators: [] };

        const indicators = [];
        let riskScore = 0;

        // 1. Ports Analysis (Known risky ports)
        const riskyPorts = [21, 23, 139, 445, 3389];
        const openRiskyPorts = shodanData.ports.filter(p => riskyPorts.includes(p));
        if (openRiskyPorts.length > 0) {
            riskScore += 25;
            indicators.push(`Exposed Risky Ports: ${openRiskyPorts.join(', ')}`);
        }

        // 2. High Risk Region Check (Broad heuristic)
        const highRiskRegions = ['Russia', 'China', 'North Korea', 'Iran'];
        if (highRiskRegions.includes(shodanData.country)) {
            riskScore += 15;
            indicators.push(`Hosted in High-Risk Jurisdiction: ${shodanData.country}`);
        }

        // 3. Provider Reputation
        const lowRepProviders = ['DigitalOcean', 'Linode', 'OVH']; // Often used for short-lived phishing
        if (lowRepProviders.some(p => shodanData.org.includes(p))) {
            riskScore += 10;
            indicators.push(`Hosted on High-Churn Infrastructure (${shodanData.org})`);
        }

        // 4. Vulnerability Presence
        if (shodanData.vulns && shodanData.vulns.length > 0) {
            riskScore += 30;
            indicators.push('Unpatched Server Vulnerabilities Detected');
        }

        return {
            score: Math.min(riskScore, 100),
            indicators
        };
    }
}

module.exports = new ShodanService();
