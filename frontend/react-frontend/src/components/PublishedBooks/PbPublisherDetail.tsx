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

export const PbPublishersDetail = () => {
  const { publisherId } = useParams();
  const [publisher, setPublisher] = useState<Publisher>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPublisher = async () => {
      console.log("book123");
      const response = await fetch(
        `${BACKEND_API_URL}/publishers/${publisherId}`
      );
      const publisher = await response.json();
      console.log(publisher);
      setPublisher(publisher);
    };
    fetchPublisher();
  }, [publisherId]);

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/published_books`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          <h1>Publisher Details</h1>
          <p>Publisher Name: {publisher?.name}</p>
          <p>Publisher Headquarter: {publisher?.headquarter}</p>
          <p>Publisher establishment date: {publisher?.established}</p>
          <p>Total Copies Sold: {publisher?.total_copies_sold}</p>
          <p>Books published:</p>
          <ul>
            {publisher?.publishing_details?.map((data: PublishedBooks) => (
              <li>
                Title: {data.book.name} by {data.book.author.first_name}{" "}
                {data.book.author.last_name} in {data.year}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardActions>
          <IconButton
            component={Link}
            sx={{ mr: 3 }}
            to={`/publishers/${publisherId}/edit`}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            component={Link}
            sx={{ mr: 3 }}
            to={`/publishers/${publisherId}/delete`}
          >
            <DeleteForeverIcon sx={{ color: "red" }} />
          </IconButton>
        </CardActions>
      </Card>
    </Container>
  );
};
