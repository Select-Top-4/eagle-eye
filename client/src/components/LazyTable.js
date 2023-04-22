import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
} from "@mui/material";

export default function LazyTable({
  route,
  columns,
  defaultPageSize,
  rowsPerPageOptions,
}) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize ?? 10);

  useEffect(() => {
    fetch(`${route}&page=${page}&limit=${pageSize}`)
      .then(res => {
        const contentType = res.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        } else {
          throw new Error("Invalid content type: " + contentType);
        }
      })
      .then(resJson => setData(resJson))
      .catch(error => console.error("Error fetching data:", error));
  }, [route, page, pageSize]);

  const handleChangePage = (e, newPage) => {
    if (newPage < page || data.length === pageSize) {
      setPage(newPage + 1);
    }
  };

  const handleChangePageSize = e => {
    const newPageSize = e.target.value;
    setPageSize(newPageSize);
    setPage(1);
  };

  const defaultRenderCell = (col, row) => {
    return <div>{row[col.field]}</div>;
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={col.headerName}>{col.headerName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {
                columns.map(col => (
                  <TableCell key={col.headerName}>
                    {col.renderCell
                      ? col.renderCell(row)
                      : defaultRenderCell(col, row)}
                  </TableCell>
                ))
              }
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions ?? [5, 10, 25]}
              count={-1}
              rowsPerPage={pageSize}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangePageSize}
              colSpan={columns.length}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
