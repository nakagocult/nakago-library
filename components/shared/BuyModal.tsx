'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { NAKA_TOKEN_ADDRESS } from '@/lib/utils/constants';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UNISWAP_URL = `https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=${NAKA_TOKEN_ADDRESS}&chain=mainnet`;

export default function BuyModal({ isOpen, onClose }: BuyModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md rounded-3xl overflow-hidden pointer-events-auto"
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,77,0,0.3)',
                boxShadow: '0 0 80px rgba(255,77,0,0.2), 0 40px 80px rgba(0,0,0,0.8)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,77,0,0.15)' }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#FF4D00]/60 flex-shrink-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://i.ibb.co/B8zQgxk/IMG-7857.jpg" alt="Naka Go" className="w-full h-full object-cover" />
                  </motion.div>
                  <div>
                    <div
                      className="text-white font-black text-lg leading-none"
                      style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}
                    >
                      Buy $NAKA
                    </div>
                    <div className="text-white/30 text-xs mt-0.5">Powered by Uniswap</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={UNISWAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-white/40 hover:text-white/70 transition-colors"
                    title="Open in Uniswap"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-white/40 hover:text-white transition-colors hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Uniswap iframe */}
              <div className="relative" style={{ height: 420 }}>
                <iframe
                  src={UNISWAP_URL}
                  width="100%"
                  height="420"
                  style={{ border: 'none', display: 'block' }}
                  title="Buy $NAKA on Uniswap"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
                />
              </div>

              {/* Footer */}
              <div
                className="px-5 py-3 flex items-center gap-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div
                  className="text-[10px] font-mono text-white/25 truncate flex-1"
                >
                  CA: {NAKA_TOKEN_ADDRESS}
                </div>
                <span className="text-[10px] text-[#FF4D00]/60 font-bold">0% Tax</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
