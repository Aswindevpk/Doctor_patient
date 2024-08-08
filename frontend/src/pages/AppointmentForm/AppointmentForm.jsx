import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import "./AppointmentForm.css";
import { api } from "../../services/api";
import { Toaster, toast } from "sonner";
import { useParams } from "react-router-dom";

const AppointmentForm = () => {
  const { id, doctor} = useParams(); 
  const navigate = useNavigate();
  const [values, setValues] = useState({
    specialty: "",
    appointment_date: "",
    start_time: "",
    doctor_id:id
  });

  const specialties = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
  ];
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate and submit form data
    try {
      const response = await api.post("/appointment/create_event/", values);
      const id = response.data.id
      if(response.status == 201){
        toast.success("Appointment Booked");
        sleep(2000)
        navigate(`/appointments/${id}`);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.error("Error during appointment booking", error);
      toast.error("Failed to book appointment");
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <form onSubmit={handleSubmit}>
        <div className="appointment-container">
          <div className="appointment">
            <h5 className="appointment__header">Book an Appointment</h5>
            <p className="doctor_detail">Doctor : {doctor}</p>

            <div className="formSelect">
              <label className="formSelect__label" htmlFor="specialty">
                Specialty
              </label>
              <select
                className="formSelect__select"
                id="specialty"
                name="specialty"
                value={values.specialty}
                onChange={onChange}
                required
              >
                <option value="" disabled>
                  Select Specialty
                </option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              <span className="formSelect__error">
                Please select a specialty.
              </span>
            </div>

            <FormInput
              id="appointment_date"
              name="appointment_date"
              type="date"
              label="Date of Appointment"
              value={values.appointment_date}
              onChange={onChange}
              required
            />

            <FormInput
              id="start_time"
              name="start_time"
              type="time"
              label="Start Time"
              value={values.start_time}
              onChange={onChange}
              required
            />

            <button className="appointment_btn" type="submit">
              Book Appointment
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AppointmentForm;
