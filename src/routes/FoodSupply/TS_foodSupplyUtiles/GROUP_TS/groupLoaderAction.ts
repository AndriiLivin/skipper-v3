import { IGroup, getOneGroup, searchElement } from "../../../universal";

// Fast refresh only works when a file only export components.
// Use a new file to share constant or functions between components.
// eslint(react - refresh / only -export -components)
export async function groupLoader({ request, params }) {
  // params = :contactId берется из path: "contacts/:contactId",это все, что после слэша в конце
  const textForVoiceover = "Список продуктов в группе ";
  const url = new URL(request.url);

  // Отфильтруйте список, если есть URLSearchParams.
  const qqq = url.searchParams.get("qqq"); // получаем что забито в поле поиска после ?q=
  // console.log(q, url, request);

  let group: IGroup;
  // console.log(qqq);
  if (qqq) {
    // создаем служебную группу с учетом поля поиска
    const searchedElements = await searchElement<IGroup>("products", qqq);
    // console.log(searchedProducts);

    group = {
      id: "qqq-group",
      createdAt: 1111111,
      groupName: "--------",

      elements: searchedElements,
    };
  } else {
    group = await getOneGroup("products", params.groupId) as IGroup;
    //загружаем группу по ее id
  }

  if (!group) {
    throw new Response("", {
      status: 404,
      statusText: "Среди ваших продуктов такого нет.",
    });
  }

  return { group, qqq, textForVoiceover };
}

// export async function groupAction({ request, params }) {
//   // // для обработки звездочки - меняем favorite
//   // const formData = await request.formData();
//   // console.log("ACTION GROUP");
//   // console.log(formData, request, params);
//   // return updateGroup(params.productId, {
//   //   favorite: formData.get("favorite") === "true",
//   // });
// }
