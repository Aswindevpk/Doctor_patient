import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import "./Register.css";

const Register = () => {
  let { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    role: "patient", // Default role
    error: [],
  });

  const [image, setImage] = useState(null);

  const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              setImage(e.target.result);
          };
          reader.readAsDataURL(file);
      }
  };

  const basic_inputs = [
    {
      id: 1,
      name: "firstname",
      type: "text",
      placeholder: "",
      pattern: "^[a-zA-Z0-9]{3,16}$",
      errorMessage: "First Name must be alphanumeric and 3-16 characters long",
      label: "First Name",
      required: true,
    },
    {
      id: 2,
      name: "lastname",
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
      id: 3,
      name: "state",
      type: "text",
      placeholder: "",
      pattern: "^[a-zA-Z0-9]{3,16}$",
      errorMessage: "state must be alphanumeric and 3-16 characters long",
      label: "State",
      required: true,
    },
    {
      id: 3,
      name: "pincode",
      type: "text",
      placeholder: "",
      pattern: "^[0-9]{6}$",
      errorMessage: "pincode must be numeric and 6 characters long",
      label: "Pincode",
      required: true,
    },
    {
      id: 5,
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
      id: 6,
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
    setValues({ ...values, error: [] });
    let response = await registerUser(
      values.username,
      values.email,
      values.password
    );
    if (response) {
      console.log(response);
      let errorMessages = [];

      for (let field in response.message) {
        if (response.message.hasOwnProperty(field)) {
          response.message[field].forEach((error) => {
            errorMessages.push(error);
          });
        }
      }

      setValues({ ...values, error: errorMessages });
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...value,
      [name]: value,
    });
  };

  return (
    <>
      <form className="register" onSubmit={handleSubmit}>
        <div className="register-left">
          <h5 className="register__header">Register to Med</h5>
          <h5 className="selection_header">Register as</h5>
          <div className="role-selection-container">
            <label>
              <input
                type="radio"
                name="role"
                value="doctor"
                checked={values.role === "doctor"}
                onChange={handleChange}
              />
              <div className="role-option">Doctor</div>
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="patient"
                checked={values.role === "patient"}
                onChange={handleChange}
              />
              <div className="role-option">Patient</div>
            </label>
          </div>
          <h5 className="selection_header">Basic Details</h5>
          {values.error && <p className="forgotPass__error">{values.error}</p>}
          {basic_inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
            />
          ))}
          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture:</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="image-preview">
              {image && <img src={image} alt="Profile Preview" />}
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
      </form>
    </>
  );
};

export default Register;
