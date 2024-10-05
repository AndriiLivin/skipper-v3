import { useEffect, useContext, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { VoiceContext } from "./VoiceContext.ts";
// import localforage from "localforage";
import { setVoiceoverName } from "../routes/universal.ts";

export interface IVoiceSelectionProps {
  open: boolean;
  onClose: (value: string) => void;
}

function VoiceSelection(props: IVoiceSelectionProps) {
  const { onClose, open } = props;

  // из глобального стэйта
  const [voiceover, setVoiceover, defaultIndex] = useContext(VoiceContext);

  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(-2);

  useEffect(() => {
    // получаем актуальное значение стэйта
    setSelectedVoiceIndex(defaultIndex!);
  }, [defaultIndex]);

  // Пытаемся получить доступные голоса
  let availableSpeechVoices: SpeechSynthesisVoice[] =
    speechSynthesis.getVoices();
  // При вызове метода getVoices() возникает событие voiceschanged.
  // Обрабатываем это событие для "настоящего" получения голосов
  speechSynthesis.onvoiceschanged = () => {
    availableSpeechVoices = speechSynthesis.getVoices();
  };

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle
        id="simple-dialog-title"
        sx={{ background: "lightgrey", mb: 3 }}
      >
        Возможные голоса озвучки
      </DialogTitle>
      <DialogContent>
        <TextField
          id="standard-select-currency-native"
          select
          // label="Native select"
          value={selectedVoiceIndex}
          SelectProps={{
            native: true,
          }}
          // helperText="Please select your currency"
          variant="standard"
          fullWidth
          onChange={(event) => {
            const target = event.target as unknown as HTMLSelectElement;
           
            setSelectedVoiceIndex(target.selectedIndex);
            setVoiceover!(availableSpeechVoices[target.selectedIndex]);
            setSelectedVoiceIndex(target.selectedIndex);

          }}
        >
          {availableSpeechVoices.map((voice, index) => (
            <option value={index} key={index}>
              {voice.name}
            </option>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={() => {
            onClose("selectedValue");
            // записываем в localforage
            setVoiceoverName(
              voiceover!.name,
              voiceover!.lang,
              selectedVoiceIndex
            );
          }}
          color="primary"
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default VoiceSelection;
