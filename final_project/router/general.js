const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const  axios= require('axios');


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});


// This route serves the actual books (Task 1)
public_users.get('/', (req, res) => {

    res.status(200).json(books);
});

// This is a separate route that uses Axios to fetch from the server
public_users.get('/axios-books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/'); // adjust port if needed
        const booksData = response.data;

        const booksArray = Object.entries(booksData).map(([isbn, details]) => ({
            isbn,
            ...details
        }));

        res.status(200).json(booksArray);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books using Axios" });
    }
});


public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

public_users.get('/axios-isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch book using Axios" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorName = req.params.author.toLowerCase();
    const temp_books = [];

    for (let key in books) {
        if (books[key].author.toLowerCase() === authorName) {
            temp_books.push({ id: key, ...books[key] });
        }
    }

    if (temp_books.length > 0) {
        return res.status(200).json(temp_books);
    } else {
        return res.status(404).json({ message: "No author found" });
    }
});

public_users.get('/axios-author/:author', async (req, res) => {
    const authorName = req.params.author.toLowerCase();

    try {
        const response = await axios.get(`http://localhost:5000/author/${authorName}`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books by author using Axios" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const titleName = req.params.title.toLowerCase();
    const title_books = [];

    for (let key in books) {
        if (books[key].title.toLowerCase() === titleName) {
            title_books.push({ id: key, ...books[key] });
        }
    }

    if (title_books.length > 0) {
        return res.status(200).json(title_books);
    } else {
        return res.status(404).json({ message: "No title found" });
    }
});

public_users.get('/axios-title/:title', async (req, res) => {
    const titleName = req.params.title.toLowerCase();

    try {
        const response = await axios.get(`http://localhost:5000/title/${titleName}`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books by title using Axios" });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const num = req.params.isbn;
    const book = books[num].reviews;
    if (book) {
        return res.status(200).json(book);
    }
    else
    {
        return res.status(404).json({message: "No review found"});
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
