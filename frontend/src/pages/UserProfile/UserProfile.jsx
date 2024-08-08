import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import {api} from "../../services/api";
import './UserProfile.css'

const DoctorDashboard = () => {
  let { logoutUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from API
    const fetchDetails = async () => {
      try {
        const response = await api.get("accounts/user-details/");
        const fetchedDetails = response.data.data;
        setUser(fetchedDetails);
      } catch (error) {
        console.error("There was an error fetching the Details!", error);
      }
    };
    fetchDetails();
  }, []);

  const handleLogout = () => {
    logoutUser();
  };

  let profilePicUrl = user ? `https://aswin.pythonanywhere.com/${user.profile_pic}` : '';
  if (!user) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="user-details">
      <h1 className="dashboard-header">{user.user_type} Profile</h1>
      <img className="user_profile-pic" src={profilePicUrl} alt="profile" />
        <h2>
          {user.first_name} {user.last_name}
        </h2>
        <p className="user-detail">Email: {user.email}</p>
        <p className="user-detail">User Type: {user.user_type}</p>
        <div className="address-section">
          <h3>Address</h3>
          <p className="address-detail">{user.address.line1}</p>
          <p className="address-detail">
            {user.address.city}, {user.address.state} - {user.address.pincode}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
