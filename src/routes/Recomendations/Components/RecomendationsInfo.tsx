import "../STYLES/_recomendations_info.scss";

import VoiceButton from "../../../VoiceComponents/VoiceButton";

import RecipeRecomendatiosTable from "./RecipeRecomendatiosTable";

export default function RecomendationsInfo() {
  const recomendations =
    "Возможные рецепты блюда из имеющихся продуктов.";
  return (
    <>
      <div id="recomendations-info">
        <h2>{recomendations} </h2>

        <VoiceButton voiceText={recomendations} />


      </div>
      <RecipeRecomendatiosTable />
    </>
  );
}
