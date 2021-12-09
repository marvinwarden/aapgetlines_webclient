import { useState } from "react";


const usePagination = (searchResult) => {

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
   
    return {
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        emptyRows
    }
    
}

export default usePagination;