import { useLoaderData } from "react-router-dom";
import "../../STYLES/_group_info.scss";

import VoiceButton from "../../../../VoiceComponents/VoiceButton";
import EnhancedTable from "../PRODUCT/EnhancedTable";
import {TLoaderData } from "../../../universal";

export default function GroupInfo() {
  // const { group,product } = useLoaderData();
  const {
    group,
    // qqq,
    textForVoiceover,
  } = useLoaderData() as TLoaderData;
 

  // const productList = "Список продуктов в группе ";

  return (
    <>
      <div id="group-info">
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

      <EnhancedTable />
    </>
  );
}
