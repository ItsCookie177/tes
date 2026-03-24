import { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Users, 
  Wifi, 
  Copy, 
  Check, 
  Info, 
  Shield, 
  MapPin, 
  Hammer, 
  ExternalLink,
  ChevronRight,
  Terminal,
  RefreshCw,
  MoreVertical,
  Globe,
  MessageSquare,
  Bug,
  Phone,
  LayoutDashboard,
  BookOpen,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SERVER_IP = 'play.brutalsmp.my.id';
const SERVER_PORT = 19133;

const CLAIM_COMMANDS = [
  { cmd: '/trust [player]', desc: 'Give a player permission to build in your claim.' },
  { cmd: '/untrust [player]', desc: 'Revoke a player\'s permission.' },
  { cmd: '/abandonclaim', desc: 'Delete the claim you are currently standing in.' },
  { cmd: '/claimslist', desc: 'View a list of all your current land claims.' },
  { cmd: '/trustlist', desc: 'See who is trusted in your current claim.' },
  { cmd: '/subdivideclaims', desc: 'Switch to subdivision mode to create sub-claims.' },
];

interface ServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  version?: string;
  motd?: {
    clean: string[];
  };
  debug?: {
    ping?: number;
  };
}

export default function App() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showOverflow, setShowOverflow] = useState(false);
  const [activeView, setActiveView] = useState<'status' | 'tutorial' | 'social'>('status');

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.mcsrvstat.us/3/premium-host.zenithzz.my.id:19133`);
      if (!response.ok) throw new Error('Failed to fetch server status');
      const data = await response.json();
      setStatus(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Unable to connect to status API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${SERVER_IP}:${SERVER_PORT}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tutorialSteps = [
    {
      title: "Get Claim Tool",
      description: "Obtain a golden shovel from the starter kit or craft one to begin your claim.",
      icon: <Hammer className="w-6 h-6 text-amber-400" />
    },
    {
      title: "Select First Corner",
      description: "Right-click on the ground with the golden shovel to set the first corner of your land.",
      icon: <MapPin className="w-6 h-6 text-blue-400" />
    },
    {
      title: "Select Second Corner",
      description: "Move to the opposite corner and right-click again to define the area.",
      icon: <ChevronRight className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Confirm Claim",
      description: "Wait for the confirmation message. Your land will be highlighted with blocks.",
      icon: <Check className="w-6 h-6 text-emerald-400" />
    },
    {
      title: "Land Protected",
      description: "Your area is now safe from griefing! Use /trust to add your friends.",
      icon: <Shield className="w-6 h-6 text-red-400" />
    }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background Content Wrapper - Blurs when menu is open */}
      <motion.div 
        animate={{ 
          filter: showOverflow ? 'blur(4px)' : 'blur(0px)',
          scale: showOverflow ? 0.98 : 1,
          opacity: showOverflow ? 0.7 : 1
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex flex-col items-center w-full"
      >
        {/* Sticky Header Wrapper */}
        <div className="sticky top-0 z-50 w-full bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 md:py-6">
            <motion.header 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Activity className="w-6 h-6 md:w-10 md:h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                    BrutalSMP
                  </h1>
                  <p className="text-[10px] md:text-sm text-zinc-500 font-medium">Official Server Dashboard</p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <button 
                  onClick={copyToClipboard}
                  className="glass-button px-2.5 py-1.5 md:px-4 md:py-2 flex items-center gap-2 text-[10px] md:text-sm font-medium group"
                >
                  {copied ? <Check className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
                  <span className="hidden sm:inline">{SERVER_IP}</span>
                  <span className="sm:hidden">Copy IP</span>
                  <span className="text-zinc-500 group-hover:text-zinc-300 hidden sm:inline">:{SERVER_PORT}</span>
                </button>
                
                <button 
                  onClick={fetchStatus}
                  disabled={loading}
                  className="glass-button p-1.5 md:p-2.5"
                  title="Refresh Status"
                >
                  <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button 
                  onClick={() => setShowOverflow(true)}
                  className="glass-button p-1.5 md:p-2.5"
                  title="More Options"
                >
                  <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </motion.header>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col gap-8">
        <AnimatePresence mode="wait">
        {activeView === 'status' ? (
          <motion.div 
            key="status"
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
          >
            {/* Main Status Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: false }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
              className="md:col-span-2 glass-card p-8 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Decorative background glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-500" />
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${status?.online ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-red-500'} ${status?.online ? 'animate-pulse-glow' : ''}`} />
                    <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                      {loading ? 'Checking...' : status?.online ? 'Server Online' : 'Server Offline'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                      Crossplay
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold mb-2">
                    {status?.motd?.clean?.[0] || 'Welcome to BrutalSMP'}
                  </h2>
                  <p className="text-zinc-400">
                    {status?.motd?.clean?.[1] || 'Survival Multiplayer Experience'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                    <Users className="w-4 h-4" />
                    Players
                  </div>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : status?.players ? `${status.players.online} / ${status.players.max}` : '0 / 0'}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                    <Wifi className="w-4 h-4" />
                    Latency
                  </div>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : status?.debug?.ping ? `${status.debug.ping}ms` : '---'}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                    <Info className="w-4 h-4" />
                    Software
                  </div>
                  <div className="text-xl font-bold flex flex-col">
                    <span className="text-blue-400 text-sm">Java 1.20 - Latest</span>
                    <span className="text-purple-400 text-sm">Bedrock 1.21.111 - Latest</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Info Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: false }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
              className="glass-card p-8 flex flex-col gap-6"
            >
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-400" />
                Quick Access
              </h3>
              
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Server IP</p>
                  <p className="font-mono text-blue-400">{SERVER_IP}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Port</p>
                  <p className="font-mono text-purple-400">{SERVER_PORT}</p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 text-xs text-zinc-500 flex justify-between">
                <span>Last updated</span>
                <span>{lastUpdated.toLocaleTimeString()}</span>
              </div>
            </motion.div>
          </motion.div>
        ) : activeView === 'tutorial' ? (
          <motion.section 
            key="tutorial"
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
            className="w-full"
          >
            <div className="flex flex-col gap-8">
              <div className="text-left">
                <h2 className="text-3xl font-bold mb-2">Land Claim Tutorial</h2>
                <p className="text-zinc-500">Protect your builds from griefers with our easy land claim system.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {tutorialSteps.map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(4px)' }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
                    className="glass-card p-6 flex flex-col gap-4 relative group hover:bg-white/[0.08] transition-all duration-300"
                  >
                    <div className="absolute top-4 right-4 text-zinc-800 font-black text-4xl select-none group-hover:text-zinc-700 transition-colors">
                      0{index + 1}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center relative z-10">
                      {step.icon}
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Commands Reference Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: false }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
                className="glass-card p-8 mt-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Terminal className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Claim Commands</h3>
                    <p className="text-sm text-zinc-500">Essential commands for managing your land.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CLAIM_COMMANDS.map((command, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                      <code className="text-blue-400 font-mono block mb-1 group-hover:text-blue-300 transition-colors">
                        {command.cmd}
                      </code>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {command.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.section>
        ) : (
          <motion.div 
            key="social"
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="glass-card p-8 flex flex-col gap-8">
              <div className="text-left">
                <h2 className="text-3xl font-bold mb-2 text-white">Join Our Community</h2>
                <p className="text-zinc-500">Stay connected with other players and get the latest updates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <a 
                  href="https://chat.whatsapp.com/BxCBNvA8Dza5cc2rk31POO?mode=gi_t" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-card p-6 flex flex-col items-center gap-4 hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-xl mb-1">WhatsApp Group</h4>
                    <p className="text-sm text-zinc-400">Chat with players and staff in real-time.</p>
                  </div>
                  <div className="mt-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-bold">Join Group</div>
                </a>

                <a 
                  href="https://discord.gg/JBUWQe7n" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-card p-6 flex flex-col items-center gap-4 hover:bg-blue-500/5 hover:border-blue-500/20 transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-xl mb-1">Discord Server</h4>
                    <p className="text-sm text-zinc-400">Join voice channels and participate in events.</p>
                  </div>
                  <div className="mt-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-bold">Join Discord</div>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>

      {/* Footer */}
      <footer className="w-full mt-auto py-8 text-center text-zinc-600 text-sm border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} BrutalSMP. Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.</p>
      </footer>
      </motion.div>

      {/* Global Overflow Menu - Outside the blurred container */}
      <AnimatePresence>
        {showOverflow && (
          <>
            {/* Backdrop to close menu with heavy blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md" 
              onClick={() => setShowOverflow(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="fixed top-20 right-4 md:right-8 w-64 glass-card p-2 z-[110] shadow-2xl border border-white/10 backdrop-blur-[60px] bg-black/90"
            >
              <div className="flex flex-col gap-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Navigation</div>
                <button 
                  onClick={() => {
                    setActiveView('status');
                    setShowOverflow(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${activeView === 'status' ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-white/5'}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Server Status
                </button>
                <button 
                  onClick={() => {
                    setActiveView('tutorial');
                    setShowOverflow(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${activeView === 'tutorial' ? 'bg-purple-500/10 text-purple-400' : 'hover:bg-white/5'}`}
                >
                  <BookOpen className="w-4 h-4" />
                  Land Claim Tutorial
                </button>
                <button 
                  onClick={() => {
                    setActiveView('social');
                    setShowOverflow(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${activeView === 'social' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-white/5'}`}
                >
                  <Share2 className="w-4 h-4" />
                  Social Media
                </button>

                <div className="h-px bg-white/5 my-1 mx-2" />
                <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Social Media</div>
                <a 
                  href="https://chat.whatsapp.com/BxCBNvA8Dza5cc2rk31POO?mode=gi_t" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  WhatsApp Group
                </a>
                <a 
                  href="https://discord.gg/JBUWQe7n" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  Discord Server
                </a>

                <div className="h-px bg-white/5 my-1 mx-2" />
                <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Other</div>
                <a 
                  href="https://brutalsmp.my.id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  <Globe className="w-4 h-4 text-zinc-400" />
                  Official Website
                </a>
                <button 
                  onClick={() => {
                    alert("Bug reporting feature coming soon!");
                    setShowOverflow(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium w-full text-left"
                >
                  <Bug className="w-4 h-4 text-red-400" />
                  Report a Bug
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
