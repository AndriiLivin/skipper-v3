import { useNavigate, useRouteError } from "react-router-dom";
import "./_error-page.scss";
import { Button } from "@mui/material";

type IError = {
  statusText: string;
  message: string;
};


export default function ErrorPage() {
  const error = useRouteError() as IError;

  const navigate = useNavigate();

  return (
    <div id="error-page-product">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <strong>
          <i>{(error.statusText) || (error.message )}</i>
        </strong>
      </p>

      <Button
        key={""}
        onClick={() => {
          navigate("/");
        }}
        sx={{ my: 2, color: "white", display: "block" }}
      >
        Нажмите для перехода на главную страницу
      </Button>
    </div>
  );
}
