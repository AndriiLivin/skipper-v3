// import { getGroup, updateGroup } from "../recipes1";
import { IGroup, getOneGroup } from "../../../universal";

export async function recipeLoader({ params }) {
  // params = :contactId берется из path: "contacts/:contactId",это все, что после слэша в конце

  const group = await getOneGroup<IGroup>("all-recipes", params.groupId);

  if (!group) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  const element = group.elements.find(
    (element) => element.id === params.elementId
  );

  return { group, element };
}

// export async function recipeAction({ request, params }) {
//   // const formData = await request.formData();
//   // console.log("ACTION PRODUCT");
//   // console.log(formData, request, params);
//   // return updateGroup(params.productId, {
//   //   favorite: formData.get("favorite") === "true",
//   // });
// }
