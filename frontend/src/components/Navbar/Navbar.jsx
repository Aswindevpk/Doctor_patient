import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { write } from "../../assets";
import AuthContext from "../../context/AuthContext";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";

const Navbar = () => {
  let { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-container-left">
          <div onClick={() => handleNavigation("/")} className="navbar-logo">
            MedConnect
          </div>
        </div>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              {user.user_type === "doctor" ? (
                <div
                  className="navbar-item"
                  onClick={() => handleNavigation("/write")}
                >
                  <img className="navbar-item-write" src={write}></img>
                  <span className="navbar-item-name">Write</span>
                </div>
              ) : (
                <></>
              )}
              <div className="navbar-item">
                <ProfileDropdown />
              </div>
            </>
          ) : (
            <>
              <div
                className="navbar-item"
                onClick={() => handleNavigation("/login")}
              >
                Sign In
              </div>
              <div
                className="navbar-item navbar-signup"
                onClick={() => handleNavigation("/register")}
              >
                Get Started
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
