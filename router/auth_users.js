const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("../booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

// Task 7: Login as a registered user
// POST /customer/login  { "username": "...", "password": "..." }
// On success, stores a JWT in the session (req.session.authorization)
// and returns the token in the response body.
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send(JSON.stringify({
      message: "User successfully logged in",
      token: accessToken
    }));
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Task 8: Add / modify a book review (authenticated customer)
// PUT /customer/auth/review/:isbn?review=<text>
// Also accepts a JSON body: { "review": "<text>" }
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let review = req.query.review || req.body.review;
  let username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book with ISBN " + isbn + " not found" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review text is required (query ?review=... or JSON {\"review\": \"...\"})" });
  }

  // If the user already reviewed this book, the review is modified;
  // otherwise it is added. Either way the stored value is the new text.
  books[isbn].reviews[username] = review;
  return res.status(200).send(JSON.stringify({
    message: "The review for the book with ISBN " + isbn + " has been added/updated.",
    reviews: books[isbn].reviews
  }));
});

// Task 9: Delete a book review (authenticated customer)
// DELETE /customer/auth/review/:isbn
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book with ISBN " + isbn + " not found" });
  }
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).send(JSON.stringify({
      message: "The review for the book with ISBN " + isbn + " has been deleted.",
      reviews: books[isbn].reviews
    }));
  } else {
    return res.status(404).json({ message: "No review by user " + username + " found for ISBN " + isbn });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
