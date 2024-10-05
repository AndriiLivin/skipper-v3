import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles/index.scss";
// import "./index.css";

import { VoiceoverProvider } from "./VoiceComponents/VoiceoverProvider.tsx";

import ResponsiveAppBar from "./routes/ResponsiveAppBar/ResponsiveAppBar.tsx";
import FamMealGuide from "./routes/ResponsiveAppBar/FamMealGuide.tsx";
import ErrorPage from "./routes/Error/ErrorPage.tsx";

// ************ Routers ************
import routerFoodSupply from "./routerFoodSupply.tsx";
import routerRecipes from "./routerRecipes.tsx";
import routerRecommendations from "./routerRecommendations.tsx";
// ************ Routers ************

// {console.log(import.meta.env.BASE_URL);
// }

const router = createBrowserRouter(
  [
    //createBrowserRouter нужен для использования loader, action, errorElement
    // и в паре с ними из компонента useLoaderData, useRouteError(),
    // для формирования route может потребоваться и createRoutesFromElements
    {
      path: "/",
      element: <ResponsiveAppBar />, // начинается отсюда
      loader: () => "",
      action: () => "",
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <FamMealGuide />,
        },
        routerFoodSupply,
        routerRecipes,
        routerRecommendations,
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VoiceoverProvider>
      {/* <App /> */}

      <RouterProvider router={router} />
    </VoiceoverProvider>
  </React.StrictMode>
);
