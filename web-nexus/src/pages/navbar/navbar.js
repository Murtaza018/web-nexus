import React from 'react';
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import CollectionsIcon from '@mui/icons-material/Collections';
import BookIcon from '@mui/icons-material/Book';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
const Navbar = () => {
    const navigate=useNavigate();
    const Logout = () => {
        localStorage.removeItem("user")
        localStorage.setItem("loggedIn", false)
        window.location.reload();
      }
      const toggleMenu = () => {
        setMenuOpen(!menuOpen);
      };
      
        const [menuOpen, setMenuOpen] = useState(true);
  return (
    <div>
      <header>
        <div className={`main-container-TD ${menuOpen ? 'menu-open' : ''}`}>
          <div className="hamburger-menu-TD">
            <nav className={`menu-TD ${menuOpen ? 'open-TD' : ''}`}>
              <ul>
                <li>
                  <button
                    className="button-TD active"
                    onClick={() => navigate("/")}
                  >
                    <HomeIcon />
                    Home
                  </button>
                </li>
                <li>
                  <button
                    className="button-TD"

                    onClick={() => {
                      if (localStorage.getItem("loggedIn") === "true") { navigate("/Gallery") } else {
                        window.alert("Sign Up/Sign In first")
                      }
                    }}
                  >
                    <CollectionsIcon />
                    Gallery
                  </button>
                </li>
                <li>
                  <button
                    className="button-TD"
                    onClick={() => {
                      if (localStorage.getItem("loggedIn") === "true") { navigate("/Blog") } else {
                        window.alert("Sign Up/Sign In first")
                      }
                    }}
                  >
                    <BookIcon />
                    Blogs
                  </button>
                </li>
                <li>
                  <button
                    className="button-TD"
                    onClick={() => {
                      if (localStorage.getItem("loggedIn")  === "true") { navigate("/Recipe") } else {
                        window.alert("Sign Up/Sign In first")
                      }
                    }}
                  >
                    <MenuBookIcon />
                    Recipe Book
                  </button>
                </li>
                <li>
                  <button
                    className="button-TD"
                    onClick={() => {
                      if (localStorage.getItem("loggedIn") === "true") { navigate("/Contact") } else {
                        window.alert("Sign Up/Sign In first")
                      }
                    }}
                  >
                    <LocalPhoneIcon />
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    className="button-TD"
                    onClick={() => navigate("/signup")}
                  >
                    <LogoutIcon />
                    Sign Up
                  </button>
                </li>
                <li>
                  <button
                    className="button-TD"
                    onClick={() => navigate("/signin")}
                  >
                    <LogoutIcon />
                    Sign In
                  </button>
                </li>
                <li>
                  <button
                    className="button-TD"
                    onClick={Logout}
                  >
                    <LogoutIcon />
                    Log Out
                  </button>
                </li>
                
              </ul>
            </nav>
          </div>
        </div>
      </header>

    </div>
  );
}

export default Navbar;
