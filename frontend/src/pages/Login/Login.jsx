import React, { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import  FormInput  from '../../components/FormInput/FormInput';
import "./Login.css";

const Login = () => {
  let { loginUser } = useContext(AuthContext);

  const navigate = useNavigate();
  let [values, setValues] = useState({
    username: "",
    password: "",
    error: "",
    role:'patient',
    info: ""
  });
  let [isEmailVerified, setEmailVerified] = useState(true);
  let [email, setEmail] = useState(null)

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "",
      pattern: "^[a-zA-Z0-9]{3,16}$",
      errorMessage: "Username must be alphanumeric and 3-16 characters long",
      label: "Username",
      required: true
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      errorMessage: "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character",
      label: "Password",
      required: true
    }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, error: "" })
    let response = await loginUser(values.username, values.password);
    if (response) {
      if (!response.verified) {
        setEmailVerified(false)
        setEmail(response.email)
      } else {
        setValues({ ...values, error: response.message })
      }
    }
  };


  const handleRegister = () => {
    navigate('/register')
  };

  const handleForgotPass = () => {
    navigate('/forgot-password')
  };

  const handleVerifyEmail = () => {
    navigate(`/verify-otp?email=${encodeURIComponent(email)}`)
  };

  let onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...value,
      [name]: value,
    });
  };


  return (
    <div className='login'>
      <h2 className='login__header'>Login to Med</h2>
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
      <form onSubmit={handleSubmit}>
        {values.error && (
          <p className="login__error">{values.error}</p>
        )}
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        {!isEmailVerified && (<p className='login__notVerified'>Email not verified.<a onClick={handleVerifyEmail} >Verify Now ?</a></p>)}

        <p className='login__forgotpass-cta' onClick={handleForgotPass}>Forgot ?</p>
        <button className='login__btn' type="submit">Login</button>
      </form>
      <p className='login__register-cta' >Don't have an account? <a onClick={handleRegister}>Sign up</a></p>
    </div>
  );
};

export default Login;
