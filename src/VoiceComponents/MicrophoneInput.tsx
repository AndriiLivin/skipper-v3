import { useEffect, useContext, useState } from "react";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition-mutation";

import { Box, TextField, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import { VoiceContext } from "./VoiceContext.ts";

// Базовый пример от https://www.npmjs.com/package/react-speech-recognition

// https://www.loginradius.com/blog/engineering/quick-look-at-react-speech-recognition/
// useSpeechRecognition, a React hook that gives component access to a transcript of speech picked up from the user’s microphone.
// SpeechRecognition manages the global state of the Web Speech API, exposing functions to turn the microphone on and off.

// https://github.com/JamesBrill/react-speech-recognition/blob/master/docs/API.md -пояснения!!!!!!

import "./_microphone-input.scss";

// константа для хранения идентификатора таймера мигания
let blinkingTimerId: number = 0;
let idMicPressed: string = "";

// React-компонент может быть типизирован существующими типами
const MicrophoneInput = (props) => {
  // из глобальноо стэйта
  const [voiceover] = useContext(VoiceContext);

  // для конторолируемого ввода т.к. transcript это константа
  const [typingText, setTypingText] = useState("");

  // Видимость микрофона
  const [micVisibility, setMicVisibility] = useState(true);

  // A voice command that resets the transcript should look like this:
  const commands = [
    {
      command: "стоп",
      callback: () => {
        setTypingText(recognition.transcript);
        // setMessage("Микрофон выключен.");
        handlerMicrophonOff();
      },
    },
  ];

  // eslint-disable-next-line prefer-const
  let recognition: {
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
  };

  // создание распознавалки из хука
  recognition = useSpeechRecognition({ commands });

  // просто чтобы задействовать interimTranscript, finalTranscript
  if (recognition.interimTranscript || recognition.finalTranscript) {
    console.log();
  }

  useEffect(() => {
    if (idMicPressed === props.id) {
      setTypingText(recognition.transcript);
    } else {
      setTypingText("");
    }
  }, [recognition.transcript, props.id]);

  // throw in a quick conditional to alert the user if their browser is not compatible with this API
  if (!recognition.browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log(
      "Your browser does not support speech recognition software! Try Chrome desktop, maybe?"
    );
  }

  if (!recognition.isMicrophoneAvailable) {
    // Render some fallback content
    console.log("Микрофон не работает!?");
  }

  //  add a listening function to start our dictaphone
  const listenContinuously = () => {
    recognition.resetTranscript();
    setTypingText("");
    SpeechRecognition.startListening({
      continuous: true,
      language: voiceover ? voiceover.lang : "ru-Ru",
    });
  };

  // функция управляющая миганием микрофона
  // мигает каждые 0,5 сек в течении 15 сек и выключает микрофон
  const blinking = () => {
    blinkingTimerId = setInterval(() => {
      setMicVisibility((micVisibility) => !micVisibility);
    }, 500);

    // запускаем общее время работы
    setTimeout(() => {
      if (blinkingTimerId) {
        clearInterval(blinkingTimerId);
        SpeechRecognition.stopListening();
      }
    }, 15000);
    return;
  };

  const handlerMicrophonOn = () => {
    listenContinuously();
    blinking();
  };

  const handlerMicrophonOff = () => {
    SpeechRecognition.stopListening();
    clearInterval(blinkingTimerId);
    blinkingTimerId = 0;
  };

  const handlerOnClearText = () => {
    recognition.resetTranscript();
    setTypingText("");
    if (props.type === "search") props.outputData("");
  };

  const handlerOnSendText = () => {
    if (typingText) {
      handlerMicrophonOff();
      props.outputData(typingText);
      if (props.type !== "search") handlerOnClearText();
    }
  };

  return (
    <>
      <Box
        id="microphone"
        style={{
          display: "flex",
          gap: 3,
          padding: "5px",
          border: "1px solid grey",
          borderRadius: "4px",
        }}
        onClick={() => {
          idMicPressed = props.id;
        }}
      >
        <Box>
          {recognition.listening && idMicPressed === props.id ? (
            <IconButton color="warning" onClick={handlerMicrophonOff}>
              <Tooltip title="Остановить запись текста">
                {<MicIcon visibility={micVisibility ? "visible" : "hidden"} />}
              </Tooltip>
            </IconButton>
          ) : (
            <IconButton color="primary" onClick={handlerMicrophonOn}>
              <Tooltip title="Начать запись текста">
                <MicIcon visibility="visible" />
              </Tooltip>
            </IconButton>
          )}
        </Box>

        <TextField
          id={props.id}
          type={props.type}
          name={props.name}
          className={props.className}
          placeholder={props.placeholder}
          fullWidth
          value={typingText}
          onChange={(e) => {
            setTypingText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && props.type !== "search") {
              if (typingText === "") {
                e.preventDefault();
              } else {
                setTimeout(() => {
                  setTypingText("");
                }, 500);
                handlerMicrophonOff();
              }
            }
          }}
        />

        <Box>
          <IconButton
            type="button"
            color="primary"
            onClick={handlerOnClearText}
          >
            {props.type === "search" ? (
              <Tooltip title="Отменить поиск.">
                <SearchOffIcon color="action" />
              </Tooltip>
            ) : (
              <Tooltip title="Очистить">
                <ClearIcon color="action" />
              </Tooltip>
            )}
          </IconButton>
        </Box>

        <Box>
          <IconButton
            color="primary"
            onClick={() => {
              handlerOnSendText();
            }}
          >
            {props.type === "search" ? (
              <Tooltip title="Поиск">
                <SearchIcon color="action" />
              </Tooltip>
            ) : (
              <Tooltip title="Применить">
                <CheckIcon color="success" />
              </Tooltip>
            )}
          </IconButton>
        </Box>
      </Box>
    </>
  );
};
export default MicrophoneInput;
