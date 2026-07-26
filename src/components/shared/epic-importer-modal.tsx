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
  Trophy,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useLibraryStore } from '@/store/use-library-store';
import { GAMES_DATA } from '@/data/games';
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
  const [activeTab, setActiveTab] = useState<'upload' | 'guide'>('upload');
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [parsedData, setParsedData] = useState<EpicLibraryExport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importClaims, claimedGameIds: currentClaimedIds } = useLibraryStore();

  if (!isOpen) return null;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npm run import-epic');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const processJsonContent = (rawText: string) => {
    setErrorMsg(null);
    setSyncSuccess(false);
    try {
      const data = JSON.parse(rawText);

      // Support either full EpicLibraryExport object OR simple string[] array of IDs
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

  const stats = parsedData?.stats;
  const newGamesCount = parsedData?.claimedGameIds?.filter(
    (id) => !currentClaimedIds.includes(id)
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden text-[#ededed] flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="importer-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111111]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 id="importer-modal-title" className="text-base font-semibold text-white">
              Epic Games Store Library Importer
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
        <div className="flex border-b border-white/10 bg-[#0d0d0d] px-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-white text-white'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Export JSON
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'border-white text-white'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Auto-Importer Command
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'guide' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#111111] border border-white/10 space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#888]" />
                  Playwright Auto-Importer (100% Local)
                </h3>
                <p className="text-xs text-[#888] leading-relaxed">
                  We built a standalone Playwright automation script that runs on your local machine. It automatically opens your Epic Games transactions history, infinitely clicks &quot;Show More&quot;, matches your claimed giveaways against our 418-game catalog, and generates <code className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">epic-library-export.json</code>.
                </p>
              </div>

              {/* Command box */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#888] uppercase tracking-wider">
                  Terminal Command
                </label>
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-black border border-white/10 font-mono text-xs text-white">
                  <span>npm run import-epic</span>
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
          ) : (
            <div className="space-y-6">
              {/* Dropzone */}
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

              {/* Error state */}
              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success state */}
              {syncSuccess && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Successfully synced to your library!</span>
                </div>
              )}

              {/* Preview Stats */}
              {parsedData && stats && !syncSuccess && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                      Import Preview
                    </h3>
                    <button
                      onClick={() => setParsedData(null)}
                      className="text-xs text-[#888] hover:text-white underline transition-colors"
                    >
                      Choose different file
                    </button>
                  </div>

                  {/* 4-Stat Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-lg bg-[#111111] border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#888]">
                        <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Claimed</span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {stats.claimedCount} <span className="text-xs font-normal text-[#888]">/ {stats.totalCatalogCount}</span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-medium">
                        {stats.claimedPercentage}% of catalog
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#111111] border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#888]">
                        <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                        <span>Retail Value</span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        <PriceDisplay amount={stats.totalRetailValueUSD} className="text-white font-bold" />
                      </div>
                      <div className="text-[11px] text-[#888]">
                        Free value claimed
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#111111] border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#888]">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                        <span>Claim Rate</span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {stats.averageMonthlyClaimRate} <span className="text-xs font-normal text-[#888]">/mo</span>
                      </div>
                      <div className="text-[11px] text-[#888]">
                        Average speed
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#111111] border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#888]">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>New to Library</span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        +{newGamesCount || 0}
                      </div>
                      <div className="text-[11px] text-[#888]">
                        {newGamesCount === 0 ? 'All already saved' : 'New titles found'}
                      </div>
                    </div>
                  </div>

                  {/* Sample Timeline Preview */}
                  {parsedData.timeline && parsedData.timeline.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-[#888]">
                        Recent Claimed Giveaways
                      </div>
                      <div className="p-3 rounded-lg bg-[#111111] border border-white/10 space-y-2 max-h-36 overflow-y-auto">
                        {parsedData.timeline.slice(0, 5).map((t) => (
                          <div
                            key={t.gameId}
                            className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none"
                          >
                            <span className="text-white font-medium truncate max-w-[240px]">
                              {t.title}
                            </span>
                            <span className="text-[#888] text-[11px] font-mono">
                              {t.claimDate ? new Date(t.claimDate).toLocaleDateString() : 'Claimed'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-[#888] hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSyncToLibrary}
                      className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-[#ededed] active:scale-[0.98] transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Sync to My Library ({stats.claimedCount} Games)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#0d0d0d] border-t border-white/10 flex items-center justify-between text-[11px] text-[#888]">
          <span>Compatible with freeepicgamesdotgg archive</span>
          <span>100% Client-Side &amp; Private</span>
        </div>
      </div>
    </div>
  );
}
