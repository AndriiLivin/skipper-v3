import ErrorPage from "./routes/Error/ErrorPage.tsx";

// ************ Recipes ************
import Recipes from "./routes/Recipes/Components/Recipes.tsx";
import RecipeGroupInfo from "./routes/Recipes/Components/RECIPE_GROUP/RecipeGroupInfo.tsx";
import RecipeZeroState from "./routes/Recipes/Components/RECIPE_GROUP/RecipeZeroState.tsx";

import {
  recipeGroupsAction,
  recipeGroupsLoader,
} from "./routes/Recipes/TS_foodSupplyUtiles/recipesLoaderAction.ts";
import { recipeSingleGroupLoader } from "./routes/Recipes/TS_foodSupplyUtiles/GROUP_TS/recipeSingleGroupLoaderAction.ts";
import { recipeGroupNameEditAction } from "./routes/Recipes/TS_foodSupplyUtiles/GROUP_TS/recipeGroupNameEditAction.ts";
import { destroyRecipeGroupAction } from "./routes/Recipes/TS_foodSupplyUtiles/GROUP_TS/destroyRecipeGroupAction.ts";

import { destroyRecipeAction } from "./routes/Recipes/TS_foodSupplyUtiles/RECIPE_TS/destroyRecipeAction.ts";
import { recipeCreateAction } from "./routes/Recipes/TS_foodSupplyUtiles/RECIPE_TS/recipeCreateAction.ts";
import { recipeEditIngredientAction } from "./routes/Recipes/TS_foodSupplyUtiles/RECIPE_TS/recipeEditIngredientAction.ts";
// ************ Recipes ************

const routerRecipes = {
  path: "recipes",
  element: <Recipes />,
  loader: recipeGroupsLoader,
  action: recipeGroupsAction,
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: <RecipeZeroState />,
    },
    {
      path: "recipe-groups/:groupId",
      element: <RecipeGroupInfo />,
      loader: recipeSingleGroupLoader,
    },
    {
      path: "recipe-groups/:groupId/edit-name",
      element: <RecipeGroupInfo />,
      action: recipeGroupNameEditAction,
    },

    {
      path: "recipe-groups/:groupId/add-element",
      element: <RecipeGroupInfo />,
      loader: recipeSingleGroupLoader,
      action: recipeCreateAction,
    },
    // одинаково срабатывает по двум путям
    {
      path: "recipe-groups/:groupId/:elementId/add-element",
      element: <RecipeGroupInfo />,
      loader: recipeSingleGroupLoader,
      action: recipeCreateAction,
    },
    {
      path: "recipe-groups/:groupId/:elementId",
      element: <RecipeGroupInfo />,
      loader: recipeSingleGroupLoader,
    },

    {
      path: "recipe-groups/:groupId/destroy",
      action: destroyRecipeGroupAction,
      errorElement: <div>Опаньки!! Не получается удалить рецепт..</div>,
    },
    {
      path: "recipe-groups/:groupId/:elementId/destroy",
      action: destroyRecipeAction,
    },
    {
      path: "recipe-groups/:groupId/:elementId/add-ingredient",
      element: <RecipeGroupInfo />,
      loader: recipeSingleGroupLoader,
      action: recipeEditIngredientAction,
    },
  ],
};

export default routerRecipes;
