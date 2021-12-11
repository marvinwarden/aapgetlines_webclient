import React from "react";
import "./Table.css";
import TableData from "./TableData";
import { TableCell, TablePagination, TableRow } from "@mui/material";
import usePagination from "./usePagination"
import buildQueryString from "../../utils/query-url"
import { API_RESULT_KEYS } from "../../http/apiClient";
import { float_to_tc } from '../../utils/timecode';

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
            <th className="table-headers">Character</th>
            <th className="table-headers">TC In</th>
            <th className="table-headers">TC Out</th>
            <th className="table-headers">Line</th>
          </tr>
        </thead>
        {
            // Check if searchResults are valid and parse results
            searchResult
            &&
            searchResult.map((result) => {
                return result
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)// TODO: Calculate total pages according to API query total
                .map((found, index) => {
                    // Convert timecode ticks to SMPTE frame timecode
                    const tc_in = float_to_tc(found[API_RESULT_KEYS.TIMECODE][0], found[API_RESULT_KEYS.FRAME_RATE], found[API_RESULT_KEYS.TICK_RATE]);
                    const tc_out = float_to_tc(found[API_RESULT_KEYS.TIMECODE][1], found[API_RESULT_KEYS.FRAME_RATE], found[API_RESULT_KEYS.TICK_RATE]);

                    return <TableData
                        key={index}
                        project={found[API_RESULT_KEYS.PROJECT]}
                        tc_in={tc_in}
                        tc_out={tc_out}
                        line={found[API_RESULT_KEYS.LINE]}
                        character={found[API_RESULT_KEYS.CHARACTER]}
                        episode={found[API_RESULT_KEYS.SEGMENT]}
                    />;
                });
            })
        }
        {!searchResult.length < 1 && (
          <TableRow style={{ height: 53 * emptyRows }}>
            <TableCell colSpan={6} />
          </TableRow>
        )}
      </table>
      {searchResult.length > 0 && (
        <TablePagination
          //ADD AXIOS GET REQUEST TO ONCLICK
          onClick={() => { return; }}
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
