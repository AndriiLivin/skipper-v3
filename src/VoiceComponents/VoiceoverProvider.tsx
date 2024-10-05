import { useState, useEffect } from "react";
import { VoiceContext } from "./VoiceContext.ts";

import { getVoiceoverName } from "../routes/universal.ts";
// создаем контекст для голоса приложения
// создаем провайдер голоса
export const VoiceoverProvider = ({ children }) => {
  // голос приложения через useContext
  // инициализация некоторым голосом
  // пустым не получается
  const [voiceover, setVoiceover] = useState<SpeechSynthesisVoice>({
    voiceURI: "",
    name: "",
    lang: "",
    localService: false,
    default: false,
  });

  let availableSpeechVoices: SpeechSynthesisVoice[] =
    speechSynthesis.getVoices();
  // При вызове метода getVoices() возникает событие voiceschanged.
  // Обрабатываем это событие для "настоящего" получения голосов
  speechSynthesis.onvoiceschanged = () => {
    availableSpeechVoices = speechSynthesis.getVoices();
  };

  const [voiceName, setVoiceName] = useState("");
  const [defaultIndex, setdefaultIndex] = useState(-2);

  // очень важно запускать 1 раз, а иначе зацикливается
  useEffect(() => {
    async function initVoice() {
      const voice = await getVoiceoverName();
      if (voice !== null) {
        setVoiceName(voice.name);
      }
    }
    initVoice();
    // заменяем на голос из базы
    // Находим индекс голоса по умолчанию
    const index1 = availableSpeechVoices.findIndex(
      (voice) => voice.name === voiceName
    );
    setdefaultIndex(() => index1);
    // устанавливаем голос приложения
    setVoiceover(availableSpeechVoices[index1]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceName]);

  return (
    <VoiceContext.Provider value={[voiceover, setVoiceover, defaultIndex]}>
      {children}
    </VoiceContext.Provider>
  );
};
