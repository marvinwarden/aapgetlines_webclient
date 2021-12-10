import React from "react";
import "./Table.css";
import TableData from "./TableData";
import { TableCell, TablePagination, TableRow } from "@mui/material";
import usePagination from "./usePagination"
import buildQueryString from "../../utils/query-url"

export default function Table({ searchResult, project, character, episode, line }) {
  
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, emptyRows } = usePagination(searchResult);

  const search = searchResult.map((result) => {
    return result.length;
  });

  const query = search.reduce(function (prevValue, currentValue) { return prevValue + currentValue }, 0);

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
          //ADD AXIOS GET REQUEST TO ONCLICK
          onClick=''
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={query}
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
