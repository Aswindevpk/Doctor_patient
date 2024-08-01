import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import "./PatientDashboard.css";
import api from "../../services/api";


const PatientDashboard = () => {
  let { logoutUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from API
    const fetchDetails = async () => {
      try {
        const response = await api.get("accounts/user-details/");
        const fetchedDetails = response.data.data;
        console.log(fetchDetails)
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

  let profilePicUrl = user ? `http://localhost:8000${user.profile_pic}` : '';

  if (!user) return <div>Loading...</div>;
  return (
    <div className="container">
      <h1 className="dashboard-header">Patient Dashboard</h1>
      <div className="user-details">
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
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default PatientDashboard;
