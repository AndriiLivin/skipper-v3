import { redirect } from "react-router-dom";
import { IGroup, createElement, getOneGroup } from "../../../universal";

export async function recipeCreateAction({ request, params }) {
  const formData = await request.formData();
  const newRecipe = formData.get("newRecipe");

  const group = await getOneGroup("all-recipes", params.groupId) as IGroup;

  // обрабатывает кнопку "зеленая галочка"
  const { element, groupIdChecked } = await createElement<IGroup>(
    "all-recipes",
    newRecipe,
    params.groupId,
    group.groupName
  );

  return redirect(`/recipes/recipe-groups/${groupIdChecked}/${element.id}`);
}
