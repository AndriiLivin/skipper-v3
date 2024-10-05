import ErrorPage from "./routes/Error/ErrorPage.tsx";

// ************ Recommendations ************
import Recomendations from "./routes/Recomendations/Components/Recomendations.tsx";
import {
  recomendationsAction,
  recomendationsLoader,
} from "./routes/Recomendations/TS_foodSupplyUtiles/recomendationsLoaderAction.ts";
import RecomendationsInfo from "./routes/Recomendations/Components/RecomendationsInfo.tsx";
import {
  // recipeRecomendationsAction,
  recipeRecomendationsLoader,
} from "./routes/Recomendations/TS_foodSupplyUtiles/recipeRecomendationsLoaderAction.ts";
// ************ Recommendations ************

const routerRecommendations = {
  path: "recomendations",
  element: <Recomendations />,

  loader: recomendationsLoader,
  action: recomendationsAction,
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: <RecomendationsInfo />,
      loader: recipeRecomendationsLoader,
      // action: recipeRecomendationsAction,
    },
  ],
};

export default routerRecommendations;
