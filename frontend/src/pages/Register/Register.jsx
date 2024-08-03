import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import "./Register.css";
import { formApi } from "../../services/api";
import { Toaster, toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    user_type: "patient", // Default role
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
    confirmpassword: "",
    error: [],
    profile_pic: null,
  });
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [imageurl, setImageurl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageurl(URL.createObjectURL(event.target.files[0]));
      setValues({ ...values, profile_pic: file });
    }
  };

  const basic_inputs = [
    {
      id: 1,
      name: "first_name",
      type: "text",
      placeholder: "",
      pattern: "^[a-zA-Z0-9]{3,16}$",
      errorMessage: "First Name must be alphanumeric and 3-16 characters long",
      label: "First Name",
      required: true,
    },
    {
      id: 2,
      name: "last_name",
      type: "text",
      placeholder: "",
      pattern: "^[a-zA-Z0-9]{3,16}$",
      errorMessage: "Last Name must be alphanumeric and 3-16 characters long",
      label: "Last Name",
      required: true,
    },
    {
      id: 3,
      name: "username",
      type: "text",
      placeholder: "",
      pattern: "^[a-zA-Z0-9]{3,16}$",
      errorMessage: "Username must be alphanumeric and 3-16 characters long",
      label: "Username",
      required: true,
    },
    {
      id: 4,
      name: "email",
      type: "email",
      placeholder: "",
      errorMessage: "Enter a valid email address.",
      label: "Email",
      required: true,
    },
  ];

  const other_inputs = [
    {
      id: 5,
      name: "line1",
      type: "text",
      placeholder: "",
      pattern: "^[a-zA-Z0-9]{3,16}$",
      errorMessage: "Line must be alphanumeric and 3-16 characters long",
      label: "Line 1",
      required: true,
    },
    {
      id: 6,
      name: "city",
      type: "text",
      placeholder: "",
      pattern: "^[a-zA-Z0-9]{3,16}$",
      errorMessage: "City must be alphanumeric and 3-16 characters long",
      label: "City",
      required: true,
    },
    {
      id: 7,
      name: "state",
      type: "text",
      placeholder: "",
      pattern: "^[a-zA-Z0-9]{3,16}$",
      errorMessage: "state must be alphanumeric and 3-16 characters long",
      label: "State",
      required: true,
    },
    {
      id: 8,
      name: "pincode",
      type: "text",
      placeholder: "",
      pattern: "^[0-9]{6}$",
      errorMessage: "pincode must be numeric and 6 characters long",
      label: "Pincode",
      required: true,
    },
    {
      id: 9,
      name: "password",
      type: "password",
      placeholder: "",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      errorMessage:
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character",
      label: "Password",
      required: true,
    },
    {
      id: 10,
      name: "confirmpassword",
      type: "password",
      placeholder: "",
      pattern: values.password,
      errorMessage: "password not matching.",
      label: "Confirm password",
      required: true,
    },
  ];

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setting error to null
    setValues({ ...values, error: [] });
    // creating formdata for sent images/text
    const data = new FormData();
    data.append("user_type", values.user_type);
    data.append("first_name", values.first_name);
    data.append("last_name", values.last_name);
    data.append("username", values.username);
    data.append("email", values.email);
    data.append("password", values.password);
    data.append("profile_pic", values.profile_pic);
    //address section
    data.append("address.line1", values.line1);
    data.append("address.city", values.city);
    data.append("address.state", values.state);
    data.append("address.pincode", values.pincode);

    //sending the data
    try {
      const response = await formApi.post("/accounts/register/", data);
      toast.success('User Created')
      await sleep(3000); 
      navigate("/login");
    } catch (error) {
      if (error.response) {
        let response = error.response.data;
        let errorMessages = [];
        for (let field in response.message) {
          if (response.message.hasOwnProperty(field)) {
            response.message[field].forEach((error) => {
              errorMessages.push(error);
            });
          }
        }
        console.log(errorMessages);
        setValues({ ...values, error: errorMessages });
      }
      console.error("Error during registration", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setValues({
      ...values,
      user_type: value,
    });
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <form onSubmit={handleSubmit}>
        <div className="register-container">
          <div className="register">
            <div className="register-left">
              <h5 className="register__header">Register to Med</h5>
              <h5 className="selection_header">Register as</h5>
              <div className="role-selection-container">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={values.user_type === "doctor"}
                    onChange={handleChange}
                  />
                  <div className="role-option">Doctor</div>
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={values.user_type === "patient"}
                    onChange={handleChange}
                  />
                  <div className="role-option">Patient</div>
                </label>
              </div>
              <h5 className="selection_header">Basic Details</h5>
              {values.error && (
                <p className="Register__error">{values.error}</p>
              )}
              {basic_inputs.map((input) => (
                <FormInput
                  key={input.id}
                  {...input}
                  value={values[input.name]}
                  onChange={onChange}
                />
              ))}
              <label className="profile_img-label" htmlFor="profilePicture">
                Profile Picture
              </label>
              <div className="profile_img">
                <div className="image-preview">
                  {imageurl && <img src={imageurl} alt="Profile Preview" />}
                </div>
                <div className="profile-select">
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="profilePicture" id="fileLabel">
                    Upload Profile Pic
                  </label>
                </div>
              </div>
            </div>
            <div className="register-right">
              <h5 className="selection_header">Address</h5>
              {other_inputs.map((input) => (
                <FormInput
                  key={input.id}
                  {...input}
                  value={values[input.name]}
                  onChange={onChange}
                />
              ))}
            </div>
          </div>
          <div className="register-cta">
            <p className="register__login-cta">
              By creating an account you agree with our <a>Terms of Service</a>,
              <br></br> <a>Privacy Policy</a>, and our default{" "}
              <a>Notification Settings.</a>{" "}
            </p>
            <button className="register_btn" type="submit">
              Create account
            </button>
            <p className="register__login-cta" onClick={handleLogin}>
              Already have an Account ? <a>Log In</a>
            </p>
          </div>
        </div>
      </form>
    </>
  );
};

export default Register;
