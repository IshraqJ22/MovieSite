import express from "express";
import mysql from "mysql2";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "a_secure_random_key_12345"; // Updated with a secure key

// Default route for the root path
app.get("/", (req, res) => {
  res.send("Welcome to the Movie Media API!");
});

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Xribmssjrx22",
  database: "moviesite",
});

// Enhanced database connection logging
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Test endpoint to check database connection
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, results) => {
    if (err) {
      console.error("Database test failed:", err);
      return res.status(500).json({ message: "Database connection failed." });
    }
    res.json({ message: "Database is connected and accessible." });
  });
});

// API to fetch movies
app.get("/movies", (req, res) => {
  const query = "SELECT * FROM Movies";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Enhanced logging for token verification
const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader); // Log the Authorization header

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Missing or invalid Authorization header.");
    return res.status(401).json({ message: "Unauthorized: Missing or invalid token." });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token); // Log the extracted token

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message); // Log the error message
      console.error("Token verification error details:", err); // Log the full error object
      return res.status(403).json({ message: "Forbidden: Invalid token." });
    }
    console.log("Decoded user from token:", user); // Log the decoded user
    req.user = user; // Attach user info to the request
    next();
  });
};

// Temporary endpoint to test jwtMiddleware
app.get("/test-auth", jwtMiddleware, (req, res) => {
  res.json({ message: "Middleware test successful", user: req.user });
});

// Apply jwtMiddleware to the /favourites route
app.post("/favourites", jwtMiddleware, (req, res) => {
  if (!req.user) {
    console.error("User information is missing in the request.");
    return res.status(401).json({ message: "Unauthorized: User information is missing." });
  }

  const user_id = req.user.id; // Extract user ID from JWT payload
  const { movie_id } = req.body;

  // Log the incoming data for debugging
  console.log("Request body received in /favourites endpoint:", req.body); // Log the request body
  console.log("User ID:", user_id, "Movie ID:", movie_id); // Log the user ID and movie ID
  console.log("Middleware executed for endpoint:", req.originalUrl); // Log the endpoint being accessed

  const query = "INSERT INTO Favourites (user_id, movie_id) VALUES (?, ?)";
  db.query(query, [user_id, movie_id], (err, results) => {
    if (err) {
      console.error("Error adding favourite movie:", err);
      console.error("Query:", query);
      console.error("Parameters:", { user_id, movie_id });
      return res.status(500).send(err);
    }
    console.log("Favourite added successfully for user ID:", user_id, "Movie ID:", movie_id);
    console.log("Database response:", results);
    res.json({ message: "Favourite added successfully!" });
  });
});

// Enhanced logging for debugging `/register` endpoint
app.post("/register", (req, res) => {
  console.log("Incoming registration request:", req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    console.error("Missing required fields for registration:", req.body);
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";
  db.query(query, [username, email, password], (err, results) => {
    if (err) {
      console.error("Error during user registration:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
    console.log("User registered successfully:", results);
    res.json({ message: "User registered successfully!" });
  });
});

// Enhanced logging for debugging `/login` endpoint
app.post("/login", (req, res) => {
  console.log("Incoming login request:", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    console.error("Missing email or password for login:", req.body);
    return res.status(400).json({ message: "Email and password are required." });
  }

  const query = "SELECT * FROM Users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Error during user login:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
    if (results.length > 0) {
      const user = results[0];
      console.log("Login successful for user:", user);
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" }); // Ensure the token includes the user ID and username
      res.json({ message: "Login successful!", token });
    } else {
      console.warn("Invalid login attempt for email:", email);
      res.status(401).json({ message: "Invalid email or password." });
    }
  });
});

// API to logout a user
app.post("/logout", (req, res) => {
  // For simplicity, just send a success message
  res.json({ message: "Logout successful!" });
});

// Add logging and error handling for missing `req.user`
app.get("/user", (req, res) => {
  if (!req.user) {
    console.error("User information is missing in the request.");
    return res.status(401).json({ message: "Unauthorized: User information is missing." });
  }

  console.log("Fetching user information for user ID:", req.user.id);
  const userId = req.user.id; // Extract user ID from JWT payload
  const query = "SELECT id, username, email FROM Users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user information:", err);
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "User not found." });
    }
  });
});

// Add logging and error handling for missing `req.user`
app.get("/user/favourites", (req, res) => {
  if (!req.user) {
    console.error("User information is missing in the request.");
    return res.status(401).json({ message: "Unauthorized: User information is missing." });
  }

  console.log("Fetching favourites for user ID:", req.user.id);
  const userId = req.user.id; // Extract user ID from JWT payload
  const query = `
    SELECT Movies.id, Movies.title, Movies.release_date, Movies.poster_path
    FROM Favourites
    JOIN Movies ON Favourites.movie_id = Movies.id
    WHERE Favourites.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching favourites:", err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
