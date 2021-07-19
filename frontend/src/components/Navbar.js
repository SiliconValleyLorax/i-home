import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { FiBookOpen } from "react-icons/fi";
import { FaBars, FaTimes } from "react-icons/fa";

import { Button } from "./Button";

import "../css/Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  // const closeMobileMenu=()=>setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  window.addEventListener("resize", showButton);

  return (
    <>
      <div className="navbar">
        <div className="navbar-container container">
          <Link to="/" className="navbar-logo">
            <img
              className="navbar-icon"
              src="https://static.wixstatic.com/media/c1706a_a39f342e884a436b925bf8254c2ec5c2~mv2.png/v1/fill/w_37,h_37,al_c,q_85,usm_0.66_1.00_0.01/KakaoTalk_20210426_150734182.webp"
              alt="logo"
            />
            iHome
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            {click ? (
              <FaTimes className="icons" />
            ) : (
              <FaBars className="icons" />
            )}
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-links">
                MyPage
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/uploadImage" className="nav-links">
                FindMyBooks
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-links">
                Books
              </Link>
            </li>
            <li className="nav-btn">
              {button ? (
                <Link to="/sign-up" className="btn-link" >
                  <Button buttonStyle="btn--outline">Sign Up</Button>
                </Link>
              ) : (
                <Link to="/sign-up" className="btn-link">
                  <Button buttonStyle="btn--outline" buttonSize="btn--mobile">
                    Sign Up
                  </Button>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
