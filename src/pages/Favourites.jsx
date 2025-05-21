import "../css/Favourites.css"
import { useMovieContext } from "../contexts/MovieContexts";
import MovieCard from "../Components/MovieCard";
import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch user information
    fetch("http://localhost:5000/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user information");
        }
        return response.json();
      })
      .then((data) => setUser(data))
      .catch((error) => {
        console.error(error);
        setUser(null);
      });

    // Fetch user's favourite movies
    fetch("http://localhost:5000/user/favourites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch favourite movies");
        }
        return response.json();
      })
      .then((data) => setFavourites(data))
      .catch((error) => {
        console.error(error);
        setFavourites([]);
      });
  }, []);

  return (
    <div className="profile">
      {user && (
        <div className="user-info">
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
        </div>
      )}

      <div className="favourites">
        <h2>Your Favourites</h2>
        <div className="movies-grid">
          {favourites.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
