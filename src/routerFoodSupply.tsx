import ErrorPage from "./routes/Error/ErrorPage.tsx";

// ************ FoodSupply ************
import ZeroGroupState from "./routes/FoodSupply/Components/GROUP/GroupZeroState.tsx";
import FoodSupply from "./routes/FoodSupply/Components/FoodSupply.tsx";
import GroupInfo from "./routes/FoodSupply/Components/GROUP/GroupInfo.tsx";

import { productEditAction } from "./routes/FoodSupply/TS_foodSupplyUtiles/PRODUCT_TS/productEditAction.ts";
import { destroyGroupAction } from "./routes/FoodSupply/TS_foodSupplyUtiles/GROUP_TS/destroyGroupAction.ts";

import {
  foodGroupsAction,
  foodGroupsLoader,
} from "./routes/FoodSupply/TS_foodSupplyUtiles/foodSupplyLoaderAction.ts";

import { groupNameEditAction } from "./routes/FoodSupply/TS_foodSupplyUtiles/GROUP_TS/groupNameEditAction.ts";
import { destroyProductAction } from "./routes/FoodSupply/TS_foodSupplyUtiles/PRODUCT_TS/destroyProductAction.ts";
import { productCreateAction } from "./routes/FoodSupply/TS_foodSupplyUtiles/PRODUCT_TS/productCreateAction.ts";
import { productLoader } from "./routes/FoodSupply/TS_foodSupplyUtiles/PRODUCT_TS/productLoaderAction.ts";
import { groupLoader } from "./routes/FoodSupply/TS_foodSupplyUtiles/GROUP_TS/groupLoaderAction.ts";
// ************ FoodSupply ************

const routerFoodSupply = {
  path: "food-supply",
  element: <FoodSupply />, //запас продуктов

  loader: foodGroupsLoader,
  action: foodGroupsAction,
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: <ZeroGroupState />,
    },
    {
      path: "food-groups/:groupId",
      element: <GroupInfo />,
      loader: groupLoader,
    },
    {
      path: "food-groups/:groupId/edit-name",
      element: <GroupInfo />,
      action: groupNameEditAction,
    },

    {
      path: "food-groups/:groupId/add-element",
      element: <GroupInfo />,
      loader: groupLoader,
      action: productCreateAction,
    },
    // одинаково срабатывает по двум путям
    {
      path: "food-groups/:groupId/:elementId/add-element",
      element: <GroupInfo />,
      loader: groupLoader,
      action: productCreateAction,
    },
    {
      path: "food-groups/:groupId/:elementId",
      element: <GroupInfo />,
      loader: groupLoader,
    },
    {
      path: "food-groups/:groupId/:elementId/edit-element",
      element: <GroupInfo />,
      loader: productLoader,
      action: productEditAction,
    },

    {
      path: "food-groups/:groupId/destroy",
      action: destroyGroupAction,
      errorElement: <div>Опаньки!! Не получается удалить продукт..</div>,
    },
    {
      path: "food-groups/:groupId/:elementId/destroy",
      action: destroyProductAction,
    },
  ],
};

export default routerFoodSupply;
