import "../css/Favourites.css"
import { useMovieContext } from "../contexts/MovieContexts";
import MovieCard from "../Components/MovieCard";

function Favourites() {

    const{favourites} = useMovieContext();

    if(favourites){
      return <div className="favourites">
            <h2>Your Favourites</h2>
        <div className="movies-grid">
        {favourites.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
      </div>
    }

  return (
    <div className="favourites-empty">
      <h2>No Favourite movies</h2>
      <p>Add Favourites by clickng ♥</p>
    </div>
  );
}

export default Favourites;
