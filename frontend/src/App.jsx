import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadSong from "./pages/UploadSong";
import SidebarAdmin from "./components/SidebarAdmin";
import ListSongs from "./pages/ListSong";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Display from "./components/Display";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";



function App() {
  const location = useLocation();
  const adminPaths = ["/add-music", "/list-songs"];
  const isAdminPage = adminPaths.includes(location.pathname);

  return (
    <>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <div className="flex relative h-screen">
        <ToastContainer position="top-right" autoClose={3000} />

        {isAdminPage ? (
          <>
            <SidebarAdmin />
            <div className="flex-1 overflow-y-scroll">
              <Routes>
                <Route path="/add-music" element={<UploadSong />} />
                <Route path="/list-songs" element={<ListSongs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </>
        ) : (
          <>
            <Sidebar />
            <div className="flex-1 bg-black overflow-y-scroll">
              <Header />
            </div>
            <div className="w-1/ bg-black hidden lg:block p-2">
              <Display />
            </div>
          </>
        )}
      </div>
    </>



  );
}

export default App;
