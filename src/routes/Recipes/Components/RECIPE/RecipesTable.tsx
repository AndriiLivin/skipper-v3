import * as React from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";

import Paper from "@mui/material/Paper";

import FormControlLabel from "@mui/material/FormControlLabel";

import Switch from "@mui/material/Switch";

import { visuallyHidden } from "@mui/utils";
import TablePaginationActions from "./TablePaginationActions";

import {
  NavLink,
  useLoaderData,
  Form,
  useNavigation,
  useSubmit,
} from "react-router-dom";

import MicrophoneInput from "../../../../VoiceComponents/MicrophoneInput";
import "../../STYLES/_recipe-table.scss";

import VoiceButton from "../../../../VoiceComponents/VoiceButton";
import RecipeEdit from "./RecipeEdit";
import { IElement, TLoaderData } from "../../../universal";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof unknown>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof IElement;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "elementName",
    numeric: false,
    disablePadding: false,
    label: "Recipe names",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "Person Qty",
  },
  // {
  //   id: "dimention",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Dim",
  // },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IElement
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    // onSelectAllClick,
    order,
    orderBy,
    // numSelected,
    // rowCount,
    onRequestSort,
  } = props;

  const createSortHandler =
    (property: keyof IElement) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, cellIndex) => (
          <TableCell
            sx={{
              backgroundColor: "grey",
              border: "1px solid lightgrey",
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
            key={headCell.id}
            align={"center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {cellIndex !== 0 ? (
              headCell.label
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function RecipesTable() {
  const { group, qqq } = useLoaderData() as TLoaderData; // приходит из state после работы загрузчика

  // создаем строки таблицы
  const rows: IElement[] = group.elements;

  const navigation = useNavigation();
  const submit = useSubmit(); //Императивная версия <Form>позволяет вам, программисту, отправлять форму вместо пользователя.
  // Эта функция работает только при использовании маршрутизатора данных
  // Отправляем форму поиск при изменении содержания

  const searching = // возвращает логическое значение или неопределено
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("qqq"); // если есть в запросе ?q= dfhfgh
  // search:"?q=linux"  http://localhost:5173/?q=No

  // useEffect(() => {
  //   document.getElementById("q").value = q; //эффект в присвоении значения q элементу по id (input)
  // }, [q]);

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof IElement>("elementName");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event: unknown, property: keyof IElement) => {
    if (event) {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => Number(n.id));
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    if (event) {
      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly number[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    if (event) {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      rows
        .slice()
        .sort(getComparator(order, orderBy as never))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  const formData = new FormData();

  const handlerOnSubmit = (newRecipe: string) => {
    handlerOnSearch("");
    formData.append("newRecipe", newRecipe);

    submit(formData, {
      method: "post",
      action: `/recipes/recipe-groups/${group.id}/add-element`,
    });
  };

  const handlerOnSearch = (searchFor: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append("qqq", searchFor);
    submit(searchParams);
  };

  return (
    <>
      <Paper id="recipe-table">
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "lightgrey",
          }}
        >
          <Form id="search-form" role="search" method="get">
            <MicrophoneInput
              id="qqq"
              type="search"
              className={searching ? "mic-input loading" : "mic-input"}
              // aria-label="Search contacts"
              placeholder="Search for Recipe"
              name="qqq"
              defaultValue={qqq}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const isFirstSearch = qqq == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
              outputData={handlerOnSearch}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
          </Form>
          <FormControlLabel
            control={
              <Switch
                id="switch"
                checked={dense}
                onChange={handleChangeDense}
              />
            }
            label="Dense padding"
          />
        </Box>

        <TableContainer
          sx={{
            flex: 1,
          }}
        >
          <Table
            stickyHeader
            // aria-labelledby="tableTitle"
            aria-label="sticky table"
            sx={{ minWidth: 350 }}
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                // const isItemSelected = isSelected(Number(row.id));
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, Number(row.id))}
                    // role="checkbox"
                    // aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    // selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{
                        display: "flex",
                        gap: "0.3rem",
                        // mt: 1,
                        // mb: 1,
                        border: "1px solid lightgrey ",
                      }}
                    >
                      <VoiceButton voiceText={row.elementName} />

                      <RecipeEdit
                        groupId={row.elementGroupId}
                        groupName={group.groupName}
                        elementName={row.elementName}
                        elementQty={row.quantity}
                        elementDim={row.dimention}
                        elementId={row.id}
                        ingredients={row.ingredients}
                      />

                      <NavLink
                        style={{ flex: "grow" }}
                        to={`/recipes/recipe-groups/${row.elementGroupId}/${row.id}`}
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        {row.elementName[0].toUpperCase() +
                          row.elementName.slice(1)}
                      </NavLink>

                      <Tooltip title="Delete this recipe">
                        <IconButton
                          onClick={() => {
                            if (
                              confirm(
                                "Please confirm you want to delete this recipe."
                              )
                            ) {
                              submit(null, {
                                method: "post",
                                action: `/recipes/recipe-groups/${group.id}/${row.id}/destroy`,
                              });
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" color="warning" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ border: "1px solid lightgrey" }}
                    >
                      {row.quantity}
                    </TableCell>
                    {/* <TableCell
                      align="center"
                      sx={{ border: "1px solid lightgrey" }}
                    >
                      {row.dimention}
                    </TableCell> */}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* FOOTER */}
        <Box id="table-footer">
          <TablePagination
            rowsPerPageOptions={[3, 5, 10]}
            // если убрать component="div" то выбрасывает ошибку: <td> cannot appear as a child of <div>.
            component="div"
            // colSpan={3}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
          <Form
            id="add-recipe"
            method="post"
            // добавляем в конец адресной строки add-recipe
            action="add-element"
          >
            <MicrophoneInput
              id="pp"
              type="text"
              name="newRecipe"
              placeholder="Add new Recipe"
              outputData={handlerOnSubmit}
            />
          </Form>
        </Box>
      </Paper>
    </>
  );
}
