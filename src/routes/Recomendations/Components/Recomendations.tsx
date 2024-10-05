import { Outlet } from "react-router-dom";

import "../STYLES/_recomendations.scss";

import ProductRecomendationsTable from "./ProductRecomendationsTable";

export default function Recomendations() {
  return (
    <>
      <div id="recomendations">
        <h1>Available Products in Food Supply</h1>

        <ProductRecomendationsTable />
 
      </div>

      <div id="recomendations-detail-stock">
        <Outlet />
      </div>
    </>
  );
}
