import React, { useState, useRef, useEffect, useContext } from 'react';
import './ProfileDropdown.css'; // Import the CSS file
import AuthContext from '../../context/AuthContext';
import {api} from '../../services/api';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  let { logoutUser } = useContext(AuthContext);
  let [Loggeduser,setLoggedUser] =useState(null)

  useEffect(() => {
    // Fetch user data from API
    const fetchDetails = async () => {
      try {
        const response = await api.get("accounts/user-details/");
        const fetchedDetails = response.data.data;
        setLoggedUser(fetchedDetails);
      } catch (error) {
        console.error("There was an error fetching the Details!", error);
      }
    };
    fetchDetails();
  }, []);

  let profilePicUrl = Loggeduser ? `https://aswin.pythonanywhere.com/${Loggeduser.profile_pic}` : '';

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <img src={profilePicUrl} alt="Profile" className="avatar" onClick={toggleDropdown} />
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li><a href="/profile">Profile</a></li>
            <li><a onClick={handleLogout}>Logout</a></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
