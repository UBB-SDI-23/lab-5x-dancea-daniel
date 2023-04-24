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
} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { BACKEND_API_URL } from "../../constants";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const AuthorsShowAll = () => {
  const [loading, setLoading] = useState(false);

  const [sorting, setSorting] = useState(false);
  const [authors, setAuthors] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(1000000 / 100);

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_API_URL}/authors/?page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        setAuthors(data);
        console.log(data);
        setLoading(false);
      });
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    setLoading(true);
    fetch(`${BACKEND_API_URL}/authors/?page=${newPage}`)
      .then((response) => response.json())
      .then((data) => {
        setAuthors(data);
        setLoading(false);
      });
  };

  const pageNumbers = [];
  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    pageNumbers.push(i);
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      console.log(currentPage);
      setLoading(true);
      fetch(`${BACKEND_API_URL}/authors/?page=${currentPage + 1}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(currentPage);
          setAuthors(data);
          setLoading(false);
        });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      console.log(currentPage);
      setLoading(true);
      fetch(`${BACKEND_API_URL}/authors/?page=${currentPage - 1}`)
        .then((response) => response.json())
        .then((data) => {
          setAuthors(data);
          setLoading(false);
        });
    }
  };

  return (
    <Container>
      <h1>All authors</h1>
      {loading && <CircularProgress />}
      {!loading && authors.length === 0 && <p>No authors found</p>}
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
                {pageNumbers[0] > 2 && <span>...</span>}
              </>
            )}
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && (
                  <span>...</span>
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
            to={`/authors/?page=${currentPage}`}
            disabled={currentPage === 1}
          >
            <Tooltip title="Previous">
              <ArrowBackIosIcon sx={{ color: "black" }} />
            </Tooltip>
          </IconButton> */}
          <IconButton component={Link} sx={{ mr: 0 }} to={`/authors/add`}>
            <Tooltip title="Add a new author" arrow>
              <AddIcon color="primary" />
            </Tooltip>
          </IconButton>
          {/* <IconButton
            style={{ marginLeft: "370px" }}
            onClick={handleNextPage}
            component={Link}
            sx={{ mr: 3 }}
            to={`/authors/?page=${currentPage}`}
            disabled={currentPage === totalPages}
          >
            <Tooltip title="Next">
              <ArrowForwardIosIcon sx={{ color: "black" }} />
            </Tooltip>
          </IconButton> */}
        </Toolbar>
      )}
      {!loading && authors.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 950 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="left">First Name</TableCell>
                <TableCell align="left">Last Name</TableCell>
                {/* <TableCell align="right">Teacher Name</TableCell> */}
                <TableCell align="left">Books sold</TableCell>
                <TableCell align="left">Books Published</TableCell>
                <TableCell align="right">Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authors.map((author: Author, index) => (
                <TableRow key={author.id}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {author.first_name}
                  </TableCell>
                  <TableCell align="left">{author.last_name}</TableCell>
                  <TableCell align="left">{author.books_sold}</TableCell>
                  <TableCell align="left">{author.num_book}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/authors/${author.id}/details`}
                    >
                      <Tooltip title="View book details" arrow>
                        <ReadMoreIcon color="primary" />
                      </Tooltip>
                    </IconButton>

                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/authors/${author.id}/edit`}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/authors/${author.id}/delete`}
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
