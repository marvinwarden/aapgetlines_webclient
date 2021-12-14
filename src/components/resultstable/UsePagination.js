import React, { useState } from "react";
import { ButtonBase } from "@mui/material";
import { API_QRY_PARAMETERS, API_RESULT_KEYS } from "../../http/ApiClient";

export default function TablePagination({results, page, rowsPerPage, updatePageCallback, searchCallback}) {
    // Extract stateful variables
    const total_results = results.data[API_RESULT_KEYS.TOTAL_QUERY];
    const chunk = results.data[API_RESULT_KEYS.OFFSET];
    const chunk_size = results.data[API_RESULT_KEYS.MAX_QUERY];
    const query = results.qry_href;

    // Variables for UI display
    const total_page = Math.floor(total_results / rowsPerPage);
    
    const change_page = async (offset) => {
        // Determine what new page number should be
        const next_page = (page + offset <= 0) ? 0 : page + offset;
        let update_page = 0;

        if (next_page < 0) {
            update_page = 0;
        } else if (next_page > total_page) {
            update_page = page;
        } else {
            update_page = next_page;
        }

        // Determine if new data must be fetched from API
        const new_search = Math.floor(next_page * rowsPerPage / chunk_size) !== chunk 
                            || Math.floor(next_page * rowsPerPage) - (chunk * chunk_size) > chunk_size;

        // Set new offset if new data is required
        const new_offset = (new_search) ? Math.floor(next_page * rowsPerPage / chunk_size) : -1;
        
        // Invoke callbacks with new pagination parameters
        if (new_offset > -1) await searchCallback(false, new_offset);
        updatePageCallback('page', update_page);
    };
    // Callback for changing a page
    
    // // Callback for managing new rows per page
    // const handleChangerowsPerPage = (event) => {
    //     event.preventDefault();
    //     setrowsPerPage(parseInt(event.target.value));
    //     setPage(0);
    // };
    
    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, searchResult.map((result) => result.length) - page * rowsPerPage);
    // const emptyRows = (()
    //     ? rowsPerPage - Math.min(rowsPerPage, searchResult.map((result) => result.length) - page * rowsPerPage)
    //     : 
    // );
    
    return (
        <div>
            Page {page + 1} of {total_page + 1}
            <br/>
            <ButtonBase onClick={(e) => { e.preventDefault(); change_page(-1); }}>Previous</ButtonBase>
            <span>    </span>
            <ButtonBase onClick={(e) => { e.preventDefault(); change_page(1); }}>Next</ButtonBase>
        </div>
    );
}