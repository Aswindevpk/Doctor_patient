import { useState } from "react";
import "./FormInput.css"

const FormInput = (props)=>{
    let [focused,setFocused] = useState(false)
    const {label,errorMessage,id,value,...inputProps} = props;
    const handleBlur =(e)=>{
        setFocused(true)
    }
    return(
        <div className="formInput">
            <label className="formInput__label">{label}</label>
            <input className="formInput__input"
            {...inputProps} 
            onBlur={handleBlur}
            focused = {focused.toString()}
            />
            <span className="formInput_error">{errorMessage}</span>
        </div>
    )
}

export default FormInput;