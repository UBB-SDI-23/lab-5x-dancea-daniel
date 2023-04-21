import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import React from "react";
import { BooksShowAll } from "./components/books/BooksShowAll";
import { AuthorsShowAll } from "./components/authors/AuthorsShowAll";
import { BooksDetail } from "./components/books/BooksDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BooksAdd } from "./components/books/BooksAdd";
import { BookDelete } from "./components/books/BooksDelete";
import { BooksEdit } from "./components/books/BooksEdit";
import { AppHome } from "./components/App/AppHome";
import { AppMenu } from "./components/App/AppMenu";
import { AuthorsDetail } from "./components/authors/AuthorsDetail";
import { AuthorsAdd } from "./components/authors/AuthorsAdd";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AuthorsEdit } from "./components/authors/AuthorsEdit";
import { AuthorDelete } from "./components/authors/AuthorsDelete";
import { PublishersShowAll } from "./components/publishers/PublishersShowAll";
import { PublishersDetail } from "./components/publishers/PublishersDetail";
import { PublishersEdit } from "./components/publishers/PublishersEdit";
import { PublishersDelete } from "./components/publishers/PublishersDelete";
import { PublishersAdd } from "./components/publishers/PublishersAdd";
import { PublishedBooksShowAll } from "./components/PublishedBooks/PublishedBooksShowAll";
import { PbBooksDetail } from "./components/PublishedBooks/PbBookDetail";
import { PbPublishersDetail } from "./components/PublishedBooks/PbPublisherDetail";
import { PublishedBooksDetail } from "./components/PublishedBooks/PublishedBooksDetail";
import { PublishedBooksEdit } from "./components/PublishedBooks/PublishedBooksEdit";
import { PublishedBookDelete } from "./components/PublishedBooks/PublishedBookDelete";
import { PublishedBooksAdd } from "./components/PublishedBooks/PublishedBooksAdd";
import { AuthorNationalityStatistics } from "./components/statistics/AuthorNationality";
import { PublisherYearStatistics } from "./components/statistics/PublisherYear";

function App() {
  const [count, setCount] = useState(0);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <Router>
          <AppMenu />
          <Routes>
            <Route path="/" element={<AppHome />} />
            <Route path="/books/" element={<BooksShowAll />} />
            <Route path="/books/add" element={<BooksAdd />} />
            <Route path="/books/:bookId/details" element={<BooksDetail />} />
            <Route path="/books/:bookId/edit" element={<BooksEdit />} />
            <Route path="/books/:bookId/delete" element={<BookDelete />} />
            <Route path="/authors/" element={<AuthorsShowAll />} />
            <Route path="/authors/add" element={<AuthorsAdd />} />
            <Route path="/authors/:authorId/edit" element={<AuthorsEdit />} />
            <Route
              path="/authors/:authorId/delete"
              element={<AuthorDelete />}
            />
            <Route
              path="/authors/:authorId/details"
              element={<AuthorsDetail />}
            />
            <Route path="/publishers/" element={<PublishersShowAll />} />
            <Route
              path="/publishers/:publisherId/details"
              element={<PublishersDetail />}
            />
            <Route
              path="/publishers/:publisherId/edit"
              element={<PublishersEdit />}
            />
            <Route
              path="/publishers/:publisherId/delete"
              element={<PublishersDelete />}
            />
            <Route path="/publishers/add" element={<PublishersAdd />} />
            <Route
              path="/published_books/"
              element={<PublishedBooksShowAll />}
            />
            <Route
              path="/published_books/:bookId/book_details"
              element={<PbBooksDetail />}
            />
            <Route
              path="/published_books/:publisherId/publisher_details"
              element={<PbPublishersDetail />}
            />
            <Route
              path="/published_books/:bookId/:publisherId/details"
              element={<PublishedBooksDetail />}
            />
            <Route
              path="/published_books/:bookId/:publisherId/edit"
              element={<PublishedBooksEdit />}
            />
            <Route
              path="/published_books/:bookId/:publisherId/delete"
              element={<PublishedBookDelete />}
            />
            <Route
              path="/published_books/add"
              element={<PublishedBooksAdd />}
            />
            <Route
              path="/author_stats/avr-books/"
              element={<AuthorNationalityStatistics />}
            />
            <Route
              path="/publisher_stats/num-books/"
              element={<PublisherYearStatistics />}
            />
          </Routes>

          {/* <div className="App">
          <h1>Vite + React</h1>
          <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
          </button>
          <p>
          Edit <code>src/App.tsx</code> and save to test HMR
          </p>
          </div>
          <p className="read-the-docs">
          Click on the Vite and React logos to learn more
          </p>
        </div> */}
        </Router>
      </React.Fragment>
    </LocalizationProvider>
  );
}

export default App;
