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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const AuthorsAdd = () => {
  const navigate = useNavigate();

  const [localError, setLocalError] = useState({
    generic: "",
    first_name: "",
    last_name: "",
    DOB: "",
    nationality: "",
    book_sold: "",
    description: "",
  });

  const [author, setAuthor] = useState<Author>({
    first_name: "string",
    last_name: "string",
    DOB: "2002-2-2",
    nationality: "string",
    books_sold: 1,
    description: "",
    books: [],
  });

  const addAuthor = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const toSendAuthor = {
        first_name: author.first_name,
        last_name: author.last_name,
        description: author.description,
        DOB: author.DOB,
        books_sold: author.books_sold,
        nationality: author.nationality,
      };
      console.log(toSendAuthor);

      await axios.post(`${BACKEND_API_URL}/authors/`, toSendAuthor);
      navigate("/authors");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/authors`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          <form onSubmit={addAuthor}>
            <TextField
              id="first_name"
              label="First Name"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(event) =>
                setAuthor({ ...author, first_name: event.target.value })
              }
            />
            <TextField
              id="last_name"
              label="Last Name"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(event) =>
                setAuthor({ ...author, last_name: event.target.value })
              }
            />
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(event) =>
                setAuthor({ ...author, description: event.target.value })
              }
            />
            <TextField
              id="dob"
              label="Date of birth(YYYY-MM-DD)"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              error={localError.DOB ? true : false}
              helperText={localError.DOB}
              onChange={(event) => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(event.target.value)) {
                  console.log("yes");
                  setLocalError({
                    ...localError,
                    DOB: "Enter valid date",
                  });
                } else if (
                  Number(
                    event.target.value.substring(
                      0,
                      event.target.value.indexOf("-") === -1
                        ? undefined
                        : event.target.value.indexOf("-")
                    )
                  ) > 2023
                ) {
                  setLocalError({
                    ...localError,
                    DOB: "The date must be before the current date",
                  });
                } else {
                  setLocalError({
                    ...localError,
                    DOB: "",
                  });
                }
                setAuthor({ ...author, DOB: event.target.value });
              }}
            />
            {/* <DatePicker
              sx={{ mb: 2 }}
              onChange={(date) => {
                console.log(date.toISOString().substring(0, 10));
                setAuthor({
                  ...author,
                  DOB: date instanceof Date ? date : new Date("2002-2-2"),
                });
                // console.log(author.DOB);
              }}
            /> */}
            <TextField
              id="books_sold"
              label="Books sold"
              variant="outlined"
              fullWidth
              error={localError.book_sold ? true : false}
              helperText={localError.book_sold}
              sx={{ mb: 2 }}
              onChange={(event) => {
                if (Number(event.target.value) < 0) {
                  setLocalError({
                    ...localError,
                    book_sold: "The price must be a positive number",
                  });
                } else if (!/^\d+$/.test(event.target.value)) {
                  setLocalError({
                    ...localError,
                    book_sold: "Enter a valid number",
                  });
                } else {
                  setLocalError({
                    ...localError,
                    book_sold: "",
                  });
                }
                setAuthor({
                  ...author,
                  books_sold: Number(event.target.value),
                });
              }}
            />
            <TextField
              id="nationality"
              label="Nationality"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(event) =>
                setAuthor({ ...author, nationality: event.target.value })
              }
            />
            <Button type="submit">Add Author</Button>
          </form>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Container>
  );
};
