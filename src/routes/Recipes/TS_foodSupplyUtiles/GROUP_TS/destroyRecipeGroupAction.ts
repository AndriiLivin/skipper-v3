import { redirect } from "react-router-dom";
import { IGroup, deleteGroup } from "../../../universal";


export async function destroyRecipeGroupAction({ params }) {
  await deleteGroup<IGroup>("all-recipes", params.groupId);
  return redirect("/recipes");
}
