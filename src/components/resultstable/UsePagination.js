import React, { useState } from "react";
import { ButtonBase } from "@mui/material";
import { API_QRY_PARAMETERS, API_RESULT_KEYS } from "../../http/ApiClient";

export default function TablePagination({results, page, rowsPerPage, updatePageCallback, searchCallback}) {
    // Extract stateful variables
    const total_results = results.data[API_RESULT_KEYS.TOTAL_QUERY];
    const chunk = results.data[API_RESULT_KEYS.OFFSET];
    const chunk_size = results.data[API_RESULT_KEYS.MAX_QUERY];

    // Variables for UI display
    const total_page = Math.floor(total_results / rowsPerPage);
    const cb = async (v) => {

    };

    const change_page = (offset) => {
        // Handle page number
        const next_page = (page + offset <= 0) ? 0 : page + offset;

        
        // Determine if next/previous page requires new data from API
        // console.log('page:', page, 'next page:', next_page, 'index', Math.floor(next_page * rowsPerPage), 'chunk', chunk, 'chunk size:', chunk_size, 'chunk index', Math.floor(next_page * rowsPerPage / chunk_size));
        if (Math.floor(next_page * rowsPerPage / chunk_size) !== chunk
        || Math.floor(next_page * rowsPerPage) - (chunk * chunk_size) > chunk_size)
        {
            searchCallback(Math.floor(next_page * rowsPerPage / chunk_size));
        }

        // Update state for page number
        if (next_page <= 0) {
            updatePageCallback(0);
        } else if (next_page > total_page) {
            updatePageCallback('page', page);
        } else {
            updatePageCallback('page', next_page);
        }
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