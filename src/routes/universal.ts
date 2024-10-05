import localforage from "localforage";
import { matchSorter } from "match-sorter";

import sortBy from "sort-by";
import { defaultProducts } from "./defaultProducts";
import { defaultRecipes } from "./defaultRecipes";

export interface IIngredient {
  createdAt: number;
  id: string;
  ingredientGroupId: string;

  ingredientName: string;
  quantity: string;
  dimention: string;
  serviceNumber: number;
}

export interface IElement {
  createdAt: number;
  id: string;
  elementGroupId: string;
  elementGroupName: string;

  elementName: string;
  quantity: string;
  dimention: string;

  ingredients: IIngredient[];
}

export interface IGroup {
  createdAt: number;
  id: string;
  favorite?: boolean;

  groupName: string;
  elements: IElement[];
}

export type TLoaderData = {
  foodGroups: IGroup[];
  recipeGroups: IGroup[];
  group: IGroup;
  qqq: string;
  q: string;
  textForVoiceover: string;
  allElements: IElement[];
};

export type TAllProductsInfo = {
  name: string;
  dim: string;
};

export function setVoiceoverName(
  name: string,
  lang: string,
  defaultIndex: number
) {
  const voice = {
    name,
    lang,
    defaultIndex,
  };

  return localforage.setItem("voiceover", voice);
}

export async function getVoiceoverName() {
  const voice: { name: string; lang: string; defaultIndex: number } | null =
    await localforage.getItem("voiceover");

  if (voice === null) {
    voice!.name = "Google русский";
    voice!.lang = "ru-RU";
    voice!.defaultIndex = 17;
  }
  return voice;
}

export function set<T>(localforageName: string, allElements: T[]) {
  return localforage.setItem(localforageName, allElements);
}

// Группы ******************************************
export async function getAllGroups<T>(
  localforageName: string,
  query: string | null | undefined
) {
  await fakeNetwork(`getAllGroups:${query}`);

  let groups: T[] | null = await localforage.getItem(localforageName);

  if (!groups) {
    // инициализация store при первом начале работы
    groups = [];
    if (localforageName === "products") {
      groups = defaultProducts as T[];
      await set<T>(localforageName, groups);
      // console.log("Установлена база defaultProducts");
    }
    if (localforageName === "all-recipes") {
      groups = defaultRecipes as T[];
      await set<T>(localforageName, groups);
      // console.log("Установлена база defaultRecipes");
    }
  }

  if (query) {
    groups = matchSorter(groups, query, { keys: ["groupName", "createdAt"] });
    // matchSorter - сортировщик спичек.
    // позволяет легко фильтровать и сортировать список элементов на основе заданных входных данных.
    // query - то, по чему сортируем-фильтруем contacts. На выходе массив.
    //  keys -По умолчанию он просто использует само значение, как указано выше. Передача массива сообщает сортировщику совпадений, какие ключи использовать для ранжирования.
  }
  // по-дефолту array.sort() сортирует элементы в лексикографическом порядке.
  // var myarray=[25, 8, 7, 41]
  // myarray.sort(function(a,b){
  // return a — b
  // }) //Массив будет [7, 8, 25, 41]

  // employees.sort(function(a, b){
  // return a.age-b.age
  // })

  // console.log(groups);

  return groups.sort(sortBy("groupName", "createdAt"));
  //  Утилита для создания функций сравнения для собственного Array.sort() как в узле, так и в браузере.
  // Позволяет сортировать по нескольким свойствам.
  // сначала сортирует по last, а при их совпадении принимает во внимание createdAt
}

export async function getOneGroup<T>(localforageName: string, id: string) {
  await fakeNetwork(`group:${id}`);

  const groups = await getAllGroups<T>(localforageName, null); //вызов функции без аргумента, т.е. всех групп.

  const group = groups.find((group) => group["id"] === id);
  return group ?? null;
}

export async function createGroup<T>(
  localforageName: string,
  newGroupName: string
) {
  newGroupName = newGroupName.toLowerCase();

  // await fakeNetwork(""); // ложная задержка
  const id: string = Math.random().toString(36).substring(2, 9);

  const newGroup: T = {
    id,
    createdAt: Date.now(),
    groupName: newGroupName,
    elements:
      localforageName === "all-recipes"
        ? [
            {
              createdAt: Date.now(),
              // пустому продукту присваиваем тот же id.
              id: id,
              elementGroupId: id,
              elementGroupName: newGroupName,
              elementName: "Some recipe",
              quantity: "1",
              dimention: "",
              ingredients: [
                {
                  createdAt: Date.now(),
                  // пустому продукту присваиваем тот же id.
                  id: id + "10",
                  ingredientGroupId: id + "20",
                  // elementGroupName: newGroupName,
                  ingredientName: "! Some Ingredient !",
                  quantity: "1",
                  dimention: "---",
                  serviceNumber: 0,
                },
              ],
            },
          ]
        : [
            {
              createdAt: Date.now(),
              // пустому продукту присваиваем тот же id.
              id: id,
              elementGroupId: id,
              elementName: "Some product",
              quantity: "1",
              dimention: "---",
            },
          ],
  } as T;

  const groups = await getAllGroups<T>(localforageName, null); //вызов функции без аргумента, т.е. всех групп.

  // проверка на совпадение имен групп продуктов
  const matchinId = NameMatch(groups, newGroupName);
  if (matchinId !== -1) {
    // продукт не создан, возвращаем найденное id
    newGroup["id"] = groups[matchinId]["id"];
  } else {
    groups.unshift(newGroup); // вставляем в начало массива, можно сразу несколько.
    await set<T>(localforageName, groups); // возвращаем в локальный state - localforage
  }
  return newGroup;
}

export async function updateGroup<T>(
  localforageName: string,
  id: string,
  updates: T
) {
  // await fakeNetwork("");

  const groups = await getAllGroups<T>(localforageName, null);

  const group: T | undefined = groups.find((group) => group["id"] === id);

  if (!group) throw new Error("Nothing found for updateGroup");
  Object.assign(group, updates);

  await set<T>(localforageName, groups);
  return group;
}

export async function updateGroupName<T>(
  localforageName: string,
  id: string,
  updateName: string
) {
  updateName = updateName.toLowerCase();
  // await fakeNetwork("");

  const groups = await getAllGroups<T>(localforageName, null);

  // поверка на совпадение имен
  const matchinId = NameMatch(groups, updateName);

  if (matchinId !== -1) {
    // возвращаем объект со старым названием
    return groups[matchinId];
  }

  const group = groups.find((group) => group["id"] === id);

  if (!group) throw new Error("Nothing found for");

  group["groupName"] = updateName;
  // Object.assign(group, updates);
  await set<T>(localforageName, groups);
  return group;
}

export async function deleteGroup<T>(localforageName: string, id: string) {
  const groups = await getAllGroups<T>(localforageName, null);

  const groupIndex = groups.findIndex((group) => group["id"] === id);
  if (groupIndex > -1) {
    groups.splice(groupIndex, 1);
    await set<T>(localforageName, groups);
    return true;
  }
  return false;
}

// проверка на совпадение имен групп
function NameMatch<T>(groups: T[], newGroupName: string) {
  let mathcingId: number = -1;
  // проверка на совпадение имен групп
  groups.forEach((group, index) => {
    if (group["groupName"] === newGroupName) {
      mathcingId = index;
    }
  });
  if (mathcingId !== -1) {
    alert("Такое название уже существует.");
  }
  return mathcingId;
}

export async function createElement<T>(
  localforageName: string,
  newElementName: string,
  groupId: string,
  groupName: string
) {
  newElementName = newElementName.toLowerCase();
  const id: string = Math.random().toString(36).substring(2, 9);

  const element: IElement = {
    id,
    elementGroupId: groupId,
    elementGroupName: groupName,
    createdAt: Date.now(),
    elementName: newElementName,
    quantity: "1",
    dimention: "---",
    ingredients:
      localforageName === "all-recipes"
        ? [
            {
              createdAt: Date.now(),
              // пустому продукту присваиваем тот же id.
              id: id + 50,
              ingredientGroupId: id,
              ingredientName: "! Some Ingredient !",
              quantity: "1",
              dimention: "---",
              serviceNumber: 0,
            },
          ]
        : [],
  };

  const oneGroup = (await getOneGroup<T>(localforageName, groupId)) as T; //вызов нужной группы.

  const allGroups = await getAllGroups<T>(localforageName, null);

  // проверка на совпадение имен самих продуктов во всех группах
  const matchingObjectIds = ElementNameMatch(allGroups, newElementName);

  let groupIdChecked: string = matchingObjectIds.matchingGroupId;

  if (
    matchingObjectIds.matchingGroupId === "" ||
    matchingObjectIds.matchingElementId === ""
  ) {
    oneGroup["elements"].unshift(element); // вставляем в начало массива, можно сразу несколько.

    updateGroup(localforageName, groupId, oneGroup);
    groupIdChecked = groupId;
  } else {
    alert("Такой элемент уже существует.");

    element.id = matchingObjectIds.matchingElementId;
  }

  return { element, groupIdChecked };
}

export async function updateElement<T>(
  localforageName: string,
  groupId: string,
  elementId: string,
  elementName: string,
  elementQty: string,
  elementDim: string
) {
  elementName = elementName.toLowerCase();
  const oneGroup = (await getOneGroup<T>(localforageName, groupId)) as T; //вызов нужной группы.

  const allGroups = await getAllGroups<T>(localforageName, null);

  const elementIndex = oneGroup["elements"].findIndex(
    (element) => element.id === elementId
  );

  // проверка на совпадение имен самих продуктов во всех группах
  const matchingObjectIds = ElementNameMatch(allGroups, elementName);

  let groupIdChecked: string = matchingObjectIds.matchingGroupId;

  if (
    matchingObjectIds.matchingGroupId === "" ||
    matchingObjectIds.matchingElementId === "" ||
    (matchingObjectIds.matchingGroupId === groupId &&
      matchingObjectIds.matchingElementId === elementId)
  ) {
    oneGroup["elements"][elementIndex].elementName = elementName;
    oneGroup["elements"][elementIndex].quantity = elementQty;
    oneGroup["elements"][elementIndex].dimention = elementDim;

    updateGroup(localforageName, groupId, oneGroup);
    groupIdChecked = groupId;
  } else {
    alert("Такой элемент уже существует.");
    // продукт не создан, поэтому id = ""
    oneGroup["elements"][elementIndex].id = matchingObjectIds.matchingElementId;
  }
  const element = oneGroup["elements"][elementIndex];
  return { element, groupIdChecked };
}

export async function deleteElement<T>(
  localforageName: string,
  groupId: string,
  elementId: string
) {
  const allGroups = await getAllGroups<T>(localforageName, null);

  const groupIndex = allGroups.findIndex((group) => group["id"] === groupId);
  const group = allGroups[groupIndex];

  const elementIndex = group["elements"].findIndex(
    (element) => element.id === elementId
  );

  if (elementIndex > -1) {
    group["elements"].splice(elementIndex, 1);
    updateGroup(localforageName, groupId, group);

    return true;
  }
  return false;
}

// получение всех элементов
export async function getAllElements<T>(localforageName: string) {
  const allGroups = await getAllGroups<T>(localforageName, null);

  // создаем массив всех элементов
  const allElements: IElement[] = [];

  allGroups.forEach((group) => {
    group["elements"].forEach((element) => {
      // обновляем имя на случай его изменения
      element.elementGroupName = group["groupName"];
      allElements.unshift(element);
    });
  });

  return allElements.sort(sortBy("elementName", "createdAt"));
}

// получение списка имен всех продуктов
export async function getAllProductsInfo() {
  const allGroups = await getAllGroups<IGroup>("products", null);

  // создаем массив info всех продуктов
  const allProductsInfo: TAllProductsInfo[] = [] as TAllProductsInfo[];

  allGroups.forEach((group) => {
    group.elements.forEach((element) => {
      allProductsInfo.unshift({
        name: element.elementName.toLowerCase(),
        dim: element.dimention,
      });
    });
  });

  // console.log(allProductsInfo.sort((a, b) => (a.name > b.name ? 1 : -1)));

  return allProductsInfo.sort(sortBy("name", "dim"));
}

// проверка на совпадение имен продуктов
function ElementNameMatch<T>(groups: T[], newElementName: string) {
  let matchingObjectIds = {
    matchingGroupId: "",
    matchingElementId: "",
  };

  // проверка на совпадение имен
  groups.forEach((group) => {
    group["elements"].forEach((element) => {
      if (element.elementName === newElementName) {
        matchingObjectIds = {
          matchingGroupId: group["id"],
          matchingElementId: element.id,
        };
      }
    });
  });
  return matchingObjectIds;
}

export async function searchElement<T>(
  localforageName: string,
  query: string | null | undefined
) {
  // создаем массив всех элементов-продуктов
  let allElements: IElement[] = [];
  allElements = await getAllElements<T>(localforageName);

  allElements = matchSorter(allElements, query as string, {
    keys: ["elementName"],
  });
  return allElements;
}

export async function updateRecipe(
  // localforageName: string,
  groupId: string,
  elementId: string,
  elementName: string,
  elementQty: string,
  newRecipeIngredients: IIngredient[]
) {
  elementName = elementName.toLocaleLowerCase();
  const oneGroup = (await getOneGroup<IGroup>(
    "all-recipes",
    groupId
  )) as IGroup; //вызов нужной группы.

  const allGroups = (await getAllGroups<IGroup>(
    "all-recipes",
    null
  )) as IGroup[];

  const elementIndex = oneGroup.elements.findIndex(
    (element) => element.id === elementId
  );

  // проверка на совпадение имен самих продуктов во всех группах
  const matchingObjectIds = ElementNameMatch(allGroups, elementName);

  let groupIdChecked: string = matchingObjectIds.matchingGroupId;

  if (
    matchingObjectIds.matchingGroupId === "" ||
    matchingObjectIds.matchingElementId === "" ||
    (matchingObjectIds.matchingGroupId === groupId &&
      matchingObjectIds.matchingElementId === elementId)
  ) {
    oneGroup.elements[elementIndex].elementName = elementName;
    oneGroup.elements[elementIndex].quantity = elementQty;
    oneGroup.elements[elementIndex].ingredients = newRecipeIngredients;

    updateGroup("all-recipes", groupId, oneGroup);
    groupIdChecked = groupId;
  } else {
    alert("Такой рецепт уже существует.");
    // продукт не создан, поэтому id = ""
    oneGroup.elements[elementIndex].id = matchingObjectIds.matchingElementId;
  }
  const element = oneGroup.elements[elementIndex];
  return { element, groupIdChecked };
}

interface IFakeCache {
  [key: string]: string | number | boolean;
}
// fake a cache so we don't slow down stuff we've already seen
// let fakeCache: IFakeCache = {};
const fakeCache: IFakeCache = {};

async function fakeNetwork(key: string) {
  // if (!key) {
  //   fakeCache = {};
  // }

  // задержка без текстового ключа
  if (fakeCache[key]) {
    return new Promise((res) => {
      // setTimeout(res, Math.random() * 1800);
      setTimeout(res, 118);
    });
  }

  // fakeCache[key] = true;
  // задержка при наличии текстового ключа
  return new Promise((res) => {
    // setTimeout(res, Math.random() * 800);
    setTimeout(res, 100);
  });
}
