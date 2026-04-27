import React from "react";
import './LoginSignup.css';
const LoginSignup = () => {
    return(
      <div className='container'>
        <div className="header">
         <div className='text'>Sign up</div>
         <div className='underline'></div>
      </div>
      <div className="inputs">
        <div className='input'>
        <input type="text"/>
      </div>
      <div className="input">
      
        <input type="email"/>
      </div>
       
      <div className='input'>
        <input type="password"/>
      </div>
    </div>
    <div className="forgot-password">Forgot Password<span>Click here!</span></div>
    <div className="submit-container">
      <div className="submit">Sign up</div>
      <div className="submit">Login in</div>
    </div>
</div>
      
      
    );

}
export default LoginSignup;