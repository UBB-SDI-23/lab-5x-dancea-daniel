import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Book } from "../../models/Book";
import { PublishedBooks } from "../../models/PublisherBooks";
import { BACKEND_API_URL } from "../../constants";
import { Author } from "../../models/Author";
import { Publisher } from "../../models/Publisher";

export const PublishedBooksDetail = () => {
  const { bookId, publisherId } = useParams();
  const [pubBook, setPubBook] = useState<PublishedBooks>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPublisher = async () => {
      console.log("book123");
      const response = await fetch(
        `${BACKEND_API_URL}/published_books/${bookId}/${publisherId}`
      );
      const pubBook = await response.json();
      console.log(pubBook);
      setPubBook(pubBook);
    };
    fetchPublisher();
  }, [bookId]);

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/published_books`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          <h1>Published Book Details</h1>
          <p>
            Book Name: {pubBook?.book.name}
            {/* by {pubBook?.book.author.first_name}{" "}
            {pubBook?.book.author.last_name} */}
          </p>
          <p>Publisher Name: {pubBook?.publisher.name}</p>
          <p>Publishing year: {pubBook?.year}</p>
          <p>Price: {pubBook?.price}</p>
        </CardContent>
        <CardActions>
          <IconButton
            component={Link}
            sx={{ mr: 3 }}
            to={`/published_books/${bookId}/${publisherId}/edit`}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            component={Link}
            sx={{ mr: 3 }}
            to={`/published_books/${bookId}/${publisherId}/delete`}
          >
            <DeleteForeverIcon sx={{ color: "red" }} />
          </IconButton>
        </CardActions>
      </Card>
    </Container>
  );
};
