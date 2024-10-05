// import { getGroup, updateGroup } from "../foodProducts";
import { IGroup, getAllElements } from "../../universal";

export async function recipeRecomendationsLoader() {
  const allRecipes = await getAllElements<IGroup>("all-recipes");
  const allProducts = await getAllElements<IGroup>("products");
  return { allRecipes, allProducts };
}

// export async function recipeRecomendationsAction({ request, params }) {
//   // const formData = await request.formData();
//   // console.log("ACTION PRODUCT");
//   // console.log(formData, request, params);
//   // return updateGroup(params.productId, {
//   //   favorite: formData.get("favorite") === "true",
//   // });
// }
