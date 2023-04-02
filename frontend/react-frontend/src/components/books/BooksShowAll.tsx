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
} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { BACKEND_API_URL } from "../../constants";

export const BooksShowAll = () => {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  const [filter, setFilter] = useState(0);

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

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_API_URL}/books`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        console.log(data);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <h1>All books</h1>
      {loading && <CircularProgress />}
      {!loading && books.length === 0 && <p>No books found</p>}
      {!loading && (
        <IconButton component={Link} sx={{ mr: 0 }} to={`/books/add`}>
          <Tooltip title="Add a new book" arrow>
            <AddIcon color="primary" />
          </Tooltip>
        </IconButton>
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
      {!loading && books.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 950 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Description</TableCell>
                {/* <TableCell align="right">Teacher Name</TableCell> */}
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
                  <TableCell align="left">
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
