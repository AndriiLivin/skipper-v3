import * as React from "react";
import { useState, useEffect } from "react";

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

import { NavLink } from "react-router-dom";

import "../../STYLES/_ingredients-table.scss";

import VoiceButton from "../../../../VoiceComponents/VoiceButton";

import {
  IIngredient,
  TAllProductsInfo,
  getAllProductsInfo,
} from "../../../universal";

import { TextField } from "@mui/material";

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
  id: keyof IIngredient;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "ingredientName",
    numeric: false,
    disablePadding: false,
    label: "The ingredient's name",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "Qty",
  },
  {
    id: "dimention",
    numeric: false,
    disablePadding: false,
    label: "Dim",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IIngredient
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
    (property: keyof IIngredient) => (event: React.MouseEvent<unknown>) => {
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

export default function IngredientsTable(props) {
  const [productsInfo, setProductsInfo] = useState<TAllProductsInfo[]>([
    {
      name: "! Add New Ingredient !",
      dim: "---",
    },
  ]);

  useEffect(() => {
    async function InitProductsInfo() {
      const allProductsInfo: TAllProductsInfo[] = await getAllProductsInfo();

      props.ingredients.forEach((ingredient: IIngredient) => {
        const productIndex = allProductsInfo.findIndex(
          (product) => product.name === ingredient.ingredientName
        );

        if (productIndex > -1) allProductsInfo.splice(productIndex, 1);
      });

      allProductsInfo.unshift(productsInfo[0]);
      setProductsInfo(allProductsInfo);
    }
    InitProductsInfo();
  }, [props.ingredients, productsInfo]);

  // создаем служебные строки
  const [rows, setRows] = React.useState<IIngredient[]>(props.ingredients);

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] =
    React.useState<keyof IIngredient>("ingredientName");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event: unknown, property: keyof IIngredient) => {
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

  const handleClick = (id: number) => {
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

  return (
    <>
      <Paper id="ingredients-table">
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "lightgrey",
          }}
        >
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
            sx={{ minWidth: 510 }}
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
              {visibleRows.map((row, indexRow) => {
                const labelId = `enhanced-table-checkbox-${indexRow}`;

                // находим индекс в массиве rows
                const realRowsIndex = rows.findIndex((el) => {
                  return el.ingredientName === row.ingredientName;
                });
                return (
                  <TableRow
                    hover
                    onClick={() => handleClick(Number(row.id))}
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{
                        display: "flex",
                        gap: "0.3rem",
                        border: "1px solid lightgrey ",
                      }}
                    >
                      <VoiceButton voiceText={row.ingredientName} />

                      <NavLink
                        style={{ flex: "grow" }}
                        to={``}
                        className={({ isActive }) =>
                          !isActive ? "active" : ""
                        }
                      >
                        {row.ingredientName[0].toUpperCase() +
                          row.ingredientName.slice(1)}
                      </NavLink>

                      <Tooltip title="Delete this ingredient">
                        <IconButton
                          onClick={() => {
                            if (
                              confirm(
                                "Please confirm you want to delete this ingredient."
                              )
                            ) {
                              const rowsService = rows.slice();
                              rowsService.splice(realRowsIndex, 1);
                              setRows(rowsService);

                              // вызываем колбэк функцию для внесения изменений из всплывающего окна-диалога
                              props.returnIngredients(rowsService);
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
                      <input
                        style={{
                          flex: "1 0 5%",
                          maxWidth: "4.6rem",
                          color: "black",
                          borderRadius: "4px",
                          border: "1px solid lightgrey",
                        }}
                        min="0"
                        step="0.2"
                        // autoFocus
                        id="recipe-qty"
                        value={row.quantity}
                        onChange={(event) => {
                          setRows((prevState) =>
                            prevState.map((stateRow, stateRowIndex) =>
                              stateRowIndex === realRowsIndex
                                ? {
                                    ...stateRow,
                                    quantity: event.target.value,
                                  }
                                : stateRow
                            )
                          );

                          // вызываем колбэк функцию для внесения изменений из всплывающего окна-диалога
                          props.returnIngredients((prevState) =>
                            prevState.map((stateRow, stateRowIndex) =>
                              stateRowIndex === realRowsIndex
                                ? {
                                    ...stateRow,
                                    quantity: event.target.value,
                                  }
                                : stateRow
                            )
                          );
                        }}
                        type="number"
                      />
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ border: "1px solid lightgrey" }}
                    >
                      {row.dimention}
                    </TableCell>
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
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />

          <TextField
            sx={{
              border: "1px solid lightgrey",
              borderRadius: "5px",
              width: "85%",
              marginBottom: "0.3rem",
              backgroundColor: "white",
            }}
            id="add-ingredients"
            select
            // label="Native select"
            value={0}
            SelectProps={{
              // нужно а то нет выбора
              native: true,
            }}
            // делает окно узким
            // variant="standard"
            fullWidth
            onChange={(event) => {
              const target = event.target as unknown as HTMLSelectElement;

              if (
                productsInfo[target.selectedIndex].name !==
                "! Add New Ingredient !"
              ) {
                const addNewIngredient: IIngredient = {
                  createdAt: Date.now(),
                  id: Math.random().toString(36).substring(2, 9),
                  ingredientGroupId: props.elementId,
                  ingredientName: productsInfo[target.selectedIndex].name,
                  quantity: "1",
                  dimention: productsInfo[target.selectedIndex].dim,
                  serviceNumber: target.selectedIndex,
                };
                setRows((prevState) => [...prevState, addNewIngredient]);
                props.returnIngredients((prevState) => [
                  ...prevState,
                  addNewIngredient,
                ]);
              }
            }}
          >
            {productsInfo.map((product, index) => (
              <option value={index} key={index}>
                {product.name[0].toUpperCase() + product.name.slice(1)}
              </option>
            ))}
          </TextField>
        </Box>
      </Paper>
    </>
  );
}
