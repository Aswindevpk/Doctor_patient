import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import { Toaster, toast } from "sonner";
import "./AppointmentDetails.css";

const AppointmentDetails = () => {
  const { id } = useParams(); // Retrieve the appointment ID from the URL
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await api.get(`/appointment/${id}/`); // Replace with your API endpoint
        setAppointment(response.data.data);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        toast.error("Failed to fetch appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!appointment) return <p>No appointment details available.</p>;

  const formatDate = (isoDateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (isoDateString) => {
    const date = new Date(isoDateString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };

  return (
    <div className="appointment-details">
      <header className="appointment-details__header">
        <h1>Appointment Details</h1>
      </header>
      <main className="appointment-details__content">
        <h2>Doctor: Dr. {appointment.doctor_name}</h2>
        <p><strong>Specialty:</strong> {appointment.specialty}</p>
        <p><strong>Date:</strong> {formatDate(appointment.start_datetime)}</p>
        <p><strong>Start Time:</strong> {formatTime(appointment.start_datetime)}</p>
        <p><strong>End Time:</strong> {formatTime(appointment.end_datetime)}</p>
      </main>
    </div>
  );
};

export default AppointmentDetails;
