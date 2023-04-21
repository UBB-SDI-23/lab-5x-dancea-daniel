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
import { Publisher } from "../../models/Publisher";

export const PublishersAdd = () => {
  const navigate = useNavigate();

  const [publisher, setPublisher] = useState<Publisher>({
    name: "string",
    headquarter: "string",
    established: "2002-2-2",
    total_copies_sold: 1,
    description: "",
    publishing_details: [],
  });

  const [localError, setLocalError] = useState({
    generic: "",
    name: "",
    headquarter: "",
    established: "",
    total_copies_sold: "",
    description: "",
  });

  const addPublisher = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const toSendPublisher = {
        name: publisher.name,
        headquarter: publisher.headquarter,
        established: publisher.established,
        total_copies_sold: publisher.total_copies_sold,
        description: publisher.description,
        publishing_details: [],
      };
      console.log(toSendPublisher);

      await axios.post(`${BACKEND_API_URL}/publishers/`, toSendPublisher);
      navigate("/publishers");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/publishers`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          <form onSubmit={addPublisher}>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(event) =>
                setPublisher({ ...publisher, name: event.target.value })
              }
            />
            <TextField
              id="headquarter"
              label="Headquarter"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(event) =>
                setPublisher({ ...publisher, headquarter: event.target.value })
              }
            />
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(event) =>
                setPublisher({ ...publisher, description: event.target.value })
              }
            />
            <TextField
              id="established"
              label="Establishment date(YYYY-MM-DD)"
              variant="outlined"
              fullWidth
              error={localError.established ? true : false}
              helperText={localError.established}
              sx={{ mb: 2 }}
              onChange={(event) => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(event.target.value)) {
                  console.log("yes");
                  setLocalError({
                    ...localError,
                    established: "Enter valid date",
                  });
                } else if (Number(event.target.value.substring(0, 4)) > 2023)
                  setLocalError({
                    ...localError,
                    established:
                      "The year entered must be before the current year",
                  });
                else {
                  setLocalError({
                    ...localError,
                    established: "",
                  });
                }
                setPublisher({ ...publisher, established: event.target.value });
              }}
            />
            <TextField
              id="total_copies_sold"
              label="Total Copies sold"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              error={localError.total_copies_sold ? true : false}
              helperText={localError.total_copies_sold}
              onChange={(event) => {
                if (Number(event.target.value) < 0) {
                  setLocalError({
                    ...localError,
                    total_copies_sold:
                      "The number of copies must be a positive number",
                  });
                } else if (!/^\d+$/.test(event.target.value)) {
                  setLocalError({
                    ...localError,
                    total_copies_sold: "Enter a valid number",
                  });
                } else {
                  setLocalError({
                    ...localError,
                    total_copies_sold: "",
                  });
                }
                setPublisher({
                  ...publisher,
                  total_copies_sold: Number(event.target.value),
                });
              }}
            />
            <Button type="submit">Add Publisher</Button>
          </form>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Container>
  );
};
