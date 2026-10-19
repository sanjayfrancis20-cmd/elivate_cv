import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Tablet,
  Laptop,
  Wifi,
  Copy,
  Check,
  ExternalLink,
  Globe,
  QrCode,
  ShieldCheck,
  Info
} from 'lucide-react';

export default function DeviceConnectModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [networkUrl, setNetworkUrl] = useState('');
  const [activeTab, setActiveTab] = useState('wifi'); // 'wifi' | 'public'

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? '192.168.29.64' // Local Network IP detected
        : window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : ':5173';
      const protocol = window.location.protocol || 'http:';
      setNetworkUrl(`${protocol}//${hostname}${port}`);
    }
  }, []);

  const handleCopy = () => {
    if (networkUrl) {
      navigator.clipboard?.writeText(networkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Safe QR Code URL generated via high-availability QR image service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(networkUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in select-none">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">Open On All Other Devices</h2>
              <p className="text-[11px] text-slate-300">Phones, Tablets, iPads & Laptops</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 flex gap-2 bg-slate-50/70">
          <button
            onClick={() => setActiveTab('wifi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'wifi'
                ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Same Wi-Fi Network</span>
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'public'
                ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Anywhere in the World</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs sm:text-sm">
          {activeTab === 'wifi' ? (
            <>
              {/* QR Code and Quick Connect */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 border border-slate-200/90 rounded-2xl">
                <div className="shrink-0 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs text-center">
                  <img
                    src={qrCodeUrl}
                    alt="Scan QR Code to open on other devices"
                    className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg object-contain"
                  />
                  <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                    Scan with Phone Camera
                  </span>
                </div>

                <div className="flex-1 space-y-2.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-700 font-semibold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Host Listening on All Interfaces</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Point your iPhone or Android camera at the QR code to instantly launch ElevateCV on your mobile device.
                  </p>

                  {/* Network URL input with copy */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Local Network Address
                    </span>
                    <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-1.5">
                      <input
                        type="text"
                        readOnly
                        value={networkUrl}
                        className="w-full text-xs font-mono font-medium text-slate-800 bg-transparent px-1 focus:outline-none select-all"
                      />
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition shrink-0"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supported Devices Badges */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center text-center">
                  <Smartphone className="w-5 h-5 text-indigo-600 mb-1" />
                  <span className="font-bold text-slate-800 text-xs">Smartphones</span>
                  <span className="text-[10px] text-slate-500">iOS & Android</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center text-center">
                  <Tablet className="w-5 h-5 text-indigo-600 mb-1" />
                  <span className="font-bold text-slate-800 text-xs">Tablets</span>
                  <span className="text-[10px] text-slate-500">iPads & Galaxy Tab</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center text-center">
                  <Laptop className="w-5 h-5 text-indigo-600 mb-1" />
                  <span className="font-bold text-slate-800 text-xs">Laptops</span>
                  <span className="text-[10px] text-slate-500">Mac, PC & Linux</span>
                </div>
              </div>

              {/* How it works instructions */}
              <div className="space-y-2 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-950">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>3 Simple Steps to Connect:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1 leading-relaxed">
                  <li>Ensure your phone or other device is connected to the same Wi-Fi router.</li>
                  <li>Scan the QR code above or type <span className="font-mono font-semibold text-slate-900 bg-white px-1 py-0.5 rounded border border-indigo-200">{networkUrl}</span> in your mobile browser.</li>
                  <li>Your resume, AI enhancements, and PDF export work in real-time across all screens!</li>
                </ol>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>Access on Mobile Data / Remote Networks</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If you want friends, clients, or yourself to open this website from cellular mobile data (4G/5G) or outside your home Wi-Fi, you can expose it using a free instant public tunnel:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-1.5">
                  <span className="font-bold text-xs text-slate-800 block">
                    Option 1: Free Localtunnel (Zero Install)
                  </span>
                  <p className="text-[11px] text-slate-500">Run this in your terminal to get an instant public URL:</p>
                  <pre className="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-xs font-mono overflow-x-auto">
                    npx localtunnel --port 5173
                  </pre>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-1.5">
                  <span className="font-bold text-xs text-slate-800 block">
                    Option 2: Cloudflare Tunnel / Ngrok
                  </span>
                  <p className="text-[11px] text-slate-500">Secure high-speed HTTPS tunnel:</p>
                  <pre className="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-xs font-mono overflow-x-auto">
                    npx ngrok http 5173
                  </pre>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-800">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>When running locally on Wi-Fi, no tunnel is needed—just use the QR code in the first tab!</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span>Port 5173 / 5000 Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
