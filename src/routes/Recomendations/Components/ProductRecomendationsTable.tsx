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

import Paper from "@mui/material/Paper";

import { visuallyHidden } from "@mui/utils";
import TablePaginationActions from "./TablePaginationActions";

import { NavLink, useLoaderData } from "react-router-dom";

import "../STYLES/_product-recomendations-table.scss";

import VoiceButton from "../../../VoiceComponents/VoiceButton";
import { IElement, TLoaderData } from "../../universal";

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
    label: "The product's name",
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
    property: keyof IElement
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;

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

export default function ProductRecomendationsTable() {
  const { allElements } = useLoaderData() as TLoaderData;

  // приходит из state после работы загрузчика
  const availableProducts: IElement[] = [];
  allElements.forEach((element) => {
    if (Number(element.quantity) > 0) {
      availableProducts.push(element);
    }
  });

  // создаем строки таблицы
  const rows: IElement[] = availableProducts;

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof IElement>("elementName");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const dense = true;
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
      <Paper id="product-recomendations-table">
        <Box
          sx={{
            mt: "0.5rem",
            flex: 1,
            overflow: "auto",
          }}
        >
          <TableContainer sx={{}}>
            <Table
              stickyHeader
              aria-label="sticky table"
              sx={{
                minWidth: 450,
              }}
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
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, Number(row.id))}
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
                        <VoiceButton voiceText={row.elementName} />

                        <NavLink
                          style={{ flex: "grow" }}
                          to={`/food-supply/food-groups/${row.elementGroupId}/${row.id}`}
                          className={({ isActive }) =>
                            isActive ? "active" : ""
                          }
                        >
                          {row.elementName[0].toUpperCase() +
                            row.elementName.slice(1)}
                        </NavLink>
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{ border: "1px solid lightgrey" }}
                      >
                        {row.quantity}
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
        </Box>

        {/* FOOTER */}
        <Box id="table-footer" sx={{ mb: "0.5rem" }}>
          <TablePagination
            // rowsPerPageOptions={[3, 5, 10, { label: "All", value: -1 }]}
            rowsPerPageOptions={[5, 10, 25]}
            // если убрать component="div" то выбрасывает ошибку: <td> cannot appear as a child of <div>.
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </Box>
      </Paper>
    </>
  );
}
