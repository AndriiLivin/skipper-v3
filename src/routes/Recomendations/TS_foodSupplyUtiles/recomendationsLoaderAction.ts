import { redirect } from "react-router-dom";
import {
  IGroup,
  createGroup,
  getAllElements,

} from "../../universal";
// import { updateProduct } from "./food-products";

// Fast refresh only works when a file only export components.
// Use a new file to share constant or functions between components.
// eslint(react - refresh / only -export -components)
export async function recomendationsLoader() {
  // // загружаем продукты с учетом состояния поля поиск
  // const url = new URL(request.url);

  // Отфильтруйте список, если есть URLSearchParams.
  // const q = url.searchParams.get("q"); // получаем что забито в поле поиска после ?q=
 
  const allElements = await getAllElements<IGroup>("products");
  return { allElements };


}

export async function recomendationsAction({ request }) {
  const formData = await request.formData();
  const newFoodGroupName = formData.get("newGroupName");

  // обрабатывает кнопку "зеленая галочка"
  // в нашем случае добавляем имя группы
  const newFoodGroup = await createGroup<IGroup>("products", newFoodGroupName);

  if (newFoodGroup.id === "") {
    // если продукт не создан в createGroup
    // т.к. имя уже существует
    return redirect("/food-supply");
  }
  return redirect(`food-groups/${newFoodGroup.id}`);
}
