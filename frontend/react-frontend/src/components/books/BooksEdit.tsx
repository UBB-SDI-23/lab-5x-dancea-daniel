import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { BACKEND_API_URL } from "../../constants";
// import { Course } from "../../models/Course";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { Book } from "../../models/Book";
import { Author } from "../../models/Author";
import { BACKEND_API_URL } from "../../constants";

export const BooksEdit = () => {
  const { bookId } = useParams();

  const navigate = useNavigate();

  const [book, setBook] = useState({
    name: "",
    description: "",
    publication_date: new Date("2022-01-01").toISOString().substr(0, 10),
    copies_sold: 1,
    author: 1,
  });

  useEffect(() => {
    const fetchBook = async () => {
      console.log("book123");
      // TODO: use axios instead of fetch
      // TODO: handle errors
      // TODO: handle loading stat
      const response = await fetch(`${BACKEND_API_URL}/books/${bookId}`);
      const book = await response.json();
      console.log(book);
      setBook(book);
    };
    fetchBook();
  }, [bookId]);

  const updateBook = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      console.log("it tries at least");
      console.log(book);
      await axios.put(`${BACKEND_API_URL}/books/${bookId}`, book);
      navigate("/books");
    } catch (error) {
      console.log(error);
    }
  };

  const [author, setAuthor] = useState<Author[]>([]);

  useEffect(() => {
    // fetch(`${BACKEND_API_URL}/authors`)
    //   .then((res) => res.json())
    //   .then((data) => setAuthor(data));
    const fetchAuthors = async () => {
      // console.log("book123");
      // TODO: use axios instead of fetch
      // TODO: handle errors
      // TODO: handle loading stat
      const response = await fetch(`${BACKEND_API_URL}/authors/`);
      const data = await response.json();
      console.log(data);
      setAuthor(data);
    };
    fetchAuthors();
  }, []);

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/books`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          <form onSubmit={updateBook}>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(event) =>
                setBook({ ...book, name: event.target.value })
              }
            />
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(event) =>
                setBook({ ...book, description: event.target.value })
              }
            />
            <TextField
              id="publication_date"
              label="Publication Date(YYYY-MM-DD)"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(event) =>
                setBook({ ...book, publication_date: event.target.value })
              }
            />
            <TextField
              id="copies_sold"
              label="Copies sold"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(event) =>
                setBook({ ...book, copies_sold: Number(event.target.value) })
              }
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="author-select-label">Author</InputLabel>
              <Select
                labelId="author-select-label"
                id="author-select"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(event) => {
                  const authorId = event.target.value as number;
                  //   const selectedAuthor = author?.find((a) => a.id === authorId);
                  setBook((book) => ({
                    ...book,
                    author: authorId,
                  }));
                  console.log(book);
                }}
              >
                {author?.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.first_name} {a.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit">Edit Book</Button>
          </form>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Container>
  );
};
