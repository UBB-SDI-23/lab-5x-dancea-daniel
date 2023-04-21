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

export const AuthorsDetail = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState<Author>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      console.log("book123");
      const response = await fetch(`${BACKEND_API_URL}/authors/${authorId}`);
      const author = await response.json();
      console.log(author);
      setAuthor(author);
    };
    fetchAuthor();
  }, [authorId]);

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/authors`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          <h1>Author Details</h1>
          <p>
            Author Name: {author?.first_name} {author?.last_name}
          </p>
          <p>Author Description: {author?.description}</p>
          <p>Author date of birth: {author?.DOB?.toString()}</p>
          <p>Books Sold: {author?.books_sold}</p>
          <p>Books written:</p>
          <ul>
            {author?.books?.map((data: Book) => (
              <li>
                Title: {data.name}, written in:{" "}
                {data.publication_date?.toString()}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardActions>
          <IconButton
            component={Link}
            sx={{ mr: 3 }}
            to={`/authors/${authorId}/edit`}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            component={Link}
            sx={{ mr: 3 }}
            to={`/authors/${authorId}/delete`}
          >
            <DeleteForeverIcon sx={{ color: "red" }} />
          </IconButton>
        </CardActions>
      </Card>
    </Container>
  );
};
