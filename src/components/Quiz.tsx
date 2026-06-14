import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface QuizProps {
  questions: QuizQuestion[];
}

export default function Quiz({ questions }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (key: string) => {
    if (showExplanation) return;
    setSelectedKey(key);
    setShowExplanation(true);
    if (key === currentQuestion.correct_key) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedKey(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedKey(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
        <h3 className="text-3xl font-bold text-white mb-4">Quiz Complete</h3>
        <p className="text-slate-400 mb-8">You mastered {score} out of {questions.length} systemic concepts.</p>
        <div className="text-6xl font-mono text-cyan-500 mb-12">{Math.round((score / questions.length) * 100)}%</div>
        <button
          onClick={resetQuiz}
          className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-5 h-5" /> Retake Diagnostic
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-xs font-mono text-cyan-500 uppercase tracking-widest">Diagnostic Level {currentIndex + 1}</span>
          <h3 className="text-xl font-medium text-white mt-1">{currentQuestion.question_text}</h3>
        </div>
        <span className="text-sm font-mono text-slate-500">{currentIndex + 1} / {questions.length}</span>
      </div>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option) => (
          <button
            key={option.key}
            onClick={() => handleSelect(option.key)}
            disabled={showExplanation}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              showExplanation
                ? option.key === currentQuestion.correct_key
                  ? 'bg-emerald-900/40 border-emerald-500 text-emerald-50'
                  : selectedKey === option.key
                  ? 'bg-rose-900/40 border-rose-500 text-rose-50'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
                : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-mono text-sm">
                {option.key}
              </span>
              <span>{option.value}</span>
            </div>
            {showExplanation && option.key === currentQuestion.correct_key && (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            )}
            {showExplanation && selectedKey === option.key && option.key !== currentQuestion.correct_key && (
              <XCircle className="w-5 h-5 text-rose-500" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 mb-8"
          >
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Systemic Explanation</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{currentQuestion.explanation}</p>
            <button
              onClick={nextQuestion}
              className="mt-6 w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
