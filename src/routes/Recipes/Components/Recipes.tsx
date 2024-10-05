import {
  NavLink,
  Outlet,
  useLoaderData,
  Form,
  // redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";

import "../STYLES/_recipes.scss";
import MicrophoneInput from "../../../VoiceComponents/MicrophoneInput";

import RecipeGroupNameEdit from "./RECIPE_GROUP/RecipeGroupNameEdit";
import { TLoaderData } from "../../universal";

export default function Recipes() {
  const { recipeGroups, q } = useLoaderData() as TLoaderData; // приходит из state после работы загрузчика

  const navigation = useNavigation();
  const submit = useSubmit();

  // Отправляем форму поиск при изменении содержания
  const searching = // возвращает логическое значение или неопределено
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  const formData = new FormData();

  const handlerOnSubmit = (newRecipeGroup: string) => {
    handlerOnSearch("");
    formData.append("newRecipeGroupName", newRecipeGroup);

    submit(formData, {
      method: "post",
      action: "/recipes",
    });
  };

  const handlerOnSearch = (searchFor: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append("q", searchFor);
    submit(searchParams);
  };
  return (
    <>
      <div id="recipes">
        <Form id="search-form" role="search" method="get">
          <MicrophoneInput
            id="q"
            type="search"
            className={searching ? "mic-input loading" : "mic-input"}
            // aria-label="Search contacts"
            placeholder="Search for recipe group"
            name="q"
            defaultValue={q}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isFirstSearch = q == null;
              submit(event.currentTarget.form, {
                replace: !isFirstSearch,
              });
            }}
            outputData={handlerOnSearch}
          />
          <div id="search-spinner" aria-hidden hidden={!searching} />
        </Form>
        <h1>Recipes for Dishes</h1>
        <nav
          style={{
            border: "1px solid grey",
            borderRadius: "4px",
          }}
        >
          {recipeGroups.length ? (
            <ul>
              {recipeGroups.map((group) => (
                <li key={group.id}>
                  <RecipeGroupNameEdit
                    groupId={group.id}
                    groupName={group.groupName}
                  />

                  <NavLink
                    to={`recipe-groups/${group.id}`}
                    className={({ isActive, isPending }) =>
                      // isPending - на рассмотрениии
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {group.groupName ? (
                      <>
                        {group.groupName[0].toUpperCase() +
                          group.groupName.slice(1)}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                  </NavLink>

                  <Tooltip title="Delete this group">
                    <IconButton
                      onClick={() => {
                        if (
                          confirm(
                            "Please confirm you want to delete this recipe group."
                          )
                        ) {
                          submit(null, {
                            method: "post",
                            action: `recipe-groups/${group.id}/destroy`,
                          });
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" color="warning" />
                    </IconButton>
                  </Tooltip>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>Nothing found</i>
            </p>
          )}
        </nav>
        <Form id="" method="post">
          <MicrophoneInput
            id="bb"
            type="text"
            name="newRecipeGroupName"
            placeholder="Add new recipe group"
            outputData={handlerOnSubmit}
          />
        </Form>
      </div>

      <div
        id="recipes-detail-stock"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
