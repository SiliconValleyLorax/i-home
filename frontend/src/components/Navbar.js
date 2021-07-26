import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  const imgUrl = "/ihome-logo.png";

  window.addEventListener("resize", showButton);

  return (
    <>
      <div className="navbar">
        <div className="navbar-container container">
          <Link to="/" className="navbar-logo">
            <img src={imgUrl} alt="main" className="main-image" />
            아이홈 잉글리시
          </Link>
          {/* <Link to="/" className="navbar-logo">
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
                <Link to="/sign-up" className="btn-link">
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
          </ul> */}
        </div>
      </div>
    </>
  );
}

export default Navbar;
