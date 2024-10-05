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

import "../STYLES/_food-supply.scss";
import MicrophoneInput from "../../../VoiceComponents/MicrophoneInput";

import GroupNameEdit from "./GROUP/GroupNameEdit";
import { TLoaderData } from "../../universal";

export default function FoodSupply() {
  const { foodGroups, q } = useLoaderData() as TLoaderData; // приходит из state после работы загрузчика

  const navigation = useNavigation();
  const submit = useSubmit(); //Императивная версия <Form>позволяет вам, программисту, отправлять форму вместо пользователя.
  // Эта функция работает только при использовании маршрутизатора данных

  // Отправляем форму поиск при изменении содержания
  const searching = // возвращает логическое значение или неопределено
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q"); // если есть в запросе ?q= dfhfgh
  // search:"?q=linux"  http://localhost:5173/?q=No

  // useEffect(() => {
  //   document.getElementById("q").value = q; //эффект в присвоении значения q элементу по id (input)
  // }, [q]);

  const formData = new FormData();

  const handlerOnSubmit = (newFoodGroup: string) => {
    handlerOnSearch("");
    formData.append("newGroupName", newFoodGroup);

    submit(formData, {
      method: "post",
      action: "/food-supply",
    });
  };

  const handlerOnSearch = (searchFor: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append("q", searchFor);
    submit(searchParams);
  };

  return (
    <>
      <div id="food-supply">
        {/* Обратите внимание, что эта форма отличается от других, которые мы использовали, и не имеет расширения <form method="post">. Значение по умолчанию method: "get". Это означает, что когда браузер создает запрос на следующий документ, он помещает данные формы не в тело запроса POST, а в тело URLSearchParams запроса GET. */}
        {/* Поскольку это GET, а не POST, React Router не вызывает метод action.
        Отправка формы GET аналогична щелчку ссылки: меняется только URL-адрес.
        Вот почему код, который мы добавили для фильтрации, находится в loader,
        а не actionв этом маршруте. Это также означает, что это обычная
        навигация по страницам. Вы можете нажать кнопку «Назад», чтобы вернуться
        туда, где вы были. */}

        <Form id="search-form" role="search" method="get">
          <MicrophoneInput
            id="q"
            type="search"
            className={searching ? "mic-input loading" : "mic-input"}
            // aria-label="Search contacts"
            placeholder="Search for food group"
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
        <h1>Food Groups</h1>
        <nav
          style={{
            border: "1px solid grey",
            borderRadius: "4px",
          }}
        >
          {foodGroups.length ? (
            <ul>
              {foodGroups.map((group) => (
                <li key={group.id}>
                  <GroupNameEdit
                    groupId={group.id}
                    groupName={group.groupName}
                  />

                  <NavLink
                    to={`food-groups/${group.id}`}
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
                    {group.favorite && <span>★</span>}
                    {/* прозрачность звезды >★< здесь не меняется */}
                  </NavLink>

                  <Tooltip title="Delete this group">
                    <IconButton
                      onClick={() => {
                        if (
                          confirm(
                            "Please confirm you want to delete this product group."
                          )
                        ) {
                          submit(null, {
                            method: "post",
                            action: `food-groups/${group.id}/destroy`,
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
            name="newGroupName"
            placeholder="Add new food group"
            outputData={handlerOnSubmit}
          />
        </Form>
      </div>

      <div
        id="supply-detail-stock"
        className={navigation.state === "loading" ? "loading" : ""}
        // затуманиваем поле вывода <Outlet />
      >
        <Outlet />
      </div>
    </>
  );
}
