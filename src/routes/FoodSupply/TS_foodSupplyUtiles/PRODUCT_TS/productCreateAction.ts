import { redirect } from "react-router-dom";
import { IGroup, createElement } from "../../../universal";

export async function productCreateAction({ request, params }) {
  const formData = await request.formData();
  const newProduct = formData.get("newProduct");

  // обрабатывает кнопку "зеленая галочка"
  // в нашем случае добавляем имя продукта
  const { element, groupIdChecked } = await createElement<IGroup>(
    "products",
    newProduct,
    params.groupId,
    params.groupName
  );

  return redirect(`/food-supply/food-groups/${groupIdChecked}/${element.id}`);
}
