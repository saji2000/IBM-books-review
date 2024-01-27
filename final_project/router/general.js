const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const password = req.body.password;
  const username = req.body.username;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password cannot be empty" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username is already taken" });
  }
  users.push({ username, password });

  return res.status(200).json({ message: "user registered" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Promise resolved");
    }, 2000);
  });

  myPromise.then((successMessage) => {
    console.log("callback " + successMessage);
    res.send(JSON.stringify({ books }));
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Promise resolved");
    }, 2000);
  });

  myPromise.then((successMessage) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Promise resolved");
    }, 2000);
  });

  myPromise.then((successMessage) => {
    const authorName = req.params.author;
    const booksByAuthor = Object.values(books).filter(
      (book) => book.author.toLowerCase() === authorName.toLowerCase()
    );

    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  });
});

public_users.get("/title/:title", function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Promise resolved");
    }, 2000);
  });

  myPromise.then((successMessage) => {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );

    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res
        .status(404)
        .json({ message: "No books found with this title" });
    }
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    if (Object.keys(book.reviews).length === 0) {
      // If reviews object is empty, send a custom message
      return res.status(200).json({ message: "No reviews available" });
    } else {
      // Return the reviews if they exist
      return res.status(200).json(book.reviews);
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
