import React from "react";
import './LoginSignup.css';
import user_icon from './Assets/Components/person.png'
import email_icon from '/Assets/Components/email.png'
import password_icon from './Assets/Components/password.png'

const LoginSignup = () => {
    return(
      <div className='container'>
        <div className="header">
         <div className='text'>Sign up</div>
         <div className='underline'></div>
      </div>
      <div className="inputs">
      <div className='input'>
       <img src={user_icon} alt=""></img>
       <input type="text"/>
      </div>
      <div className="input">
       <img src={email_icon} alt=""></img>
       <input type="email"/>
      </div>
       
      <div className='input'>
       <img src={password_icon} alt=""></img>
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