import { AudioScriptSegment } from '../types';
import { Mic2, Wind, BookOpen, User } from 'lucide-react';

interface AudioNarrationProps {
  segments: AudioScriptSegment[];
}

const VOICE_ICONS: Record<string, any> = {
  'Cinematic Sage': BookOpen,
  'Somatic Guide': Wind,
  'Hebrew Resonance': Mic2,
  'Personal Witness': User,
};

const VOICE_COLORS: Record<string, string> = {
  'Cinematic Sage': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  'Somatic Guide': 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  'Hebrew Resonance': 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  'Personal Witness': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
};

export default function AudioNarration({ segments }: AudioNarrationProps) {
  return (
    <div className="space-y-6 py-8">
      {segments.map((segment, idx) => {
        const Icon = VOICE_ICONS[segment.voice_assignment] || BookOpen;
        const colorClass = VOICE_COLORS[segment.voice_assignment] || 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        
        return (
          <div key={idx} className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${colorClass} transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
              </div>
              {idx < segments.length - 1 && (
                <div className="w-px h-full bg-slate-700 my-2" />
              )}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-mono uppercase tracking-widest ${colorClass.split(' ')[0]}`}>
                  {segment.voice_assignment}
                </span>
                <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {segment.pacing_directive}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-serif italic text-lg shadow-text">
                "{segment.script_text}"
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
