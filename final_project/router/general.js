const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (isValid(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    registerUser(username, password);
  
    return res.status(200).json({ message: "User registered successfully" });
  });
  
  // Placeholder function to register a new user
  function registerUser(username, password) {
    // Assuming users is an object with usernames as keys and passwords as values
    users.push({ username, password });
  }
  
  
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
      resolve(JSON.stringify(books, null, 4));
    })
      .then((bookList) => {
        res.send(bookList);
      })
      .catch((error) => {
        res.status(500).json({ message: "Error retrieving book list" });
      });
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    const getBookDetails = new Promise((resolve, reject) => {
      if (books.hasOwnProperty(isbn)) {
        resolve(books[isbn]);
      } else {
        reject({ message: "Book not found" });
      }
    });
  
    getBookDetails
      .then((bookDetails) => {
        res.send(bookDetails);
      })
      .catch((error) => {
        res.status(404).json(error);
      });
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];
  
    const getMatchingBooks = new Promise((resolve, reject) => {
      // Iterate through the books and check for matching author
      Object.keys(books).forEach((key) => {
        const book = books[key];
        if (book.author === author) {
          matchingBooks.push(book);
        }
      });
  
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject({ message: "No books found for the author" });
      }
    });
  
    getMatchingBooks
      .then((books) => {
        res.send(books);
      })
      .catch((error) => {
        res.status(404).json(error);
      });
  });
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];
  
    const getMatchingBooks = new Promise((resolve, reject) => {
      // Iterate through the books and check for matching title
      Object.keys(books).forEach((key) => {
        const book = books[key];
        if (book.title === title) {
          matchingBooks.push(book);
        }
      });
  
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject({ message: "No books found with the given title" });
      }
    });
  
    getMatchingBooks
      .then((books) => {
        res.send(books);
      })
      .catch((error) => {
        res.status(404).json(error);
      });
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      const reviews = book.reviews;
      res.send(reviews);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
