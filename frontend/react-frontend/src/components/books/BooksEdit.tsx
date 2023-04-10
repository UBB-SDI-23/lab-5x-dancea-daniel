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

  const [book, setBook] = useState<Book>({
    name: "",
    description: "",
    publication_date: new Date("2022-01-01"),
    copies_sold: 1,
    author: {
      id: 1,
      first_name: "string",
      last_name: "string",
      DOB: new Date("2002-2-2"),
      nationality: "string",
      books_sold: 1,
    },
  });

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
      const toSendBook = {
        name: book.name,
        description: book.description,
        publication_date: book.publication_date,
        copies_sold: book.copies_sold,
        author: book.author.id,
      };
      await axios.put(`${BACKEND_API_URL}/books/${bookId}`, toSendBook);
      navigate("/books");
    } catch (error) {
      console.log(error);
    }
  };

  const [author, setAuthor] = useState<Author[]>([]);

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
              value={book.name}
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
              value={book.description}
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
              value={book.publication_date}
              sx={{ mb: 2 }}
              // onChange={(event) =>
              //   // setBook({ ...book, publication_date: event.target.value. })
              // }
            />
            <TextField
              id="copies_sold"
              label="Copies sold"
              variant="outlined"
              fullWidth
              value={book.copies_sold}
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
                value={book.author.id}
                sx={{ mb: 2 }}
                onChange={(event) => {
                  const selectedAuthor = author.find(
                    (a) => a.id === event.target.value
                  ) as Author;
                  setBook((book) => ({
                    ...book,
                    author: selectedAuthor,
                  }));
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
