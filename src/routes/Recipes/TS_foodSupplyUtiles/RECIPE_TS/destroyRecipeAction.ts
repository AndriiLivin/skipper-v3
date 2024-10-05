import { redirect } from "react-router-dom";
import { IGroup, deleteElement } from "../../../universal";

export async function destroyRecipeAction({ params }) {
  await deleteElement<IGroup>("all-recipes", params.groupId, params.elementId);
  return redirect(`/recipes/recipe-groups/${params.groupId}`);
}
