const express = require('express');
let books = require("../booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
// POST /register  { "username": "...", "password": "..." }
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get the book list available in the shop
// GET /
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
// GET /isbn/:isbn
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn], null, 4));
});

// Task 3: Get book details based on author
// GET /author/:author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let filtered_books = {};
  let count = 0;
  for (let key in books) {
    if (books[key].author === author) {
      filtered_books[count] = books[key];
      count++;
    }
  }
  res.send(JSON.stringify(filtered_books, null, 4));
});

// Task 4: Get all books based on title
// GET /title/:title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let filtered_books = {};
  let count = 0;
  for (let key in books) {
    if (books[key].title === title) {
      filtered_books[count] = books[key];
      count++;
    }
  }
  res.send(JSON.stringify(filtered_books, null, 4));
});

// Task 5: Get book review
// GET /review/:isbn
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

// --- Tasks 10-13: the same lookups using async / Promise-based functions ---
// These are used by the lab's client-side async tasks and demonstrate
// Promise + async/await access to the same catalog.

function getBooks() {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  });
}

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found for ISBN " + isbn);
    }
  });
}

function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    let filtered = {};
    let count = 0;
    for (let key in books) {
      if (books[key].author === author) {
        filtered[count] = books[key];
        count++;
      }
    }
    if (count > 0) {
      resolve(filtered);
    } else {
      reject("No books found for author " + author);
    }
  });
}

function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    let filtered = {};
    let count = 0;
    for (let key in books) {
      if (books[key].title === title) {
        filtered[count] = books[key];
        count++;
      }
    }
    if (count > 0) {
      resolve(filtered);
    } else {
      reject("No books found for title " + title);
    }
  });
}

// Task 10: Get all books — async callback / Promise
public_users.get('/async/books', async function (req, res) {
  try {
    const result = await getBooks();
    res.send(JSON.stringify(result, null, 4));
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Task 11: Search by ISBN — async
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const result = await getBookByISBN(req.params.isbn);
    res.send(JSON.stringify(result, null, 4));
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Task 12: Search by author — async
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const result = await getBooksByAuthor(req.params.author);
    res.send(JSON.stringify(result, null, 4));
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Task 13: Search by title — async
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const result = await getBooksByTitle(req.params.title);
    res.send(JSON.stringify(result, null, 4));
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

module.exports.general = public_users;
module.exports.getBooks = getBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
