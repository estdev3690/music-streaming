import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import PlayerContextProvider from "./context/PlayerContext.jsx";
createRoot(document.getElementById("root")).render(
  <PlayerContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PlayerContextProvider>
);
