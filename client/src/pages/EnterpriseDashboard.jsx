import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Globe, 
  Activity, 
  Clock, 
  ArrowUpRight, 
  Search, 
  Database, 
  AlertCircle, 
  Eye, 
  RefreshCw, 
  Brain, 
  ShieldAlert,
  Server,
  ArrowRight,
  User,
  Users,
  Building,
  ShieldCheck,
  Percent,
  Cpu
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import Navbar from '../components/layout/Navbar';

const EnterpriseDashboard = () => {
  const [timeframe, setTimeframe] = useState('7d'); // '24h' | '7d' | '30d'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Safe' | 'Suspicious' | 'Dangerous'
  const [data, setData] = useState({
    attackStatistics: {
      totalScans: 0,
      threatsDetected: 0,
      suspiciousDomains: 0,
      safeWebsites: 0,
      impersonationAttempts: 0,
      riskLevel: 'SAFE',
      riskScore: 0,
      threatPercentage: 0,
      detectionSuccessRate: 100
    },
    scanHistory: [],
    phishingTrends: [],
    blockedDomains: [],
    employeeRiskAnalytics: {
      userActivity: []
    },
    topImpersonatedBrands: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch telemetry data from backend API
  const fetchTelemetry = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/telemetry/dashboard?timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('[TELEMETRY FETCH ERROR]', err);
      setError('Connection to security telemetry API endpoint offline.');
    } finally {
      setLoading(false);
      if (showRefreshIndicator) setIsRefreshing(false);
    }
  };

  // Fetch immediately when timeframe changes
  useEffect(() => {
    fetchTelemetry();
  }, [timeframe]);

  // Live polling every 5 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 5000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const triggerRefresh = () => {
    fetchTelemetry(true);
  };

  // Filter scan history logs
  const filteredScans = data.scanHistory.filter(scan => {
    const matchesSearch = scan.url.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (scan.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (scan.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (scan.user || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || scan.risk === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = data.attackStatistics;

  if (loading && !data.scanHistory.length) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">Synchronising Live Telemetry Database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 selection:bg-blue-500/30 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        {/* Dynamic Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-slate-900 pb-8 mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded">
                Enterprise SOC Portal
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></div> Live Connection
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
              SafeSurf AI <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Threat Analytics</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">Real-time enterprise intelligence computed dynamically from live browser scans.</p>
          </div>

          {/* Timeframe selector and Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
              <button 
                onClick={() => setTimeframe('24h')}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black tracking-wider uppercase transition-all ${timeframe === '24h' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                24 Hours
              </button>
              <button 
                onClick={() => setTimeframe('7d')}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black tracking-wider uppercase transition-all ${timeframe === '7d' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                7 Days
              </button>
              <button 
                onClick={() => setTimeframe('30d')}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black tracking-wider uppercase transition-all ${timeframe === '30d' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                30 Days
              </button>
            </div>

            <button 
              onClick={triggerRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. ATTACK STATISTICS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
          
          {/* Card: Total Scans */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/60 transition-all duration-300 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Total Audits</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {stats.totalScans.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Telemetry active</span>
            </div>
          </motion.div>

          {/* Card: Dangerous threats detected */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/60 transition-all duration-300 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Threats Blocked</span>
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {stats.threatsDetected.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-rose-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats.threatPercentage}% threat ratio</span>
            </div>
          </motion.div>

          {/* Card: Suspicious detections */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/60 transition-all duration-300 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Suspicious Flagged</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {stats.suspiciousDomains.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 font-mono">
              <span>Attention required</span>
            </div>
          </motion.div>

          {/* Card: Safe scans */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/60 transition-all duration-300 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Safe Domains</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {stats.safeWebsites.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <span>Verified standards</span>
            </div>
          </motion.div>

          {/* Card: Threat Percentage */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/60 transition-all duration-300 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Success Rate</span>
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {stats.detectionSuccessRate}%
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-violet-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>Engine v1.8 active</span>
            </div>
          </motion.div>

          {/* Card: Active Risk Level */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/60 transition-all duration-300 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Active Risk Level</span>
              <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                stats.riskLevel === 'CRITICAL' ? 'bg-rose-500' :
                stats.riskLevel === 'HIGH' ? 'bg-orange-500' :
                stats.riskLevel === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></div>
              <span className={`text-lg font-black tracking-tight ${
                stats.riskLevel === 'CRITICAL' ? 'text-rose-400' :
                stats.riskLevel === 'HIGH' ? 'text-orange-400' :
                stats.riskLevel === 'MODERATE' ? 'text-amber-400' : 'text-emerald-400'
              }`}>{stats.riskLevel}</span>
            </div>
            
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
              <div 
                className={`h-full transition-all duration-1000 ${
                  stats.riskScore > 75 ? 'bg-rose-500' :
                  stats.riskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${stats.riskScore}%` }}
              ></div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-1.5 flex justify-between">
              <span>SCORE: {stats.riskScore}/100</span>
              <span>INDEX v1.2</span>
            </div>
          </motion.div>

        </div>

        {/* 3. PHISHING TRENDS SECTION & THREAT DISTRIBUTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Chart Block: Phishing Trends Area Chart */}
          <div className="lg:col-span-2 bg-slate-900/30 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Phishing Trends Timeline</h3>
                <p className="text-slate-400 text-xs mt-0.5">Real-time comparison between cumulative scan volume and dangerous threats detected by the engine.</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono font-semibold">
                <span className="flex items-center gap-1.5 text-blue-400 bg-blue-500/5 border border-blue-500/10 px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Total Scans
                </span>
                <span className="flex items-center gap-1.5 text-rose-400 bg-rose-500/5 border border-rose-500/10 px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div> Threat Detections
                </span>
              </div>
            </div>

            <div className="h-[280px] w-full">
              {data.phishingTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.phishingTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                      dx={-5}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#090d16', 
                        borderColor: '#1e293b', 
                        color: '#f8fafc',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontFamily: 'monospace'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="scans" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorScans)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="threats" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorThreats)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
                  No trend data available for selected timeframe.
                </div>
              )}
            </div>
          </div>

          {/* Donut Chart: Threat Distribution Panel (Safe, Suspicious, Dangerous Ratios) */}
          <div className="bg-slate-900/30 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Threat Distribution</h3>
              <p className="text-slate-400 text-xs mt-0.5">Classification index of audited browser telemetry.</p>
            </div>

            <div className="h-[180px] flex items-center justify-center relative my-4">
              {stats.totalScans > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Dangerous', value: Math.round((stats.threatsDetected - stats.suspiciousDomains) / stats.totalScans * 100) || 0, color: '#ef4444' },
                        { name: 'Suspicious', value: Math.round(stats.suspiciousDomains / stats.totalScans * 100) || 0, color: '#f59e0b' },
                        { name: 'Safe', value: Math.round(stats.safeWebsites / stats.totalScans * 100) || 0, color: '#10b981' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      <Cell fill="#ef4444" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${value}%`}
                      contentStyle={{ 
                        backgroundColor: '#090d16', 
                        borderColor: '#1e293b', 
                        color: '#f8fafc',
                        borderRadius: '12px',
                        fontSize: '11px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-500 font-mono text-xs">No distribution data</div>
              )}

              {/* Inner Circle Info */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Global Risk</span>
                <span className="text-xl font-black text-slate-100">{stats.riskLevel}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-900">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <span className="text-slate-300">Dangerous</span>
                </div>
                <span className="font-bold text-white">{Math.round((stats.threatsDetected - stats.suspiciousDomains) / (stats.totalScans || 1) * 100)}%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-900">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-slate-300">Suspicious</span>
                </div>
                <span className="font-bold text-white">{Math.round(stats.suspiciousDomains / (stats.totalScans || 1) * 100)}%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-900">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-300">Safe Logs</span>
                </div>
                <span className="font-bold text-white">{Math.round(stats.safeWebsites / (stats.totalScans || 1) * 100)}%</span>
              </div>
            </div>
          </div>

        </div>

        {/* 6 & 10. TOP IMPERSONATED BRANDS & BLOCKED DOMAINS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Top Impersonated Brands (Typosquatting progress indicators) */}
          <div className="bg-slate-900/30 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Top Impersonated Brands</h3>
              <p className="text-slate-400 text-xs mt-0.5">Distribution of phishing detections targeting major brands.</p>
            </div>

            <div className="space-y-4 my-5">
              {data.topImpersonatedBrands.length > 0 ? (
                data.topImpersonatedBrands.map((brand, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.color }}></div>
                        <span className="text-slate-200">{brand.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-mono">({brand.value} detected)</span>
                        <span className="text-white font-bold">{brand.percentage}%</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-900 border border-slate-800/50 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${brand.percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: brand.color }}
                      ></motion.div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-500 font-mono text-xs">
                  No impersonated brands detected yet.
                </div>
              )}
            </div>
          </div>

          {/* 4. BLOCKED DOMAINS SECTION */}
          <div className="bg-slate-900/30 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Blocked Domains</h3>
              <p className="text-slate-400 text-xs mt-0.5">High-risk domains actively blocked by heuristics or threat filters.</p>
            </div>

            <div className="space-y-3.5 my-5">
              {data.blockedDomains.length > 0 ? (
                data.blockedDomains.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-900 hover:border-slate-800/80 transition-colors"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-slate-200 truncate block max-w-[200px]" title={item.domain}>{item.domain}</span>
                        {item.brand !== 'Unknown' && (
                          <span className="text-[9px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded uppercase">
                            Targets {item.brand}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 truncate">{item.reason}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-400">SCORE</span>
                      <span className="text-sm font-black font-mono text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded">
                        {item.score}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-500 font-mono text-xs">
                  No domains blocked in the selected timeframe.
                </div>
              )}
            </div>

            <a 
              href="#recent-activity" 
              className="flex items-center justify-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-400 hover:underline transition-all pt-2 cursor-pointer self-start"
            >
              View complete scan logs <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* 5. EMPLOYEE RISK ANALYTICS SECTION */}
        <div className="bg-slate-900/30 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-sm mb-8">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Employee Risk Analytics</h3>
            <p className="text-slate-400 text-xs mt-0.5">Enterprise security metrics tracing users and departments based on scan frequency and risky endpoints.</p>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 text-[10px] font-mono font-bold uppercase tracking-widest pb-4">
                  <th className="pb-3 pl-3">Employee User</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Total Scans</th>
                  <th className="pb-3">Dangerous Visits</th>
                  <th className="pb-3">Suspicious Visits</th>
                  <th className="pb-3">Risk Factor</th>
                  <th className="pb-3 pr-3 text-right">Last Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-xs font-semibold text-slate-300">
                {data.employeeRiskAnalytics.userActivity.length > 0 ? (
                  data.employeeRiskAnalytics.userActivity.map((userStats, idx) => (
                    <tr key={idx} className="group hover:bg-slate-900/20 transition-colors">
                      <td className="py-4 pl-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded bg-slate-800 text-slate-400">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-white font-mono">{userStats.user}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>{userStats.department}</span>
                        </div>
                      </td>
                      <td className="py-4 font-mono text-slate-300">{userStats.totalScans}</td>
                      <td className="py-4 font-mono text-rose-400">{userStats.dangerousScans}</td>
                      <td className="py-4 font-mono text-amber-400">{userStats.suspiciousScans}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                            userStats.status === 'High Risk' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            userStats.status === 'Medium Risk' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {userStats.status}
                          </span>
                          <span className="text-slate-500 font-mono text-[10px]">({userStats.riskScore}/100)</span>
                        </div>
                      </td>
                      <td className="py-4 pr-3 text-right text-[11px] font-mono text-slate-500">
                        {new Date(userStats.lastScan).toLocaleString(undefined, { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                      No employee telemetry recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. SCAN HISTORY SECTION (Searchable & Filterable Table) */}
        <div id="recent-activity" className="bg-slate-900/30 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-sm">
          
          {/* Table Header Filter controls */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-slate-900 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Recent Threat Intelligence Logs</h3>
              <p className="text-slate-400 text-xs mt-0.5">Comprehensive audit logs computed directly from backend scans.</p>
            </div>

            {/* Controls: Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              
              {/* Search input */}
              <div className="relative group min-w-[280px]">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search URL, user email, or brand..."
                  className="w-full bg-slate-900/60 border border-slate-800 p-2.5 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs font-semibold text-white placeholder-slate-500"
                />
              </div>

              {/* Status filtering */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all ${statusFilter === 'all' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('Safe')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all ${statusFilter === 'Safe' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Safe
                </button>
                <button
                  onClick={() => setStatusFilter('Suspicious')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all ${statusFilter === 'Suspicious' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Suspicious
                </button>
                <button
                  onClick={() => setStatusFilter('Dangerous')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all ${statusFilter === 'Dangerous' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Dangerous
                </button>
              </div>

            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 text-[10px] font-mono font-bold uppercase tracking-widest pb-4">
                  <th className="pb-3 pl-3">Payload ID</th>
                  <th className="pb-3">Scanned Target</th>
                  <th className="pb-3">User Client</th>
                  <th className="pb-3">Target Brand</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Verdict</th>
                  <th className="pb-3 pr-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-xs font-semibold text-slate-300">
                <AnimatePresence mode="popLayout">
                  {filteredScans.length > 0 ? (
                    filteredScans.map((scan) => (
                      <motion.tr 
                        key={scan.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-slate-900/20 transition-colors"
                      >
                        <td className="py-4 pl-3 font-mono text-[11px] text-slate-400">{scan.id}</td>
                        <td className="py-4 max-w-sm truncate pr-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-white hover:text-blue-400 transition-colors font-mono tracking-tight break-all truncate block" title={scan.url}>
                              {scan.url}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium leading-relaxed group-hover:text-slate-400 transition-colors">
                              Reason: {scan.reason}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 font-mono text-slate-400 text-[11px]">{scan.user}</td>
                        <td className="py-4">
                          <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-slate-200">
                            {scan.brand}
                          </span>
                        </td>
                        <td className="py-4 text-slate-400 font-mono text-[11px]">{scan.category}</td>
                        <td className="py-4">
                          <span className={`font-mono font-bold ${
                            scan.score > 70 ? 'text-rose-400' :
                            scan.score > 30 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {scan.score}/100
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded border ${
                            scan.risk === 'Dangerous' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            scan.risk === 'Suspicious' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {scan.risk}
                          </span>
                        </td>
                        <td className="py-4 pr-3 text-right text-[11px] font-mono text-slate-500">
                          {new Date(scan.timestamp).toLocaleString(undefined, { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500 font-mono">
                        No threat logs match the specified search and filter criteria.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Table Stats Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-900 pt-5 mt-4 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest gap-4">
            <div>
              SHOWING {filteredScans.length} OF {data.scanHistory.length} RECORDS
            </div>
            <div>
              HEURISTICS ENGINE DATABASE: v1.82a-2026
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EnterpriseDashboard;
