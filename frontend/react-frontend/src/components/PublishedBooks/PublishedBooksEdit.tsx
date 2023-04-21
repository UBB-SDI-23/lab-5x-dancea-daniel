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
import DatePicker from "react-date-picker";
import { PublishedBooks } from "../../models/PublisherBooks";

export const PublishedBooksEdit = () => {
  const { bookId, publisherId } = useParams();

  const navigate = useNavigate();

  const [pubBook, setPubBook] = useState<PublishedBooks>({
    book: {
      id: 1,
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

  useEffect(() => {
    const fetchPubBook = async () => {
      console.log("book123");
      // TODO: use axios instead of fetch
      // TODO: handle errors
      // TODO: handle loading stat
      const response = await fetch(
        `${BACKEND_API_URL}/published_books/${bookId}/${publisherId}`
      );
      const pubBook = await response.json();
      console.log(pubBook);
      setPubBook(pubBook);
    };
    fetchPubBook();
  }, [bookId]);

  const updatePubBook = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const toSendPubBook = {
        year: pubBook.year,
        price: pubBook.price,
        book: bookId,
        publisher: publisherId,
      };
      console.log(toSendPubBook);
      console.log(pubBook);
      await axios.put(
        `${BACKEND_API_URL}/published_books/${bookId}/${publisherId}`,
        toSendPubBook
      );
      navigate("/published_books");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/published_books`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          <form onSubmit={updatePubBook}>
            <TextField
              id="book"
              label="Book Name"
              variant="outlined"
              fullWidth
              value={pubBook.book.name}
              sx={{ mb: 2 }}
              disabled={true}
            />
            <TextField
              id="publisher"
              label="Publisher Name"
              variant="outlined"
              fullWidth
              value={pubBook.publisher.name}
              sx={{ mb: 2 }}
              disabled={true}
            />
            <TextField
              id="publication_year"
              label="Publication year(YYYY)"
              variant="outlined"
              fullWidth
              value={pubBook.year}
              error={localError.year ? true : false}
              helperText={localError.year}
              sx={{ mb: 2 }}
              onChange={(event) => {
                console.log(event.target.value);
                console.log(pubBook.book.publication_date);
                if (
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
              //   type="number"
              value={pubBook.price}
              error={localError.price ? true : false}
              helperText={localError.price}
              sx={{ mb: 2 }}
              onChange={(event) => {
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
            <Button type="submit">Edit Published Book</Button>
          </form>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Container>
  );
};
