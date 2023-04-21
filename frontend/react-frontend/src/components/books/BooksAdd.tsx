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
  Autocomplete,
} from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
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
import { debounce } from "lodash";

export const BooksAdd = () => {
  const navigate = useNavigate();

  const [book, setBook] = useState<Book>({
    name: "",
    description: "",
    publication_date: "2022-01-01",
    copies_sold: 1,
    author: {
      id: 1,
      first_name: "string",
      last_name: "string",
      DOB: "0000-2-2",
      nationality: "string",
      books_sold: 1,
      description: "",
      books: [],
    },
  });

  const [localError, setLocalError] = useState({
    generic: "",
    name: "",
    author: "",
    publication_date: "",
    copies_sold: "",
    description: "",
  });

  const addBook = async (event: { preventDefault: () => void }) => {
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
      await axios.post(`${BACKEND_API_URL}/books/`, toSendBook);
      navigate("/books");
    } catch (error) {
      console.log(error);
    }
  };

  const [author, setAuthor] = useState<Author[]>([]);
  const [lastGetAuthorsCall, setLastGetAuthorsCall] = useState<number>(0);

  // function to get all blends based on the query provided
  const getAuthors = async (authorQuery: string) => {
    try {
      const currentLastGetAuthorsCall = lastGetAuthorsCall;
      setLastGetAuthorsCall((prev) => prev + 1);
      console.log("giees");
      console.log(authorQuery);
      const response = await axios.get(
        `${BACKEND_API_URL}/authors/autocomplete/?query=${authorQuery}`
      );
      const data = await response.data;

      if (currentLastGetAuthorsCall === lastGetAuthorsCall) setAuthor(data);
    } catch (error) {
      console.log(error);
    }
  };

  // debounce the getBlends function to prevent too many requests
  const debouncedGetAuthors = useCallback(debounce(getAuthors, 500), []);
  useEffect(() => {
    return () => {
      debouncedGetAuthors.cancel();
    };
  }, [debouncedGetAuthors]);

  // get some blends when the component mounts
  useEffect(() => {
    getAuthors("");
  }, []);

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/books`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          <form onSubmit={addBook}>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={
                (event) => setBook({ ...book, name: event.target.value })
                // setBook({ ...book, publication_date: new Date(event.target.value).toISOString().substr(0,10) })
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
              label="Publication date(YYYY-MM-DD)"
              variant="outlined"
              error={localError.publication_date ? true : false}
              helperText={localError.publication_date}
              fullWidth
              sx={{ mb: 2 }}
              onChange={(event) => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(event.target.value)) {
                  console.log("yes");
                  setLocalError({
                    ...localError,
                    publication_date: "Enter valid date",
                  });
                } else if (
                  Number(event.target.value.substring(0, 4)) <
                  Number(book.author.DOB?.substring(0, 4))
                ) {
                  setLocalError({
                    ...localError,
                    publication_date:
                      "The year entered must be after the date of birth of the author",
                  });
                } else if (Number(event.target.value.substring(0, 4)) > 2023)
                  setLocalError({
                    ...localError,
                    publication_date:
                      "The year entered must be before the current year",
                  });
                else {
                  setLocalError({
                    ...localError,
                    publication_date: "",
                  });
                }
                setBook({ ...book, publication_date: event.target.value });
              }}
            />
            <TextField
              id="copies_sold"
              label="Copies sold"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              error={localError.copies_sold ? true : false}
              helperText={localError.copies_sold}
              onChange={(event) => {
                if (Number(event.target.value) < 0) {
                  setLocalError({
                    ...localError,
                    copies_sold:
                      "The number of copies must be a positive number",
                  });
                } else if (!/^\d+$/.test(event.target.value)) {
                  setLocalError({
                    ...localError,
                    copies_sold: "Enter a valid number",
                  });
                } else {
                  setLocalError({
                    ...localError,
                    copies_sold: "",
                  });
                }
                setBook({ ...book, copies_sold: Number(event.target.value) });
              }}
            />
            <Autocomplete
              disableClearable={true}
              options={author}
              filterOptions={(x) => x}
              getOptionLabel={(option) =>
                option.first_name + " " + option.last_name
              }
              onInputChange={(e, value) => debouncedGetAuthors(value)}
              renderInput={(params) => (
                <TextField {...params} label="Author" variant="outlined" />
              )}
              onChange={(e, value) => {
                if (value) {
                  console.log(value.id);
                  setBook({ ...book, author: value });
                }
              }}
              disablePortal
              className="autocomplete-blend"
            />
            <Button type="submit">Add Book</Button>
          </form>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Container>
  );
};
