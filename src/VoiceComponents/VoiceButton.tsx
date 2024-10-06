import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { VoiceTheText } from "./VoiceTheText.ts";

import { VoiceContext } from "./VoiceContext.ts";

import { useContext } from "react";

function VoiceButton({ voiceText }) {
  let [voiceover] = useContext(VoiceContext);

  if (!voiceover) {
    voiceover = {
      default: false,
      lang: "ru-RU",
      localService: false,
      name: "Google русский",
      voiceURI: "Google русский",
    };
  }

  return (
    <Tooltip title="Озвучить">
      <IconButton
        color="primary"
        size="small"
        style={{ backgroundColor: "white" }}
        onClick={() => {
          VoiceTheText(
            voiceText,
            () => "Start",
            () => "END",
            {
              voice: voiceover,
              lang: voiceover.lang,
              pitch: 1.2,
              rate: 1.2,
              volume: 0.95,
            }
          );
        }}
      >
        <VolumeUpIcon />
      </IconButton>
    </Tooltip>
  );
}
export default VoiceButton;
