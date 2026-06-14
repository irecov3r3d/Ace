import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Flashcard as FlashcardType } from '../types';

interface FlashcardsProps {
  flashcards: FlashcardType[];
}

export default function Flashcards({ flashcards }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const card = flashcards[currentIndex];

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="w-full max-w-md h-64 perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full h-full relative"
          >
            <motion.div
              className="w-full h-full relative cursor-pointer preserve-3d"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
                <span className="text-xs font-mono text-cyan-500 mb-4 tracking-widest uppercase">{card.tier_tag}</span>
                <p className="text-xl font-medium text-slate-100">{card.front}</p>
                <div className="mt-8 text-slate-500 text-xs flex items-center gap-2">
                  <RotateCcw className="w-3 h-3" /> Click to flip
                </div>
              </div>

              {/* Back */}
              <div 
                className="absolute inset-0 backface-hidden bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl"
                style={{ transform: 'rotateY(180deg)' }}
              >
                <p className="text-lg text-cyan-50 leading-relaxed">{card.back}</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={prevCard}
          className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-mono text-sm text-slate-500">
          {currentIndex + 1} / {flashcards.length}
        </span>
        <button
          onClick={nextCard}
          className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
