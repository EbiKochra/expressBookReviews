const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if the username exists in the users array
    return users.some((user) => user.username === username);
  };

const authenticateUser = (username, password) => {
    // Check if the username and password match the records
    return users.some((user) => user.username === username && user.password === password);
  };

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // Check if the username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username and password match
    if (authenticateUser(username, password)) {

      // Set the username in req.user
      req.user = { username: username };
      // Generate a JWT token
      const token = jwt.sign({ username }, "access");

      // Set the authorization information in the session
      req.session.authorization = {
        accessToken: token
      };
      return res.status(200).json({ message: "Login successful" , token});
    }
  
    return res.status(401).json({ message: "Invalid username or password" });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username; // Assuming the username is stored in the req.user object after authentication
  
    if (!review) {
      return res.status(400).json({ message: "Review content is required" });
    }
  
    if (!books.hasOwnProperty(isbn)) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews) {
      books[isbn].reviews = [];
    }
  
    const existingReviewIndex = books[isbn].reviews.findIndex((r) => r.username === username);
  
    if (existingReviewIndex > -1) {
      // Modify existing review
      books[isbn].reviews[existingReviewIndex].review = review;
      return res.status(200).json({ message: "Review modified successfully" });
    } else {
      // Add new review
      const newReview = {
        username: username,
        review: review,
      };
      books[isbn].reviews.push(newReview);
      return res.status(200).json({ message: "Review added successfully" });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
