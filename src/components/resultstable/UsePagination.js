import { useState } from "react";

export default function usePagination(searchResult) {
    // State helpers
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    // Callback for changing a page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    // Callback for managing new rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };
    
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, searchResult.map((result) => result.length) - page * rowsPerPage);
    
    return {
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        emptyRows
    }
}