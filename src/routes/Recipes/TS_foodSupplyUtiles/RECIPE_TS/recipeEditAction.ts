import { redirect } from "react-router-dom";
import { updateRecipe } from "../../../universal";

export async function recipeEditAction({ request, params }) {
  const formData = await request.formData();
  const newRecipeName = formData.get("elementName");
  const newRecipeQty = formData.get("elementQty");
  const ingredients = formData.get("elementIngredients");
  const newRecipeIngredients = JSON.parse(ingredients);

  console.log(newRecipeIngredients, newRecipeQty);

  const { element, groupIdChecked } = await updateRecipe(
    // "all-recipes",
    params.groupId,
    params.elementId,
    newRecipeName,
    newRecipeQty,
    newRecipeIngredients,
  );
  return redirect(`/recipes/recipe-groups/${groupIdChecked}/${element.id}`);
}
