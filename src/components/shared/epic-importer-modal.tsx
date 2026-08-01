'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Terminal,
  FileJson,
  Check,
  Copy,
  Sparkles,
  AlertCircle,
  LogIn,
  Download,
  ExternalLink,
  Loader2,
  Database,
  FileSpreadsheet,
  FileCode,
  Table,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { useLibraryStore } from '@/store/use-library-store';
import { useAllGames } from '@/hooks/use-all-games';
import { GAMES_DATA } from '@/data/games';
import {
  exportToJSON,
  exportToCSV,
  exportToExcel,
  exportToSQLite,
  exportToMarkdown,
} from '@/lib/export-utils';
import { PriceDisplay } from './price-display';

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
  const [activeTab, setActiveTab] = useState<'login' | 'export' | 'upload' | 'guide'>('login');
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [parsedData, setParsedData] = useState<EpicLibraryExport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

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

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npm.cmd run import-epic');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      // Match returned Epic titles against our catalog games
      const ownedTitles = new Set<string>(
        (data.items || []).map((it: any) => (it.title || '').toLowerCase().trim())
      );
      const ownedAppNames = new Set<string>(
        (data.items || []).map((it: any) => (it.appName || '').toLowerCase().trim())
      );

      const matchedIds: string[] = [];
      for (const game of allGames) {
        const normTitle = game.title.toLowerCase().trim();
        const normId = game.id.toLowerCase().trim();
        if (
          ownedTitles.has(normTitle) ||
          ownedAppNames.has(normId) ||
          Array.from(ownedTitles).some(
            (ot) =>
              (ot.length > 3 && normTitle.includes(ot)) ||
              (normTitle.length > 3 && ot.includes(normTitle))
          )
        ) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden text-[#ededed] flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="importer-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111111]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 id="importer-modal-title" className="text-base font-semibold text-white">
              Epic Games Account Sync &amp; Multi-Format Exporter
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
            onClick={() => setActiveTab('export')}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'export'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-green-400" />
            Export Library (JSON/CSV/SQL)
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
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Local CLI Importer
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
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

          {/* TAB 2: MULTI-FORMAT EXPORTER */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-[#111] border border-white/10 space-y-1">
                <h3 className="text-sm font-semibold text-white">
                  Export Your Claimed Free Library ({claimedGamesList.length} Games)
                </h3>
                <p className="text-xs text-[#888]">
                  Export your owned free titles into JSON, CSV, Microsoft Excel, SQLite database scripts, or Markdown tables.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* JSON */}
                <button
                  onClick={() => exportToJSON(claimedGamesList)}
                  disabled={claimedGamesList.length === 0}
                  className="flex items-center justify-between p-4 rounded-xl bg-black border border-white/10 hover:border-white/20 hover:bg-[#111] transition-all text-left group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <FileJson className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors">
                        JSON Export (.json)
                      </div>
                      <div className="text-[11px] text-[#888]">
                        Structured backup with timestamps &amp; value
                      </div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-[#888] group-hover:text-white transition-colors" />
                </button>

                {/* CSV */}
                <button
                  onClick={() => exportToCSV(claimedGamesList)}
                  disabled={claimedGamesList.length === 0}
                  className="flex items-center justify-between p-4 rounded-xl bg-black border border-white/10 hover:border-white/20 hover:bg-[#111] transition-all text-left group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                        CSV Spreadsheet (.csv)
                      </div>
                      <div className="text-[11px] text-[#888]">
                        Standard comma-separated format
                      </div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-[#888] group-hover:text-white transition-colors" />
                </button>

                {/* Excel */}
                <button
                  onClick={() => exportToExcel(claimedGamesList)}
                  disabled={claimedGamesList.length === 0}
                  className="flex items-center justify-between p-4 rounded-xl bg-black border border-white/10 hover:border-white/20 hover:bg-[#111] transition-all text-left group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        Microsoft Excel (.csv + BOM)
                      </div>
                      <div className="text-[11px] text-[#888]">
                        Formatted for clean Excel importing
                      </div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-[#888] group-hover:text-white transition-colors" />
                </button>

                {/* SQLite */}
                <button
                  onClick={() => exportToSQLite(claimedGamesList)}
                  disabled={claimedGamesList.length === 0}
                  className="flex items-center justify-between p-4 rounded-xl bg-black border border-white/10 hover:border-white/20 hover:bg-[#111] transition-all text-left group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors">
                        SQLite SQL Dump (.sql)
                      </div>
                      <div className="text-[11px] text-[#888]">
                        CREATE TABLE &amp; INSERT statements
                      </div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-[#888] group-hover:text-white transition-colors" />
                </button>

                {/* Markdown */}
                <button
                  onClick={() => exportToMarkdown(claimedGamesList)}
                  disabled={claimedGamesList.length === 0}
                  className="flex items-center justify-between p-4 rounded-xl bg-black border border-white/10 hover:border-white/20 hover:bg-[#111] transition-all text-left group sm:col-span-2 disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white">
                      <Table className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors">
                        GitHub Markdown Table (.md)
                      </div>
                      <div className="text-[11px] text-[#888]">
                        Formatted table for GitHub READMEs, Notion, or blogs
                      </div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-[#888] group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: UPLOAD EXPORT JSON */}
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

          {/* TAB 4: LOCAL CLI IMPORTER COMMAND */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#111111] border border-white/10 space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#888]" />
                  Playwright Auto-Importer (100% Local)
                </h3>
                <p className="text-xs text-[#888] leading-relaxed">
                  We built a standalone Playwright automation script that runs on your local machine. It automatically opens your Epic Games transactions history, infinitely clicks &quot;Show More&quot;, matches your claimed giveaways against our catalog, and generates <code className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">epic-library-export.json</code>.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-[#888] uppercase tracking-wider">
                  Terminal Command (Windows / macOS / Linux)
                </label>
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-black border border-white/10 font-mono text-xs text-white">
                  <span>npm.cmd run import-epic</span>
                  <button
                    onClick={handleCopyCommand}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-[#ededed] text-xs font-sans transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
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
                <p className="text-[11px] text-[#888]">
                  💡 <strong className="text-white">Windows PowerShell note:</strong> Make sure you are inside your project folder and use <code className="text-white font-mono">npm.cmd</code> to avoid PowerShell Execution Policy restrictions.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Privacy Guaranteed
                </div>
                <p className="text-[#888]">
                  Your credentials and Chromium profile never leave your computer. Once the script finishes, switch back to the <strong className="text-white">Upload Export JSON</strong> tab and drop your file!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
