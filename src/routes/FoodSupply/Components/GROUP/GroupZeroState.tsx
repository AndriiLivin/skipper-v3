// import "./_zero-group-state.scss";
import VoiceButton from "../../../../VoiceComponents/VoiceButton";
import "../../STYLES/_group-zero-state.scss";

export default function ZeroGroupState() {
  const foodSupply =
    "Здесь находится Ваш запас продуктов. Выбирайте нужную группу.";
  return (
    <div id="group-zero-state">
      <h1>{foodSupply} </h1>

      <VoiceButton voiceText={foodSupply} />
    </div>
  );
}
