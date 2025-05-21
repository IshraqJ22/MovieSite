import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const storedFavs = localStorage.getItem("favourites");
    if (storedFavs) setFavourites(JSON.parse(storedFavs));
  }, []);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const addToFavourites = (movie) => {
    console.log("Movie object being added to favourites:", movie); // Log the movie object for debugging
    setFavourites((prev) => [...prev, movie]);

    // Send the movie to the backend to store in the database
    const token = localStorage.getItem("token");
    console.log("Token being sent in Authorization header:", token); // Log the token for debugging

    // Check if the token exists before making the request
    if (!token) {
      console.error("Token is missing. Please log in again.");
      return;
    }

    // Log the token format for debugging
    console.log("Formatted Authorization header:", `Bearer ${token}`);

    fetch("http://localhost:5000/favourites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movie_id: movie.id }), // Use TMDb `id` as `movie_id`
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add favourite movie to the database");
        }
        console.log("Favourite movie added to the database successfully");
      })
      .catch((error) => {
        console.error("Error adding favourite movie to the database:", error);
      });
  };

  const removeFromFavourites = (movieID) => {
    setFavourites((prev) => prev.filter((movie) => movie.id !== movieID));
  };

  const isFavourite = (movieID) => {
    return favourites.some((movie) => movie.id === movieID);
  };

  const value = {
    favourites,
    addToFavourites,
    removeFromFavourites,
    isFavourite,
  };

  return (
    <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
  );
};
