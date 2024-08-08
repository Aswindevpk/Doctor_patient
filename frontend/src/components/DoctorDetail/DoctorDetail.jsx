import React from "react";
import "./DoctorDetail.css";
import { useNavigate } from "react-router-dom";

const DoctorDetail = ({ doctor }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/appointment-form/${doctor.id}/${doctor.username}`);
  };
  let profilePicUrl = doctor ? `https://aswin.pythonanywhere.com/${doctor.profile_pic}` : '';
  return (
    <div className="DoctorDetail">
      <img className="DoctorDetail__img" src={profilePicUrl} alt="img"></img>
      <div className="DoctorDetail__main">
        <h6 className="DoctorDetail__main-name">{doctor.username}</h6>
      </div>
      <button onClick={handleButtonClick} className='DoctorDetail__btn'>Book Appointment</button>
    </div>
  );
};

export default DoctorDetail;
