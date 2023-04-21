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

export const AuthorDelete = () => {
  const { authorId } = useParams();
  const navigate = useNavigate();

  const handleDelete = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    await axios.delete(`${BACKEND_API_URL}/authors/${authorId}`);
    navigate("/authors");
  };

  const handleCancel = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    navigate("/authors");
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/authors`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          Are you sure you want to delete this author? This cannot be undone!
        </CardContent>
        <CardActions>
          <Button onClick={handleDelete}>Delete it</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </CardActions>
      </Card>
    </Container>
  );
};
