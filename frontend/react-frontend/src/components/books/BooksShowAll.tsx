import { useEffect, useState } from "react";
import { Book } from "../../models/Book";
import { Author } from "../../models/Author";
import { Link } from "react-router-dom";
import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Toolbar,
  Pagination,
  Stack,
  PaginationItem,
} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { BACKEND_API_URL } from "../../constants";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const BooksShowAll = () => {
  const [loading, setLoading] = useState(false);

  const [sorting, setSorting] = useState(false);
  const [books, setBooks] = useState([]);

  const [filter, setFilter] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(1000000 / 10);

  const handleFilter = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // navigate("/books");
    setLoading(true);
    fetch(`${BACKEND_API_URL}/books/?min_copies_sold=${filter}`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  };

  const handleSort = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // navigate("/books");
    setLoading(true);
    fetch(`${BACKEND_API_URL}/books/?page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .slice()
          .sort((a: Book, b: Book) => a.copies_sold - b.copies_sold);
        setBooks(sorted);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_API_URL}/books/?page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        console.log(data);
        setLoading(false);
      });
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    setLoading(true);
    fetch(`${BACKEND_API_URL}/books/?page=${newPage}`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  };

  const pageNumbers = [];
  for (
    let i = Math.max(1, currentPage - 5);
    i <= Math.min(totalPages, currentPage + 5);
    i++
  ) {
    pageNumbers.push(i);
  }

  console.log(pageNumbers);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      console.log(currentPage);
      setLoading(true);
      fetch(`${BACKEND_API_URL}/books/?page=${currentPage + 1}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(currentPage);
          setBooks(data);
          setLoading(false);
        });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      console.log(currentPage);
      setLoading(true);
      fetch(`${BACKEND_API_URL}/books/?page=${currentPage - 1}`)
        .then((response) => response.json())
        .then((data) => {
          setBooks(data);
          setLoading(false);
        });
    }
  };

  return (
    <Container>
      <h1>All books</h1>
      {loading && <CircularProgress />}
      {!loading && books.length === 0 && <p>No books found</p>}
      {!loading && (
        <Toolbar>
          <div>
            {currentPage > 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </button>
            )}
            {pageNumbers[0] > 1 && (
              <>
                <button onClick={() => handlePageChange(1)}>1</button>
                {/* {pageNumbers[0] > 2 && <span>...</span>} */}
                {pageNumbers[0] > 2 && (
                  <>
                    <button onClick={() => handlePageChange(2)}>2</button>
                    {pageNumbers[0] > 3 && (
                      <>
                        <button onClick={() => handlePageChange(3)}>3</button>
                        {pageNumbers[0] > 4 && (
                          <>
                            <button onClick={() => handlePageChange(4)}>
                              4
                            </button>
                            {pageNumbers[0] > 5 && (
                              <>
                                <button onClick={() => handlePageChange(5)}>
                                  5
                                </button>
                                {pageNumbers[0] > 5 && <span>...</span>}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {pageNumbers.map((pageNumber) => (
              <button
                style={{
                  margin: "3px",
                  backgroundColor: currentPage === pageNumber ? "grey" : "",
                  pointerEvents: currentPage === pageNumber ? "none" : "auto",
                }}
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <>
                {pageNumbers[pageNumbers.length - 2] < totalPages - 2 && (
                  <>
                    {pageNumbers[pageNumbers.length - 3] < totalPages - 3 && (
                      <>
                        {pageNumbers[pageNumbers.length - 4] <
                          totalPages - 4 && (
                          <>
                            {pageNumbers[pageNumbers.length - 5] <
                              totalPages - 5 && (
                              <>
                                {pageNumbers[pageNumbers.length - 5] <
                                  totalPages - 6 && <span>...</span>}
                                <button
                                  onClick={() =>
                                    handlePageChange(totalPages - 4)
                                  }
                                >
                                  {totalPages - 4}
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handlePageChange(totalPages - 3)}
                            >
                              {totalPages - 3}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handlePageChange(totalPages - 2)}
                        >
                          {totalPages - 2}
                        </button>
                      </>
                    )}
                    <button onClick={() => handlePageChange(totalPages - 1)}>
                      {totalPages - 1}
                    </button>
                  </>
                )}
                <button onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}
            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            )}
          </div>
          {/* <IconButton
            onClick={handlePrevPage}
            style={{ marginRight: "370px" }}
            component={Link}
            sx={{ mr: 3 }}
            to={`/books/?page=${currentPage}`}
            disabled={currentPage === 1}
          >
            <Tooltip title="Previous">
              <ArrowBackIosIcon sx={{ color: "black" }} />
            </Tooltip>
          </IconButton> */}
          <IconButton component={Link} sx={{ mr: 0 }} to={`/books/add`}>
            <Tooltip title="Add a new book" arrow>
              <AddIcon color="primary" />
            </Tooltip>
          </IconButton>
          {/* <IconButton
            style={{ marginLeft: "370px" }}
            onClick={handleNextPage}
            component={Link}
            sx={{ mr: 3 }}
            to={`/books/?page=${currentPage}`}
            disabled={currentPage === totalPages}
          >
            <Tooltip title="Next">
              <ArrowForwardIosIcon sx={{ color: "black" }} />
            </Tooltip>
          </IconButton> */}
        </Toolbar>
      )}
      {!loading && (
        <form onSubmit={handleFilter}>
          <TextField
            id="name"
            label="Min copies sold"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(event) => setFilter(Number(event.target.value))}
          />
          <Button type="submit">Use filter</Button>
          <Button type="submit" onClick={(event) => setFilter(0)}>
            Reset Filter
          </Button>
        </form>
      )}
      {!loading && (
        <form>
          <Button onClick={handleSort}>Use sort</Button>
          {/* <Button type="submit" onClick={(event) => setFilter(0)}>
            Reset Sort
          </Button> */}
        </form>
      )}
      {!loading && books.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 950 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Description</TableCell>
                {/* <TableCell align="right">Teacher Name</TableCell> */}
                <TableCell align="left">Copies sold</TableCell>
                <TableCell align="left">
                  Nunmber of times that have been published
                </TableCell>
                <TableCell align="center">Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book: Book, index) => (
                <TableRow key={book.id}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Link
                      to={`/books/${book.id}/details`}
                      title="View book details"
                    >
                      {book.name}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{book.description}</TableCell>
                  <TableCell align="left">{book.copies_sold}</TableCell>
                  <TableCell align="left">{book.num_published}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/books/${book.id}/details`}
                    >
                      <Tooltip title="View book details" arrow>
                        <ReadMoreIcon color="primary" />
                      </Tooltip>
                    </IconButton>

                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/books/${book.id}/edit`}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/books/${book.id}/delete`}
                    >
                      <DeleteForeverIcon sx={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
