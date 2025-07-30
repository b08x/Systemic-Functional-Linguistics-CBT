export interface SflAnalysis {
  ideational: {
    processType: string;
    participants: { role: string; entity: string }[];
    circumstances: { type: string; details: string }[];
    summary: string;
  };
  interpersonal: {
    mood: string;
    modality: string;
    persona: string;
    summary: string;
  };
  textual: {
    theme: string;
    rheme: string;
    cohesion: { type: string; example: string }[];
    summary: string;
  };
  softwareEngineeringImplications: {
    requirementsClarity: string;
    potentialAmbiguities: string;
    suggestedRefinement: string;
  };
}

export type ChatRole = 'user' | 'model' | 'system-intro';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}
