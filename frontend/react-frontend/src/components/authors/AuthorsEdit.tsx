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

export const AuthorsEdit = () => {
  const { authorId } = useParams();

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
    nationality: "string",
    books_sold: 1,
    description: "",
    books: [],
    DOB: "2002-2-2",
  });

  useEffect(() => {
    const fetAuthor = async () => {
      const response = await fetch(`${BACKEND_API_URL}/authors/${authorId}`);
      const author = await response.json();
      setAuthor(author);
      console.log(author);
    };
    fetAuthor();
  }, [authorId]);

  const updateAuthor = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const toSendAuthor = {
        first_name: author.first_name,
        last_name: author.last_name,
        DOB: author.DOB,
        nationality: author.nationality,
        books_sold: author.books_sold,
        description: author.description,
      };
      console.log(toSendAuthor);

      await axios.put(`${BACKEND_API_URL}/authors/${authorId}`, toSendAuthor);
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
          <form onSubmit={updateAuthor}>
            <TextField
              id="first_name"
              label="First Name"
              variant="outlined"
              fullWidth
              value={author.first_name}
              sx={{ mb: 2 }}
              onChange={(event) => {
                console.log(author.DOB);
                setAuthor({ ...author, first_name: event.target.value });
              }}
            />
            <TextField
              id="last_name"
              label="Last Name"
              variant="outlined"
              fullWidth
              value={author.last_name}
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
              value={author.description}
              sx={{ mb: 2 }}
              onChange={(event) =>
                setAuthor({ ...author, description: event.target.value })
              }
            />
            <TextField
              id="dob"
              label="Date of birth(YYYY-MM-DD)"
              variant="outlined"
              value={author.DOB}
              error={localError.DOB ? true : false}
              helperText={localError.DOB}
              fullWidth
              sx={{ mb: 2 }}
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
            <TextField
              id="books_sold"
              label="Books sold"
              variant="outlined"
              fullWidth
              value={author.books_sold}
              // defaultValue={author.books_sold}
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
              value={author.nationality}
              sx={{ mb: 2 }}
              onChange={(event) =>
                setAuthor({ ...author, nationality: event.target.value })
              }
            />
            <Button type="submit">Edit Author</Button>
          </form>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Container>
  );
};
