import {
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";
// разделено, чтобы реакт быстрее обновлялся. Такие требования

export type TVoiceContext = [
  SpeechSynthesisVoice | null,
  Dispatch<SetStateAction<SpeechSynthesisVoice>> | null,
  number | null
];

// создаем контекст для голоса приложения
// установка пустого объекта в качестве начального значения
const VoiceContext = createContext<TVoiceContext>([null, null, null]);
export  {VoiceContext};