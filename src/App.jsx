import "./css/App.css";
import Favourites from "./pages/Favourites";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Favourites";
import { Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import { MovieProvider } from "./contexts/MovieContexts";

function App() {
  return (
    <MovieProvider>
      <NavBar/>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;
