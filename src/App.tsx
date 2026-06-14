import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Layers, 
  Map as MapIcon, 
  BrainCircuit, 
  Mic2, 
  Library,
  ChevronRight,
  Loader2,
  Terminal as TerminalIcon,
  ShieldCheck
} from 'lucide-react';
import { CompiledArtifactPayload, GeneratedArtifactsResponse } from './types';
import Flashcards from './components/Flashcards';
import Quiz from './components/Quiz';
import MermaidChart from './components/MermaidChart';
import AudioNarration from './components/AudioNarration';

const CORE_NODES = [
  { id: 'T2-03', title: 'Ten Sefirot (Structural Matching Matrix)' },
  { id: 'T4-01', title: 'Lurianic Cosmology (Tzimtzum, Shevirat HaKelim, Tikkun)' },
  { id: 'T6-03', title: 'Mussar (The 13 Middot Soul Accounting Properties)' },
];

type Tab = 'flashcards' | 'quiz' | 'visual_map' | 'audio_narration';

export default function App() {
  const [selectedNode, setSelectedNode] = useState(CORE_NODES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [artifacts, setArtifacts] = useState<CompiledArtifactPayload | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('flashcards');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setTerminalLogs((prev) => [...prev.slice(-4), `> ${msg}`]);
  };

  const generateArtifacts = async () => {
    setIsGenerating(true);
    setArtifacts(null);
    setTerminalLogs([]);
    addLog(`INIT_ENGINE_${selectedNode.id.replace('-', '_')}`);
    addLog(`LAUNCHING ACE PRODUCTION RUN...`);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId: selectedNode.id, nodeTitle: selectedNode.title }),
      });

      const result: GeneratedArtifactsResponse = await response.json();

      if (result.success && result.data) {
        addLog(`VALIDATING SCHEMA_ENFORCED_PAYLOAD...`);
        addLog(`SUCCESS: ARTIFACT PACKAGE VERIFIED.`);
        setArtifacts(result.data);
      } else {
        addLog(`ERROR: ENGINE_FAILURE - ${result.error}`);
      }
    } catch (error: any) {
      addLog(`FATAL: NETWORK_DRIFT - ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 text-cyan-500 mb-2">
              <Zap className="w-5 h-5 fill-current" />
              <span className="font-mono text-sm tracking-[0.3em] uppercase">Autonomous Curriculum Engine</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
              ACE Artifact Engine
            </h1>
            <p className="text-slate-400 max-w-xl text-lg">
              Compiling structured, multi-layer spiritual learning assets from the 8-tier spiritual-systems ontology with zero data drift.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 w-full md:w-80 font-mono text-xs overflow-hidden h-32 flex flex-col justify-end shadow-2xl">
            <div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-slate-800 pb-1">
              <TerminalIcon className="w-3 h-3" />
              <span>TERMINAL_STATUS</span>
            </div>
            <div className="space-y-1">
              {terminalLogs.length === 0 && <span className="text-slate-700 italic">SYSTEM_READY...</span>}
              {terminalLogs.map((log, i) => (
                <div key={i} className={log.includes('ERROR') || log.includes('FATAL') ? 'text-rose-500' : 'text-cyan-500/80'}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Node Selection Stage */}
        {!artifacts && !isGenerating && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {CORE_NODES.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`group relative p-8 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  selectedNode.id === node.id 
                    ? 'bg-slate-900 border-cyan-500/50 shadow-[0_0_40px_-15px_rgba(6,182,212,0.3)]' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`mb-6 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selectedNode.id === node.id ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                }`}>
                  <Library className="w-6 h-6" />
                </div>
                <div className="mb-2 font-mono text-xs text-cyan-500/70 tracking-widest uppercase">{node.id}</div>
                <h3 className="text-xl font-medium text-white group-hover:text-cyan-50 md:min-h-[3rem]">{node.title}</h3>
                <div className="mt-8 flex items-center justify-between text-xs font-mono">
                  <span className={selectedNode.id === node.id ? 'text-cyan-500' : 'text-slate-500'}>
                    {selectedNode.id === node.id ? 'SELECTED_TARGET' : 'READY_FOR_DEPLOY'}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedNode.id === node.id ? 'translate-x-1' : ''}`} />
                </div>
              </button>
            ))}
          </motion.section>
        )}

        {/* Generate Button Area */}
        {!artifacts && (
          <div className="mt-12 flex flex-col items-center">
            <button
              onClick={generateArtifacts}
              disabled={isGenerating}
              className="group relative px-12 py-5 bg-white text-slate-950 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] overflow-hidden"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform" />
              <div className="flex items-center gap-3">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    COMPILING_ARTIFACTS...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6" />
                    EXECUTE_GENERATION_SEQUENCES
                  </>
                )}
              </div>
            </button>
            <p className="mt-4 text-slate-500 font-mono text-xs uppercase tracking-widest animate-pulse">
              {isGenerating ? 'Enforcing schema-rigidity...' : 'Awaiting deployment authorization...'}
            </p>
          </div>
        )}

        {/* Generated Artifacts Dashboard */}
        <AnimatePresence>
          {artifacts && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Active Artifact Package</div>
                    <h2 className="text-3xl font-bold text-white">{artifacts.canonical_title}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setArtifacts(null)}
                  className="px-6 py-2 rounded-full border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-sm font-medium"
                >
                  Return to Nodes
                </button>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl max-w-fit overflow-x-auto">
                <TabButton 
                  active={activeTab === 'flashcards'} 
                  onClick={() => setActiveTab('flashcards')}
                  icon={<Layers className="w-4 h-4" />}
                  label="Flashcards"
                />
                <TabButton 
                  active={activeTab === 'quiz'} 
                  onClick={() => setActiveTab('quiz')}
                  icon={<BrainCircuit className="w-4 h-4" />}
                  label="Curriculum Quiz"
                />
                <TabButton 
                  active={activeTab === 'visual_map'} 
                  onClick={() => setActiveTab('visual_map')}
                  icon={<MapIcon className="w-4 h-4" />}
                  label="Visual Component"
                />
                <TabButton 
                  active={activeTab === 'audio_narration'} 
                  onClick={() => setActiveTab('audio_narration')}
                  icon={<Mic2 className="w-4 h-4" />}
                  label="Audio Narration"
                />
              </div>

              {/* Main Content Area */}
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'flashcards' && <Flashcards flashcards={artifacts.flashcards} />}
                    {activeTab === 'quiz' && <Quiz questions={artifacts.quiz} />}
                    {activeTab === 'visual_map' && (
                      <div className="max-w-4xl mx-auto">
                        <div className="mb-6 flex justify-between items-center font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                          <span>Rendering: MERMAID_JS</span>
                          <span>Layout: {artifacts.visual_map.layout_style}</span>
                        </div>
                        <MermaidChart chart={artifacts.visual_map.mermaid_syntax} />
                      </div>
                    )}
                    {activeTab === 'audio_narration' && <AudioNarration segments={artifacts.audio_narration} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="relative mt-auto py-12 border-t border-slate-900 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">
          <div>© 2026 ACE Generative Engine // V3.5-FLASH</div>
          <div className="flex gap-8">
            <span className="hover:text-cyan-500 transition-colors cursor-help">Schema: Artifact_v1.2</span>
            <span className="hover:text-cyan-500 transition-colors cursor-help">Latency: Optimised</span>
            <span className="hover:text-cyan-500 transition-colors cursor-help">Drift: Zero</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg flex items-center gap-3 transition-all font-medium whitespace-nowrap ${
        active 
          ? 'bg-slate-800 text-white shadow-lg border border-slate-700' 
          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
