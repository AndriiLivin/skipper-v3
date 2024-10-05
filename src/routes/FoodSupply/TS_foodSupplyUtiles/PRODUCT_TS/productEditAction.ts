import { redirect } from "react-router-dom";
import { IGroup, updateElement } from "../../../universal";

export async function productEditAction({ request, params }) {
  const formData = await request.formData();
  const newProductName = formData.get("elementName");
  const newProductQty = formData.get("elementQty");
  const newProductDim = formData.get("elementDim");

  const { element, groupIdChecked } = await updateElement<IGroup>(
    "products",
    params.groupId,
    params.elementId,
    newProductName,
    newProductQty,
    newProductDim
  );

  return redirect(`/food-supply/food-groups/${groupIdChecked}/${element.id}`);
}
