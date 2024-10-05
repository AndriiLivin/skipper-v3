import { redirect } from "react-router-dom";
import { IGroup, updateGroupName } from "../../../universal";

export async function recipeGroupNameEditAction({ request, params }) {
  const formData = await request.formData();
  const newRecipeGroupName = formData.get("newRecipeGroupName");
  // const updates = Object.fromEntries(formData);

  await updateGroupName<IGroup>(
    "all-recipes",
    params.groupId,
    newRecipeGroupName
  );
  return redirect(`/recipes/recipe-groups/${params.groupId}`);
}
