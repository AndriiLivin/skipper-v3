import { useLoaderData } from "react-router-dom";
import "../../STYLES/_recipe_info.scss";

import VoiceButton from "../../../../VoiceComponents/VoiceButton";

import RecipesTable from "../RECIPE/RecipesTable";
import { TLoaderData } from "../../../universal";

export default function RecipeGroupInfo() {
  // const { group,product } = useLoaderData();
  const {
    group,
    // qqq,
    textForVoiceover,
  } = useLoaderData() as TLoaderData;
  // console.log(group, qqq);

  return (
    <>
      <div id="recipe-info">
        <h2>{textForVoiceover}</h2>
        <h1>
          {group.groupName ? (
            <i>{group.groupName[0].toUpperCase() + group.groupName.slice(1)}</i>
          ) : (
            <i>No Name</i>
          )}
          <br></br>

          <VoiceButton voiceText={textForVoiceover + group.groupName} />
        </h1>
      </div>

      <RecipesTable />
    </>
  );
}
