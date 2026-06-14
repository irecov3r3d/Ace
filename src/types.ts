/**
 * ACE Generative Artifact Engine Types
 */

export interface Flashcard {
  front: string;
  back: string;
  tier_tag: string;
}

export interface QuizOption {
  key: string;
  value: string;
}

export interface QuizQuestion {
  question_text: string;
  options: QuizOption[];
  correct_key: string;
  explanation: string;
}

export interface VisualGraphSpec {
  mermaid_syntax: string;
  layout_style: string;
}

export interface AudioScriptSegment {
  voice_assignment: 'Cinematic Sage' | 'Somatic Guide' | 'Hebrew Resonance' | 'Personal Witness';
  pacing_directive: string;
  script_text: string;
}

export interface CompiledArtifactPayload {
  node_coordinate: string;
  canonical_title: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  visual_map: VisualGraphSpec;
  audio_narration: AudioScriptSegment[];
}

export interface GeneratedArtifactsResponse {
  success: boolean;
  data?: CompiledArtifactPayload;
  error?: string;
}
