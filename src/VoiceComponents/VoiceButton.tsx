import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { VoiceTheText } from "./VoiceTheText.ts";

import { VoiceContext } from "./VoiceContext.ts";

import { useContext } from "react";

function VoiceButton({ voiceText }) {
  const [voiceover] = useContext(VoiceContext);

  if (voiceover === null) return;

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
export default VoiceButton
