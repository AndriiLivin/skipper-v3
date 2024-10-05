export interface IVoiceOver {
  textForVoiceOver: string;
  CBStart: () => void;
  CBEnd: () => void;
  options: object;
}

export const VoiceTheText = (
  textForVoiceOver = "",
  CBStart: () => void,
  CBEnd: () => void,
  options: {
    voice: SpeechSynthesisVoice;
    lang: string;
    pitch: number;
    rate: number;
    volume: number;
  }
): void => {
  if (textForVoiceOver !== "") {
    // создаем объект для озвучивания текста
    //utterance - высказывание т.е. здесь получаем звуковую дорожку по тексту
    const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();

    utterance.voice = options.voice;
    utterance.text = textForVoiceOver;
    utterance.lang = options.lang;
    utterance.pitch = options.pitch;
    utterance.rate = options.rate;
    utterance.volume = options.volume;
    // // Обработчик события при старте проигрывателя.
    utterance.onstart = CBStart;
    // Обработчик события при завершении проигрывателя.
    utterance.onend = CBEnd;
    utterance.onend = function () {
      speechSynthesis.cancel();
    };
    // Создаем объект проигрывателя.
    const recordPlayer: SpeechSynthesis = window.speechSynthesis;

    // если в данный момент какой-то текст уже звучит,
    // то его нужно отключить , чтобы запустить новый
    recordPlayer.cancel(); // utterance stops being spoken immediately, and removed from the queue
    // запускаем озвучку
    recordPlayer.speak(utterance);
  }
  return;
};
