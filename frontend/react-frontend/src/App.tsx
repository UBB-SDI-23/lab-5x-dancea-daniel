import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import React from "react";
import { BooksShowAll } from "./components/books/BooksShowAll";
import { BooksDetail } from "./components/books/BooksDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BooksAdd } from "./components/books/BooksAdd";
import { BookDelete } from "./components/books/BooksDelete";
import { BooksEdit } from "./components/books/BooksEdit";
import { AppHome } from "./components/App/AppHome";
import { AppMenu } from "./components/App/AppMenu";

function App() {
  const [count, setCount] = useState(0);

  return (
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
  );
}

export default App;
