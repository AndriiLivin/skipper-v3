import { redirect } from "react-router-dom";
import { IGroup, createGroup, getAllGroups } from "../../universal";

export async function recipeGroupsLoader({ request,
  // params,
}) {
  // загружаем продукты с учетом состояния поля поиск
  const url = new URL(request.url);

  // Отфильтруйте список, если есть URLSearchParams.
  const q = url.searchParams.get("q"); // получаем что забито в поле поиска после ?q=

  // const recipeGroups = await getGroups(q); // если q = null, то выводим все
  const recipeGroups = await getAllGroups<IGroup>("all-recipes", q);
  return { recipeGroups, q };
}

export async function recipeGroupsAction({ request }) {
  const formData = await request.formData();
  const newRecipeGroupName = formData.get("newRecipeGroupName");

  // обрабатывает кнопку "зеленая галочка"
  // в нашем случае добавляем имя группы
   const newRecipeGroup = await createGroup<IGroup>(
    "all-recipes",
    newRecipeGroupName
  );

  if (newRecipeGroup.id === "") {
    // если продукт не создан в createGroup
    // т.к. имя уже существует
    return redirect("/recipes");
  }
  return redirect(`recipe-groups/${newRecipeGroup.id}`);
}
