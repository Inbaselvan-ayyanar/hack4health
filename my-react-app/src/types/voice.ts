export interface VoiceConfig {
  id: string;
  name: string;
  language: string;
  languageCode: string;
  gender: 'male' | 'female';
  description: string;
  sample?: string;
}

export interface VoiceSettings {
  selectedVoice: string;
  language: string;
  speed: number;
  pitch: number;
  volume: number;
  autoDetectLanguage: boolean;
  useElevenLabs: boolean;
  elevenLabsApiKey?: string;
}

export interface SpeechRequest {
  text: string;
  language?: string;
  voiceId?: string;
  priority?: 'low' | 'normal' | 'high';
  cache?: boolean;
}

export const SUPPORTED_VOICES: VoiceConfig[] = [
  // English Voices
  { id: 'sarah-en', name: 'Sarah', language: 'English', languageCode: 'en-US', gender: 'female', description: 'Warm, professional medical voice', sample: 'EXAVITQu4vr4xnSDxMaL' },
  { id: 'roger-en', name: 'Roger', language: 'English', languageCode: 'en-US', gender: 'male', description: 'Clear, authoritative medical voice', sample: 'CwhRBWXzGAHq8TQ4Fs17' },
  
  // Hindi Voices
  { id: 'priya-hi', name: 'Priya', language: 'Hindi', languageCode: 'hi-IN', gender: 'female', description: 'Professional Hindi medical voice' },
  { id: 'arjun-hi', name: 'Arjun', language: 'Hindi', languageCode: 'hi-IN', gender: 'male', description: 'Clear Hindi medical voice' },
  
  // Spanish Voices
  { id: 'maria-es', name: 'María', language: 'Spanish', languageCode: 'es-ES', gender: 'female', description: 'Professional Spanish medical voice' },
  { id: 'carlos-es', name: 'Carlos', language: 'Spanish', languageCode: 'es-ES', gender: 'male', description: 'Clear Spanish medical voice' },
  
  // French Voices
  { id: 'claire-fr', name: 'Claire', language: 'French', languageCode: 'fr-FR', gender: 'female', description: 'Professional French medical voice' },
  { id: 'pierre-fr', name: 'Pierre', language: 'French', languageCode: 'fr-FR', gender: 'male', description: 'Clear French medical voice' },
  
  // German Voices
  { id: 'greta-de', name: 'Greta', language: 'German', languageCode: 'de-DE', gender: 'female', description: 'Professional German medical voice' },
  { id: 'hans-de', name: 'Hans', language: 'German', languageCode: 'de-DE', gender: 'male', description: 'Clear German medical voice' },
  
  // Portuguese Voices
  { id: 'ana-pt', name: 'Ana', language: 'Portuguese', languageCode: 'pt-BR', gender: 'female', description: 'Professional Portuguese medical voice' },
  { id: 'joao-pt', name: 'João', language: 'Portuguese', languageCode: 'pt-BR', gender: 'male', description: 'Clear Portuguese medical voice' },
  
  // Italian Voices
  { id: 'giulia-it', name: 'Giulia', language: 'Italian', languageCode: 'it-IT', gender: 'female', description: 'Professional Italian medical voice' },
  { id: 'marco-it', name: 'Marco', language: 'Italian', languageCode: 'it-IT', gender: 'male', description: 'Clear Italian medical voice' },
  
  // Japanese Voices
  { id: 'yuki-ja', name: 'Yuki', language: 'Japanese', languageCode: 'ja-JP', gender: 'female', description: 'Professional Japanese medical voice' },
  { id: 'takeshi-ja', name: 'Takeshi', language: 'Japanese', languageCode: 'ja-JP', gender: 'male', description: 'Clear Japanese medical voice' },
  
  // Chinese Voices
  { id: 'mei-zh', name: 'Mei', language: 'Chinese', languageCode: 'zh-CN', gender: 'female', description: 'Professional Chinese medical voice' },
  { id: 'wei-zh', name: 'Wei', language: 'Chinese', languageCode: 'zh-CN', gender: 'male', description: 'Clear Chinese medical voice' },
  
  // Arabic Voices
  { id: 'fatima-ar', name: 'Fatima', language: 'Arabic', languageCode: 'ar-SA', gender: 'female', description: 'Professional Arabic medical voice' },
  { id: 'omar-ar', name: 'Omar', language: 'Arabic', languageCode: 'ar-SA', gender: 'male', description: 'Clear Arabic medical voice' },
];

export const LANGUAGE_DETECTION_PATTERNS = {
  'hi-IN': /[\u0900-\u097F]/,
  'ar-SA': /[\u0600-\u06FF]/,
  'zh-CN': /[\u4e00-\u9fff]/,
  'ja-JP': /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/,
  'es-ES': /¿|¡|ñ|Ñ|á|é|í|ó|ú|Á|É|Í|Ó|Ú/,
  'fr-FR': /à|â|ä|ç|è|é|ê|ë|î|ï|ô|ö|ù|û|ü|ÿ|À|Â|Ä|Ç|È|É|Ê|Ë|Î|Ï|Ô|Ö|Ù|Û|Ü|Ÿ/,
  'de-DE': /ä|ö|ü|ß|Ä|Ö|Ü/,
  'pt-BR': /ã|õ|ç|á|à|â|ê|é|í|ó|ô|ú|Ã|Õ|Ç|Á|À|Â|Ê|É|Í|Ó|Ô|Ú/,
  'it-IT': /à|è|ì|ò|ù|À|È|Ì|Ò|Ù/,
};
