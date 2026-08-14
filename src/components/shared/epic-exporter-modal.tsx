'use client';

import React, { useEffect } from 'react';
import {
  Download,
  X,
  FileJson,
  FileSpreadsheet,
  Database,
  FileText,
  Table,
  CheckCircle2,
  FolderDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLibraryStore } from '@/store/use-library-store';
import { useAllGames } from '@/hooks/use-all-games';
import {
  exportToJSON,
  exportToCSV,
  exportToExcel,
  exportToSQLite,
  exportToMarkdown,
} from '@/lib/export-utils';
import { useScrollLock } from '@/hooks/use-scroll-lock';

interface EpicExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EpicExporterModal({ isOpen, onClose }: EpicExporterModalProps) {
  useScrollLock(isOpen);
  const { claimedGameIds } = useLibraryStore();
  const { allGames } = useAllGames();

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const claimedGamesList = allGames.filter((g) => claimedGameIds.includes(g.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-200"
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
        role="dialog"
        aria-modal="true"
        data-lenis-prevent
        className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141414]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Download className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Export Game Library
              </h2>
              <p className="text-xs text-[#888]">
                Download your claimed collection in your preferred format
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div data-modal-scrollable data-lenis-prevent className="p-6 space-y-6 overflow-y-auto overscroll-contain">
          {/* Summary Box */}
          <div className="p-4 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#888] font-medium">Ready for Export</p>
              <p className="text-xl font-bold text-white mt-0.5">
                {claimedGamesList.length} <span className="text-xs font-normal text-[#888]">games claimed</span>
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Metadata Included</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#aaa] uppercase tracking-wider">
              Choose Export Format
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* JSON Button */}
              <button
                onClick={() => exportToJSON(claimedGamesList)}
                className="flex items-start space-x-3 p-3.5 rounded-lg bg-[#141414] border border-white/10 hover:border-white/20 hover:bg-[#1a1a1a] transition-all text-left group"
              >
                <div className="p-2 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                  <FileJson className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors">
                    JSON Archive
                  </div>
                  <div className="text-xs text-[#888] mt-0.5 leading-relaxed">
                    Complete backup with prices & dates (.json)
                  </div>
                </div>
              </button>

              {/* CSV Button */}
              <button
                onClick={() => exportToCSV(claimedGamesList)}
                className="flex items-start space-x-3 p-3.5 rounded-lg bg-[#141414] border border-white/10 hover:border-white/20 hover:bg-[#1a1a1a] transition-all text-left group"
              >
                <div className="p-2 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                  <Table className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                    CSV Spreadsheet
                  </div>
                  <div className="text-xs text-[#888] mt-0.5 leading-relaxed">
                    Universal table format (.csv)
                  </div>
                </div>
              </button>

              {/* Excel Button */}
              <button
                onClick={() => exportToExcel(claimedGamesList)}
                className="flex items-start space-x-3 p-3.5 rounded-lg bg-[#141414] border border-white/10 hover:border-white/20 hover:bg-[#1a1a1a] transition-all text-left group"
              >
                <div className="p-2 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-green-300 transition-colors">
                    Excel Workbook
                  </div>
                  <div className="text-xs text-[#888] mt-0.5 leading-relaxed">
                    Formatted sheets (.xlsx)
                  </div>
                </div>
              </button>

              {/* SQLite Button */}
              <button
                onClick={() => exportToSQLite(claimedGamesList)}
                className="flex items-start space-x-3 p-3.5 rounded-lg bg-[#141414] border border-white/10 hover:border-white/20 hover:bg-[#1a1a1a] transition-all text-left group"
              >
                <div className="p-2 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                  <Database className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                    SQLite Database
                  </div>
                  <div className="text-xs text-[#888] mt-0.5 leading-relaxed">
                    SQL table dump (.sql)
                  </div>
                </div>
              </button>

              {/* Markdown Button */}
              <button
                onClick={() => exportToMarkdown(claimedGamesList)}
                className="flex items-start space-x-3 p-3.5 rounded-lg bg-[#141414] border border-white/10 hover:border-white/20 hover:bg-[#1a1a1a] transition-all text-left group sm:col-span-2"
              >
                <div className="p-2 rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/20 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-pink-300 transition-colors">
                    Markdown Table
                  </div>
                  <div className="text-xs text-[#888] mt-0.5 leading-relaxed">
                    GitHub-compatible Markdown table (.md)
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#141414] flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 text-white border-white/10 text-xs px-4"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
