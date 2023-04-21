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
import { PublishedBooks } from "../../models/PublisherBooks";
import { Publisher } from "../../models/Publisher";

export const PublishedBooksAdd = () => {
  const navigate = useNavigate();

  const [pubBook, setPubBook] = useState<PublishedBooks>({
    book: {
      id: -1,
      name: "",
      description: "",
      publication_date: "0000-01-01",
      copies_sold: 1,
      author: {
        id: 1,
        first_name: "string",
        last_name: "string",
        DOB: "2002-2-2",
        nationality: "string",
        books_sold: 1,
        description: "",
        books: [],
      },
    },
    year: -1,
    price: "1.1",
    publisher: {
      id: 1,
      name: "a",
      headquarter: "string",
      established: "string",
      description: "string",
      total_copies_sold: 1,
    },
  });

  const [localError, setLocalError] = useState({
    generic: "",
    book: "",
    publisher: "",
    year: "",
    price: "",
  });

  const addPubBook = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const toSendPubBook = {
        book: pubBook?.book.id,
        publisher: pubBook?.publisher.id,
        year: pubBook?.year,
        price: pubBook?.price,
      };
      console.log(toSendPubBook);
      await axios.post(`${BACKEND_API_URL}/published_books/`, toSendPubBook);
      navigate("/published_books");
    } catch (error) {
      console.log(error);
    }
  };

  const [book, setBook] = useState<Book[]>([]);
  const [lastGetBooksCall, setLastGetBooksCall] = useState<number>(0);

  const getBooks = async (bookQuery: string) => {
    try {
      const currentlastGetBooksCall = lastGetBooksCall;
      setLastGetBooksCall((prev) => prev + 1);
      const response = await axios.get(
        `${BACKEND_API_URL}/books/autocomplete/?query=${bookQuery}`
      );
      const data = await response.data;

      if (currentlastGetBooksCall === lastGetBooksCall) setBook(data);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedGetBooks = useCallback(debounce(getBooks, 500), []);
  useEffect(() => {
    return () => {
      debouncedGetBooks.cancel();
    };
  }, [debouncedGetBooks]);

  const [publisher, setPublisher] = useState<Publisher[]>([]);
  const [lastGetPublishersCall, setLastGetPublishersCall] = useState<number>(0);

  const getPublisher = async (publisherQuery: string) => {
    try {
      const currentlastGetPublishersCall = lastGetPublishersCall;
      setLastGetPublishersCall((prev) => prev + 1);
      const response = await axios.get(
        `${BACKEND_API_URL}/publishers/autocomplete/?query=${publisherQuery}`
      );
      const data = await response.data;

      if (currentlastGetPublishersCall === lastGetPublishersCall)
        setPublisher(data);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedGetPublishers = useCallback(debounce(getPublisher, 500), []);
  useEffect(() => {
    return () => {
      debouncedGetPublishers.cancel();
    };
  }, [debouncedGetPublishers]);

  useEffect(() => {
    getBooks("");
    getPublisher("");
  }, []);

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/books`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          <form onSubmit={addPubBook}>
            <Autocomplete
              disableClearable={true}
              options={book}
              filterOptions={(x) => x}
              sx={{ mb: 2 }}
              getOptionLabel={(option) => option.name}
              onInputChange={(e, value) => debouncedGetBooks(value)}
              renderInput={(params) => (
                <TextField {...params} label="Book" variant="outlined" />
              )}
              onChange={(e, value) => {
                if (
                  pubBook.year > 0 &&
                  pubBook.year < Number(value.publication_date?.substring(0, 4))
                ) {
                  setLocalError({
                    ...localError,
                    year: "The year entered must be after the publishing date of the book",
                  });
                } else {
                  setLocalError({
                    ...localError,
                    year: "",
                  });
                }

                if (value) {
                  console.log(value);
                  setPubBook({ ...pubBook, book: value });
                }
              }}
              disablePortal
            />
            <TextField
              id="year"
              label="Publishing Year(YYYY)"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              error={localError.year ? true : false}
              helperText={localError.year}
              onChange={(event) => {
                if (
                  pubBook.book &&
                  Number(event.target.value) <
                    Number(pubBook.book.publication_date?.substring(0, 4))
                ) {
                  setLocalError({
                    ...localError,
                    year: "The year entered must be after the publishing date of the book",
                  });
                } else if (
                  Number(event.target.value) <
                  Number(pubBook.publisher.established?.substring(0, 4))
                ) {
                  setLocalError({
                    ...localError,
                    year: "The year entered must be after the publishing firms estabileshment date",
                  });
                } else if (Number(event.target.value) > 2023)
                  setLocalError({
                    ...localError,
                    year: "The year entered must be before the current year",
                  });
                else {
                  setLocalError({
                    ...localError,
                    year: "",
                  });
                }

                setPubBook({ ...pubBook, year: Number(event.target.value) });
              }}
            />
            <TextField
              id="price"
              label="Price"
              variant="outlined"
              fullWidth
              error={localError.price ? true : false}
              helperText={localError.price}
              sx={{ mb: 2 }}
              onChange={(event) => {
                console.log(event.target.value.split(".").length);
                if (Number(event.target.value) < 0) {
                  setLocalError({
                    ...localError,
                    price: "The price must be a positive number",
                  });
                } else if (!/^\d+(\.)?(\d+)*$/.test(event.target.value)) {
                  setLocalError({
                    ...localError,
                    price: "Enter a valid price",
                  });
                } else {
                  setLocalError({
                    ...localError,
                    price: "",
                  });
                }
                setPubBook({ ...pubBook, price: event.target.value });
              }}
            />
            <Autocomplete
              disableClearable={true}
              options={publisher}
              filterOptions={(x) => x}
              sx={{ mb: 2 }}
              getOptionLabel={(option) => option.name}
              onInputChange={(e, value) => debouncedGetPublishers(value)}
              renderInput={(params) => (
                <TextField {...params} label="Publisher" variant="outlined" />
              )}
              onChange={(e, value) => {
                if (value) {
                  console.log(value.id);
                  setPubBook({ ...pubBook, publisher: value });
                }
              }}
              disablePortal
            />
            <Button type="submit">Add Published Book</Button>
          </form>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Container>
  );
};
