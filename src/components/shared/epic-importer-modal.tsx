'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  FileJson,
  Check,
  Sparkles,
  AlertCircle,
  LogIn,
  ExternalLink,
  Loader2,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { useLibraryStore } from '@/store/use-library-store';
import { useAllGames } from '@/hooks/use-all-games';
import { GAMES_DATA } from '@/data/games';
import { PriceDisplay } from './price-display';
import { useScrollLock } from '@/hooks/use-scroll-lock';

interface EpicLibraryExport {
  version?: string;
  generatedAt?: string;
  claimedGameIds?: string[];
  missedGameIds?: string[];
  stats?: {
    claimedCount: number;
    missedCount: number;
    totalCatalogCount: number;
    claimedPercentage: number;
    totalRetailValueUSD: number;
    averageMonthlyClaimRate: number;
  };
  timeline?: {
    gameId: string;
    title: string;
    claimDate: string;
    retailPriceUSD: number;
    rawEpicTitle: string;
  }[];
}

interface EpicImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EpicImporterModal({ isOpen, onClose }: EpicImporterModalProps) {
  useScrollLock(isOpen);
  const [activeTab, setActiveTab] = useState<'login' | 'upload'>('login');
  const [dragOver, setDragOver] = useState(false);
  const [parsedData, setParsedData] = useState<EpicLibraryExport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Epic Internal OAuth Login & Sync state
  const [exchangeCode, setExchangeCode] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    accountId: string;
    totalOwned: number;
    matchedCount: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importClaims, claimedGameIds: currentClaimedIds } = useLibraryStore();
  const { allGames } = useAllGames();

  if (!isOpen) return null;

  const handleOpenEpicLogin = () => {
    // Standard Epic Games Launcher OAuth Exchange Code redirect
    const oauthUrl =
      'https://www.epicgames.com/id/login?redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fid%2Fapi%2Fredirect%3FclientId%3D34a02cf8f4414e29b15921876da36f9a%26responseType%3Dcode';
    window.open(oauthUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSyncWithEpic = async () => {
    if (!exchangeCode.trim()) {
      setErrorMsg('Please enter a valid 32-character Epic Games Exchange Code.');
      return;
    }
    setErrorMsg(null);
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch('/api/epic/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exchangeCode: exchangeCode.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Failed to authenticate and sync library.');
        setIsSyncing(false);
        return;
      }

      // Smart matching returned Epic titles against our catalog games
      const cleanName = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      const ownedCleanSet = new Set<string>();
      const ownedRawSet = new Set<string>();
      for (const it of data.items || []) {
        if (it.title) {
          ownedRawSet.add(it.title.toLowerCase().trim());
          const c = cleanName(it.title);
          if (c) ownedCleanSet.add(c);
        }
        if (it.appName) {
          ownedRawSet.add(it.appName.toLowerCase().trim());
          const c = cleanName(it.appName);
          if (c) ownedCleanSet.add(c);
        }
      }

      const matchedIds: string[] = [];
      for (const game of allGames) {
        const normTitle = game.title.toLowerCase().trim();
        const cleanTitle = cleanName(game.title);
        const cleanSlug = cleanName(game.storeUrl ? game.storeUrl.split('/').pop() || '' : '');

        let isMatch = false;
        if (ownedRawSet.has(normTitle) || ownedCleanSet.has(cleanTitle)) {
          isMatch = true;
        } else {
          for (const ownedClean of Array.from(ownedCleanSet)) {
            if (ownedClean.length >= 4 && cleanTitle.length >= 4) {
              if (ownedClean === cleanTitle || ownedClean.includes(cleanTitle) || cleanTitle.includes(ownedClean)) {
                isMatch = true;
                break;
              }
            }
            if (cleanSlug.length >= 4 && ownedClean.length >= 4) {
              if (ownedClean === cleanSlug || ownedClean.includes(cleanSlug) || cleanSlug.includes(ownedClean)) {
                isMatch = true;
                break;
              }
            }
          }
        }

        if (isMatch) {
          matchedIds.push(game.id);
        }
      }

      if (matchedIds.length > 0) {
        importClaims(matchedIds);
      }

      setSyncResult({
        accountId: data.accountId || 'Authenticated',
        totalOwned: data.totalOwned || 0,
        matchedCount: matchedIds.length,
      });
      setSyncSuccess(true);
      setExchangeCode('');
    } catch {
      setErrorMsg('Network error occurred while syncing with Epic Games Store.');
    } finally {
      setIsSyncing(false);
    }
  };

  const processJsonContent = (rawText: string) => {
    setErrorMsg(null);
    setSyncSuccess(false);
    try {
      const data = JSON.parse(rawText);

      if (Array.isArray(data)) {
        const ids = data.filter((item) => typeof item === 'string');
        const claimedList = GAMES_DATA.filter((g) => ids.includes(g.id));
        const totalVal = claimedList.reduce((sum, g) => sum + (g.originalPrice || 0), 0);

        setParsedData({
          claimedGameIds: ids,
          missedGameIds: GAMES_DATA.filter((g) => !ids.includes(g.id)).map((g) => g.id),
          stats: {
            claimedCount: ids.length,
            missedCount: GAMES_DATA.length - ids.length,
            totalCatalogCount: GAMES_DATA.length,
            claimedPercentage: Number(((ids.length / GAMES_DATA.length) * 100).toFixed(1)),
            totalRetailValueUSD: totalVal,
            averageMonthlyClaimRate: Number((ids.length / 84).toFixed(1)),
          },
          timeline: [],
        });
      } else if (data && typeof data === 'object' && Array.isArray(data.claimedGameIds)) {
        setParsedData(data as EpicLibraryExport);
      } else {
        setErrorMsg('Invalid JSON structure. Please select a valid epic-library-export.json file.');
      }
    } catch {
      setErrorMsg('Failed to parse JSON file. Ensure it is a valid JSON document.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        processJsonContent(ev.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        processJsonContent(ev.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const handleSyncToLibrary = () => {
    if (!parsedData?.claimedGameIds) return;
    importClaims(parsedData.claimedGameIds);
    setSyncSuccess(true);
    setTimeout(() => {
      setSyncSuccess(false);
      onClose();
    }, 1500);
  };

  const claimedGamesList = allGames.filter((g) => currentClaimedIds.includes(g.id));
  const stats = parsedData?.stats;
  const newGamesCount = parsedData?.claimedGameIds?.filter(
    (id) => !currentClaimedIds.includes(id)
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onWheel={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div
        className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden text-[#ededed] flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        data-lenis-prevent
        aria-labelledby="importer-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111111]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 id="importer-modal-title" className="text-base font-semibold text-white">
              Epic Games Account Sync &amp; Library Import
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#0d0d0d] px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('login')}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'login'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-amber-400" />
            Epic Account Login &amp; Sync
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'upload'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Export JSON
          </button>
        </div>

        {/* Modal Body */}
        <div data-modal-scrollable data-lenis-prevent className="p-6 overflow-y-auto overscroll-contain space-y-6 flex-1">
          {/* TAB 1: EPIC INTERNAL OAUTH LOGIN & SYNC */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-[#111] border border-white/10 space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  Epic Games Internal Library API Sync
                </h3>
                <p className="text-xs text-[#888] leading-relaxed">
                  Connect using Epic&apos;s internal Launcher API to fetch your owned titles in JSON and auto-match them against your free games library.
                </p>
              </div>

              {/* Step 1 */}
              <div className="space-y-3 p-4 rounded-lg bg-black border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Step 1: Obtain your Epic Authorization Code
                  </span>
                  <button
                    onClick={handleOpenEpicLogin}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-medium border border-amber-500/30 transition-colors"
                  >
                    <span>Open Epic Login</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-[#888]">
                  Log into your Epic Games account on the official OAuth page. When redirected, you can copy <strong className="text-white">EITHER</strong> the 32-character code <strong className="text-white">OR</strong> paste the entire JSON box you see on screen!
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-3 p-4 rounded-lg bg-black border border-white/10">
                <label className="block text-xs font-semibold text-white">
                  Step 2: Paste Code (or Entire JSON) &amp; Sync
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder='e.g. bf16e573b... OR {"authorizationCode":"bf16e573b..."}'
                    value={exchangeCode}
                    onChange={(e) => setExchangeCode(e.target.value)}
                    className="flex-1 bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500/50"
                  />
                  <button
                    onClick={handleSyncWithEpic}
                    disabled={isSyncing || !exchangeCode.trim()}
                    className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sync Library</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {syncSuccess && syncResult && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 text-sm">
                    <Check className="w-4 h-4" />
                    Successfully Synced with Epic Games!
                  </div>
                  <p className="text-[#888]">
                    Account ID: <code className="text-white font-mono">{syncResult.accountId}</code> — Matched <strong className="text-emerald-400 font-mono">{syncResult.matchedCount}</strong> free giveaway titles out of <strong className="text-white font-mono">{syncResult.totalOwned}</strong> total owned Epic games!
                  </p>
                </div>
              )}

              <div className="p-3.5 rounded-lg bg-white/5 border border-white/8 flex items-center gap-3 text-xs text-[#888]">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Your Exchange Code is exchanged directly with Epic Games Store servers for a temporary read-only token to inspect your library. We do not store credentials.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD EXPORT JSON */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {!parsedData && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                    dragOver
                      ? 'border-white bg-white/5'
                      : 'border-white/10 bg-[#111111] hover:border-white/20 hover:bg-[#141414]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#888]">
                    <FileJson className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Drop your <span className="underline">epic-library-export.json</span> here
                    </p>
                    <p className="text-xs text-[#888] mt-1">
                      Or click to browse your computer
                    </p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {syncSuccess && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Successfully synced to your library!</span>
                </div>
              )}

              {parsedData && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-black border border-white/10">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        Export File Parsed Successfully
                      </h4>
                      <p className="text-xs text-[#888] mt-0.5">
                        Found {parsedData.claimedGameIds?.length || 0} claimed titles
                      </p>
                    </div>
                    <button
                      onClick={() => setParsedData(null)}
                      className="text-xs text-[#888] hover:text-white underline"
                    >
                      Upload different file
                    </button>
                  </div>

                  {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-black border border-white/10">
                        <div className="text-[11px] text-[#888]">Claimed</div>
                        <div className="text-lg font-mono font-semibold text-white mt-0.5">
                          {stats.claimedCount}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-black border border-white/10">
                        <div className="text-[11px] text-[#888]">Missed</div>
                        <div className="text-lg font-mono font-semibold text-[#888] mt-0.5">
                          {stats.missedCount}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-black border border-white/10">
                        <div className="text-[11px] text-[#888]">Claim Rate</div>
                        <div className="text-lg font-mono font-semibold text-emerald-400 mt-0.5">
                          {stats.claimedPercentage}%
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-black border border-white/10">
                        <div className="text-[11px] text-[#888]">Total Retail Value</div>
                        <div className="text-lg font-mono font-semibold text-amber-400 mt-0.5">
                          <PriceDisplay amount={stats.totalRetailValueUSD} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-xs font-medium text-[#888] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSyncToLibrary}
                      className="px-5 py-2 rounded-lg bg-white text-black hover:bg-white/90 text-xs font-medium transition-colors flex items-center gap-2 shadow-lg shadow-white/10"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        Import {newGamesCount || 0} New Games to Library
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
