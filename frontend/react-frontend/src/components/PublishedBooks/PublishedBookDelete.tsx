import {
  Container,
  Card,
  CardContent,
  IconButton,
  CardActions,
  Button,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { BACKEND_API_URL } from "../../constants";
// import { BACKEND_API_URL } from "../../constants";

export const PublishedBookDelete = () => {
  const { bookId, publisherId } = useParams();
  const navigate = useNavigate();

  const handleDelete = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    await axios.delete(
      `${BACKEND_API_URL}/published_books/${bookId}/${publisherId}`
    );
    navigate("/published_books");
  };

  const handleCancel = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    navigate("/published_books");
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/books`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          Are you sure you want to delete this publishing data of the book? This
          cannot be undone!
        </CardContent>
        <CardActions>
          <Button onClick={handleDelete}>Delete it</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </CardActions>
      </Card>
    </Container>
  );
};
