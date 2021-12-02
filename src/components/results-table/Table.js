import React, { useState } from "react";
import "./Table.css";
import TableData from "./TableData";
import { TableCell, TablePagination, TableRow } from "@mui/material";

export default function Table({ searchResult }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(
      rowsPerPage,
      searchResult.map((result) => result.length) - page * rowsPerPage
    );

  // const useStyles

  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th className="table-headers">Project</th>
            <th className="table-headers">Episode</th>
            <th className="table-headers">Timecode</th>
            <th className="table-headers">Character</th>
            <th className="table-headers">Line</th>
          </tr>
        </thead>
        {searchResult &&
          searchResult.map((result) =>
            result
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((found) => (
                <TableData
                  key={found.id}
                  project={found.project}
                  timecode={found.timecode}
                  line={found.line}
                  character={found.character}
                  episode={found.episode}
                />
              ))
          )}
        {!searchResult.length < 1 && (
          <TableRow style={{ height: 53 * emptyRows }}>
            <TableCell colSpan={6} />
          </TableRow>
        )}
      </table>
      {searchResult.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={searchResult.map((result) => {
            return result.length;
          })}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ root: { width: "100%", color: "#fff" } }}
        />
      )}
    </div>
  );
}
