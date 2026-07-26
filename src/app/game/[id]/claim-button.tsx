'use client';

import { useLibraryStore } from '@/store/use-library-store';
import { Gamepad2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ClaimButton({ gameId }: { gameId: string }) {
  const { claimedGameIds, toggleClaim } = useLibraryStore();
  const isClaimed = claimedGameIds.includes(gameId);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.button
          key={isClaimed ? 'claimed' : 'unclaimed'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toggleClaim(gameId)}
          className={`w-full py-4 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg transition-colors ${
            isClaimed
              ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
              : "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/25"
          }`}
        >
          {isClaimed ? (
            <>
              <CheckCircle2 className="w-6 h-6 mr-2 text-green-400" />
              In Library
            </>
          ) : (
            <>
              <Gamepad2 className="w-6 h-6 mr-2" />
              Mark as Claimed
            </>
          )}
        </motion.button>
      </AnimatePresence>
      <p className="text-gray-500 text-xs text-center mt-3">
        Epic Games account sync is currently unavailable. Use this button to track your library manually.
      </p>
    </div>
  );
}
