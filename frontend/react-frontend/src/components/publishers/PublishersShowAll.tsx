import { useEffect, useState } from "react";
import { Book } from "../../models/Book";
import { Author } from "../../models/Author";
import { Link } from "react-router-dom";
import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Toolbar,
} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { BACKEND_API_URL } from "../../constants";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Publisher } from "../../models/Publisher";

export const PublishersShowAll = () => {
  const [loading, setLoading] = useState(false);

  const [publishers, setPublishers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(1000000 / 100);

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_API_URL}/publishers/?page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        setPublishers(data);
        console.log(data);
        setLoading(false);
      });
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    setLoading(true);
    fetch(`${BACKEND_API_URL}/publishers/?page=${newPage}`)
      .then((response) => response.json())
      .then((data) => {
        setPublishers(data);
        setLoading(false);
      });
  };

  const pageNumbers = [];
  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    pageNumbers.push(i);
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      console.log(currentPage);
      setLoading(true);
      fetch(`${BACKEND_API_URL}/publishers/?page=${currentPage + 1}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(currentPage);
          setPublishers(data);
          setLoading(false);
        });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      console.log(currentPage);
      setLoading(true);
      fetch(`${BACKEND_API_URL}/publishers/?page=${currentPage - 1}`)
        .then((response) => response.json())
        .then((data) => {
          setPublishers(data);
          setLoading(false);
        });
    }
  };

  return (
    <Container>
      <h1>All publishers</h1>
      {loading && <CircularProgress />}
      {!loading && publishers.length === 0 && <p>No publishers found</p>}
      {!loading && (
        <Toolbar>
          <div>
            {currentPage > 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </button>
            )}
            {pageNumbers[0] > 1 && (
              <>
                <button onClick={() => handlePageChange(1)}>1</button>
                {pageNumbers[0] > 2 && <span>...</span>}
              </>
            )}
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && (
                  <span>...</span>
                )}
                <button onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}
            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            )}
          </div>
          {/* <IconButton
            onClick={handlePrevPage}
            style={{ marginRight: "370px" }}
            component={Link}
            sx={{ mr: 3 }}
            to={`/publishers/?page=${currentPage}`}
            disabled={currentPage === 1}
          >
            <Tooltip title="Previous">
              <ArrowBackIosIcon sx={{ color: "black" }} />
            </Tooltip>
          </IconButton> */}
          <IconButton component={Link} sx={{ mr: 0 }} to={`/publishers/add`}>
            <Tooltip title="Add a new publisher" arrow>
              <AddIcon color="primary" />
            </Tooltip>
          </IconButton>
          {/* <IconButton
            style={{ marginLeft: "370px" }}
            onClick={handleNextPage}
            component={Link}
            sx={{ mr: 3 }}
            to={`/publishers/?page=${currentPage}`}
            disabled={currentPage === totalPages}
          >
            <Tooltip title="Next">
              <ArrowForwardIosIcon sx={{ color: "black" }} />
            </Tooltip>
          </IconButton> */}
        </Toolbar>
      )}
      {!loading && publishers.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 950 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Headquarter</TableCell>
                {/* <TableCell align="right">Teacher Name</TableCell> */}
                <TableCell align="left">Established</TableCell>
                <TableCell align="left">Nr of published books</TableCell>
                <TableCell align="center">Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {publishers.map((publisher: Publisher, index) => (
                <TableRow key={publisher.id}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {publisher.name}
                  </TableCell>
                  <TableCell align="left">{publisher.headquarter}</TableCell>
                  <TableCell align="left">{publisher.established}</TableCell>
                  <TableCell align="left">{publisher.num_published}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/publishers/${publisher.id}/details`}
                    >
                      <Tooltip title="View publisher details" arrow>
                        <ReadMoreIcon color="primary" />
                      </Tooltip>
                    </IconButton>

                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/publishers/${publisher.id}/edit`}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/publishers/${publisher.id}/delete`}
                    >
                      <DeleteForeverIcon sx={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
