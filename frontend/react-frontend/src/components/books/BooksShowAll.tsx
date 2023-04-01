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
} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

export const BooksShowAll = () => {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/books")
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
      {/* {!loading && (
        <IconButton component={Link} sx={{ mr: 3 }} to={`/books/add`}>
          <Tooltip title="Add a new course" arrow>
            <AddIcon color="primary" />
          </Tooltip>
        </IconButton>
      )} */}
      {!loading && books.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 950 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Description</TableCell>
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
                      title="View course details"
                    >
                      {book.name}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{book.description}</TableCell>
                  {/* <TableCell align="right">{course.teacher?.name}</TableCell> */}
                  <TableCell align="right">
                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/books/${book.id}/details`}
                    >
                      <Tooltip title="View course details" arrow>
                        <ReadMoreIcon color="primary" />
                      </Tooltip>
                    </IconButton>

                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/courses/${book.id}/edit`}
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

      {/* <table>
        <tr>
          <th>#</th>
          <th>Book name</th>
          <th>Publication Date</th>
        </tr>
        {books.map((book: Book, index) => (
          <tr>
            <td>{index + 1}</td>
            <td>{book.name}</td>
            <td>{book.publication_date.toString()}</td>
          </tr>
        ))}
      </table> */}
    </Container>
  );
};
