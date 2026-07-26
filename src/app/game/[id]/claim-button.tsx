'use client';

import { useLibraryStore } from '@/store/use-library-store';
import { Gamepad2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ClaimButton({ gameId, game }: { gameId: string; game?: any }) {
  const { isGameClaimed, toggleClaim } = useLibraryStore();
  const isClaimed = isGameClaimed(gameId, game);

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
          onClick={() => toggleClaim(gameId, game)}
          className={`w-full py-3 rounded-md flex items-center justify-center font-medium text-sm transition-colors ${
            isClaimed
              ? "bg-white/5 text-[#ededed] border border-white/15 hover:bg-white/10"
              : "bg-white text-black hover:bg-[#ebebeb]"
          }`}
        >
          {isClaimed ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
              In Library
            </>
          ) : (
            <>
              <Gamepad2 className="w-4 h-4 mr-2" />
              Mark as Claimed
            </>
          )}
        </motion.button>
      </AnimatePresence>
      <p className="text-[#666] text-xs text-center mt-3">
        Epic Games account sync is currently unavailable. Use this button to track your library manually.
      </p>
    </div>
  );
}
