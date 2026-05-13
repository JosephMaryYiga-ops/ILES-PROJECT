import React from "react";
import "./LoginSignup.css"
import user_icon from '../../assets/person.png';
import email_icon from '../../assets/email.png';
import password_icon from '../../assets/password.png';

const LoginSignup = () => {
    return (
        <div className='container'>
         <div className="header">
          <div className="text">SIGN UP</div> 
          <div className="underline"></div> 
          </div>
          <div className="inputs">
            <div className="input">
                <img src={user_icon} alt="" />
                <input type="Email" placeholder="Name"/>
            </div>
            <div className="input">
                <img src={email_icon} alt="" />
                <input type="Name" placeholder="Email"/>
            </div>
             <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" placeholder="Password"/>
            </div>
            
          </div>
          <div className="forgot-password">Forgot Password?<hr /><span>Click here</span></div>
          <div className="submit-container"></div>
            <div className="submit">Sign in</div>
            <br></br>
            
            <div className="submit">Login</div>


        </div>

    );
}
export default LoginSignup;