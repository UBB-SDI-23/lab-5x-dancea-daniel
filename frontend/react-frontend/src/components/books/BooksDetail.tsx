import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Book } from "../../models/Book";

export const BooksDetail = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState<Book>();
  const [loading, setLoading] = useState(false);

  //   useEffect(() => {
  //     setLoading(true);
  //     fetch("http://127.0.0.1:8000/books")
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setBooks(data);
  //         console.log(data);
  //         setLoading(false);
  //       });
  //   }, []);

  useEffect(() => {
    const fetchBook = async () => {
      console.log("book123");
      // TODO: use axios instead of fetch
      // TODO: handle errors
      // TODO: handle loading stat
      const response = await fetch(`http://127.0.0.1:8000/books/${bookId}`);
      const book = await response.json();
      console.log(book);
      setBook(book);
    };
    fetchBook();
  }, [bookId]);

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/books`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          <h1>Book Details</h1>
          <p>Book Name: {book?.name}</p>
          <p>Book Description: {book?.description}</p>
          <p>
            Book Author Name: {book?.author?.first_name}{" "}
            {book?.author?.last_name}
          </p>
          {/* <p>Course students:</p>
          <ul>
            {course?.students?.map((student) => (
              <li key={student.id}>{student.name}</li>
            ))}
          </ul> */}
        </CardContent>
        <CardActions>
          <IconButton
            component={Link}
            sx={{ mr: 3 }}
            to={`/books/${bookId}/edit`}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            component={Link}
            sx={{ mr: 3 }}
            to={`/books/${bookId}/delete`}
          >
            <DeleteForeverIcon sx={{ color: "red" }} />
          </IconButton>
        </CardActions>
      </Card>
    </Container>
  );
};
