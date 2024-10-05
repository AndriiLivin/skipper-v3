import { IGroup, getOneGroup, searchElement } from "../../../universal";

// Fast refresh only works when a file only export components.
// Use a new file to share constant or functions between components.
// eslint(react - refresh / only -export -components)
export async function recipeSingleGroupLoader({ request, params }) {
  // params = :contactId берется из path: "contacts/:contactId",это все, что после слэша в конце

  const textForVoiceover = "Список рецептов в группе ";
  const url = new URL(request.url);

  // Отфильтруйте список, если есть URLSearchParams.
  const qqq = url.searchParams.get("qqq"); // получаем что забито в поле поиска после ?q=
  // console.log(q, url, request);

  let group: IGroup;
  // console.log(qqq);
  if (qqq) {
    // создаем служебную группу с учетом поля поиска
    const searchedElements = await searchElement<IGroup>("all-recipes", qqq);
  

    group = {
      id: "qqq-group",
      createdAt: 1111111,
      groupName: "--------",

      elements: searchedElements,
    };
  } else {
    group = await getOneGroup("all-recipes", params.groupId) as IGroup; //загружаем группу по ее id
  }

  if (!group) {
    throw new Response("", {
      status: 404,
      statusText: "Среди ваших рецептов такого нет.",
    });
  }

  return { group, qqq, textForVoiceover };
}

// export async function recipeGroupAction({ request, params }) {
//   // // для обработки звездочки - меняем favorite
//   // const formData = await request.formData();
//   // console.log("ACTION GROUP");
//   // console.log(formData, request, params);
//   // return updateGroup(params.productId, {
//   //   favorite: formData.get("favorite") === "true",
//   // });
// }
