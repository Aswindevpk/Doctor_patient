import React, { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import  FormInput  from '../../components/FormInput/FormInput';
import "./Login.css";
import { Toaster, toast } from "sonner";

const Login = () => {
  let { loginUser } = useContext(AuthContext);

  const navigate = useNavigate();
  let [values, setValues] = useState({
    username: "",
    password: "",
    error: "",
    user_type:'patient',
    info: ""
  });

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
    let response = await loginUser(values.username, values.password,values.user_type);
    if (response) {
      if (response.status == 200) {
        console.log(response)
      } else {
        setValues({ ...values, error: response.message })
      }
    }
  };


  const handleRegister = () => {
    navigate('/register')
  };

  let onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleChange = (e) => {
    const { value } = e.target;
    setValues({
      ...values,
      user_type: value,
    });
  };

  return (
    <div className='login'>
      <Toaster richColors position="top-center" />
      <h2 className='login__header'>Login to Your Account</h2>
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
        <button className='login__btn' type="submit">Login</button>
      </form>
      <p className='login__register-cta' >Don't have an account? <a onClick={handleRegister}>Sign up</a></p>
    </div>
  );
};

export default Login;
