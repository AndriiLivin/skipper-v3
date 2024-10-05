import VoiceButton from "../../../../VoiceComponents/VoiceButton";
import "../../STYLES/_recipe-zero-state.scss";

export default function RecipeZeroState() {
  const recipeZero =
    "Здесь можно выбрать один из Ваших рецептов. Выбирите сначала нужную группу.";
  return (
    <div id="recipe-zero-state">
      <h1>{recipeZero} </h1>

      <VoiceButton voiceText={recipeZero} />
    </div>
  );
}
