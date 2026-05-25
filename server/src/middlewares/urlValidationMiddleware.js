const dns = require('dns').promises;
const net = require('net');

/**
 * Checks if an IP address lies in loopback, link-local, or private subnets (SSRF prevention).
 */
const isPrivateIp = (ip) => {
  if (!net.isIP(ip)) return false;

  // IPv4 Loopback
  if (ip.startsWith('127.')) return true;

  // Private IPv4 ranges (RFC 1918)
  // Class A: 10.0.0.0/8
  if (ip.startsWith('10.')) return true;

  // Class B: 172.16.0.0/12 (172.16.x.x to 172.31.x.x)
  if (ip.startsWith('172.')) {
    const parts = ip.split('.');
    const secondOctet = parseInt(parts[1], 10);
    if (secondOctet >= 16 && secondOctet <= 31) return true;
  }

  // Class C: 192.168.0.0/16
  if (ip.startsWith('192.168.')) return true;

  // Link-local: 169.254.0.0/16
  if (ip.startsWith('169.254.')) return true;

  // IPv6 loopback / unique local / link-local addresses
  if (ip === '::1' || ip === '0:0:0:0:0:0:0:1') return true;
  if (ip.startsWith('fe80:') || ip.startsWith('fe80::')) return true;
  if (ip.startsWith('fc00:') || ip.startsWith('fd00:') || ip.startsWith('fc00::') || ip.startsWith('fd00::')) return true;

  return false;
};

/**
 * Express Middleware for strict Website URL validation & DNS active verification
 */
const validateWebsiteUrl = async (req, res, next) => {
  let { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      valid: false,
      errorCode: 'INVALID_URL',
      status: 'INVALID_WEBSITE',
      message: 'URL is required.'
    });
  }

  // Normalize: Trim spaces
  url = url.trim();

  // Reject immediately if there are spaces in the middle of the input
  if (/\s/.test(url)) {
    return res.status(400).json({
      success: false,
      valid: false,
      errorCode: 'INVALID_URL',
      status: 'INVALID_WEBSITE',
      message: 'Input is not a valid website.'
    });
  }

  // Prepend https:// if protocol is missing
  let normalizedUrl = url;
  if (!/^https?:\/\//i.test(url)) {
    normalizedUrl = `https://${url}`;
  }

  // Parse URL
  let parsedUrl;
  try {
    parsedUrl = new URL(normalizedUrl);
  } catch (err) {
    return res.status(400).json({
      success: false,
      valid: false,
      errorCode: 'INVALID_URL',
      status: 'INVALID_WEBSITE',
      message: 'Input is not a valid website.'
    });
  }

  // Reject unsupported protocols (e.g. ftp, file, gopher, javascript)
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return res.status(400).json({
      success: false,
      valid: false,
      errorCode: 'INVALID_URL',
      status: 'INVALID_WEBSITE',
      message: 'Input is not a valid website.'
    });
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Domain structure & TLD format regex (rejects simple text/random words/missing structure)
  // Hostname must have at least one dot separating subdomains/domains and a valid TLD
  const domainRegex = /^[a-z0-9-]{1,63}(\.[a-z0-9-]{1,63})*\.[a-z]{2,63}$/;
  if (!domainRegex.test(hostname)) {
    return res.status(400).json({
      success: false,
      valid: false,
      errorCode: 'INVALID_URL',
      status: 'INVALID_WEBSITE',
      message: 'Input is not a valid website.'
    });
  }

  // Reject local hostnames
  if (hostname === 'localhost' || hostname === 'localhost.localdomain') {
    return res.status(400).json({
      success: false,
      valid: false,
      errorCode: 'INVALID_URL',
      status: 'INVALID_WEBSITE',
      message: 'Input is not a valid website.'
    });
  }

  // Reject if hostname is directly a private IP address
  if (isPrivateIp(hostname)) {
    return res.status(400).json({
      success: false,
      valid: false,
      errorCode: 'INVALID_URL',
      status: 'INVALID_WEBSITE',
      message: 'Input is not a valid website.'
    });
  }

  // Active Domain Check: DNS verification
  try {
    const address = await dns.lookup(hostname);
    const resolvedIp = address.address;

    // Reject if resolved hostname points to internal/private IPs (SSRF prevention)
    if (isPrivateIp(resolvedIp)) {
      return res.status(400).json({
        success: false,
        valid: false,
        errorCode: 'INVALID_URL',
        status: 'INVALID_WEBSITE',
        message: 'Input is not a valid website.'
      });
    }

    // Supply the normalized url to subsequent controller actions
    req.body.url = normalizedUrl;
    next();
  } catch (dnsErr) {
    console.warn(`[VALIDATION FAILED] DNS Lookup failed for: ${hostname} - ${dnsErr.message}`);
    return res.status(400).json({
      success: false,
      valid: false,
      errorCode: 'DOMAIN_INACTIVE',
      status: 'DOMAIN_NOT_ACTIVE',
      message: 'Website does not appear to be active.'
    });
  }
};

module.exports = {
  validateWebsiteUrl,
  isPrivateIp
};
