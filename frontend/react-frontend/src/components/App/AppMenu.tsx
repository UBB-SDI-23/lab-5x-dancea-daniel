import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";

export const AppMenu = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ marginBottom: "20px" }}>
        <Toolbar>
          <IconButton
            component={Link}
            to="/"
            size="large"
            edge="start"
            color="inherit"
            aria-label="school"
            sx={{ mr: 2 }}
          >
            <SchoolIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ mr: 5 }}>
            Books management
          </Typography>
          <Button
            variant={path.startsWith("/books") ? "outlined" : "text"}
            to="/books"
            component={Link}
            color="inherit"
            sx={{ mr: 5 }}
            startIcon={<LocalLibraryIcon />}
          >
            Books
          </Button>
          <Button
            variant={path.startsWith("/authors") ? "outlined" : "text"}
            to="/authors"
            component={Link}
            color="inherit"
            sx={{ mr: 5 }}
            startIcon={<LocalLibraryIcon />}
          >
            Authors
          </Button>
          <Button
            variant={path.startsWith("/publishers") ? "outlined" : "text"}
            to="/publishers"
            component={Link}
            color="inherit"
            sx={{ mr: 5 }}
            startIcon={<LocalLibraryIcon />}
          >
            Publishers
          </Button>
          <Button
            variant={path.startsWith("/published_books") ? "outlined" : "text"}
            to="/published_books"
            component={Link}
            color="inherit"
            sx={{ mr: 5 }}
            startIcon={<LocalLibraryIcon />}
          >
            Published Books
          </Button>
          <Button
            variant={
              path.startsWith("/author_stats/avr-books") ? "outlined" : "text"
            }
            to="/author_stats/avr-books"
            component={Link}
            color="inherit"
            sx={{ mr: 5 }}
            startIcon={<LocalLibraryIcon />}
          >
            Authors Statistics
          </Button>
          <Button
            variant={
              path.startsWith("/publisher_stats/num-books")
                ? "outlined"
                : "text"
            }
            to="/publisher_stats/num-books"
            component={Link}
            color="inherit"
            sx={{ mr: 5 }}
            startIcon={<LocalLibraryIcon />}
          >
            Publishers Statistics
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
