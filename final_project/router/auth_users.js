const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Enter username and password" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ data: username }, "secret_key");
    req.session.authorization = { token, username };
    return res.status(200).json({ message: "Logged In" });
  }

  return res.status(404).json({ message: "Username or password is incorrect" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.body.username;
  const user = users.find((user) => user.username === username);
  const book = books[isbn];

  if (user && book) {
    book.reviews[username] = review;
    return res.status(200).json({
      message: `review for the book item with isbn ${isbn} has been added.`,
    });
  }
  return res
    .status(300)
    .json({ message: "Either username or book do not exist" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.body.username;
  const book = books[isbn];

  if (book && book.reviews && book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({
      message: `review for the book item with isbn ${isbn} posted by user ${username} has been deleted.`,
    });
  }
  return res
    .status(404)
    .json({ message: "Either book or review do not exist" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
