import React from "react";
import "./Table.css";
import TableData from "./TableData";
import { TableCell, TablePagination, TableRow } from "@mui/material";
import usePagination from "./usePagination"
import buildQueryString from "../../utils/query-url"
import { API_RESULT_KEYS } from "../../http/apiClient";
import { float_to_tc } from '../../utils/timecode';

export default function Table({searchResult}) {  
  // Extract search result data
  const results = searchResult.data[API_RESULT_KEYS.RESULTS];
  const total_query_results = searchResult.data[API_RESULT_KEYS.TOTAL_QUERY];

  // Handle pagination
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, emptyRows } = usePagination(results);
  
  // TODO: Set UI to loading state for potentially long callback queries
  const page_start = page * rowsPerPage;
  const page_end = page_start + rowsPerPage;

  // Check if searchResults are valid and parse results
  const table_data = results.slice(page_start, page_end).map((found, index) => {
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
        {table_data}
      </table>
      {results.length > 0 && (
        <TablePagination
          //ADD AXIOS GET REQUEST TO ONCLICK
          onClick={() => { return; }}
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={total_query_results}
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
