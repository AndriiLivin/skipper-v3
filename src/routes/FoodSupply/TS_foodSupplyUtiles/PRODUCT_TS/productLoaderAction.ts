// import { getGroup, updateGroup } from "../foodProducts";
import { IGroup, getOneGroup } from "../../../universal";

export async function productLoader({ params }) {
  // params = :contactId берется из path: "contacts/:contactId",это все, что после слэша в конце

  const group = await getOneGroup<IGroup>("products", params.groupId);

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

// export async function productAction({ request, params }) {
//   // const formData = await request.formData();
//   // console.log("ACTION PRODUCT");
//   // console.log(formData, request, params);
//   // return updateGroup(params.productId, {
//   //   favorite: formData.get("favorite") === "true",
//   // });
// }
