// Import necessary modules
import React, { useState } from "react";
import FormField from "../components/FormField";
import { signUpUser,setCookie} from "../lib/api";
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

import '../style/LoginAndsignup.css';
const LOGIN_ENDPOINT = "https://api.vtscases.com/user/signIn";

export default function Login() {
    const [error, setError] = useState("");
    const [signupError, setSignupError] = useState("");
    const [loading, setLoading] = useState(false); // Introduce loading state for both login and signup


    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setLoading(true); // Set loading to true during login

        const form = e.target;
        const formData = Object.fromEntries(new FormData(form));

        try {
            let adminRes = await axios("https://api.vtscases.com/admin/signIn", {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "email": formData.email,
                    "password": formData.password,
                },
            });

            if (adminRes.status == '200') {
                const headers = adminRes.headers;
                const token = headers.get('X-Token')
                
                setCookie('token', token, 1);
                alert("sign in sucessfull !")
                window.location.href = '/admin';
                return;
            }
        } catch (error) {
            console.log("Unable to Login")
        }

        try {


            let userRes = await fetch(LOGIN_ENDPOINT, {
                method: 'POST',
                headers: {
                    "email": formData.email,
                    "password": formData.password,
                },
            });

            if (userRes.ok) {
                const headers = userRes.headers;
                const token = headers.get('X-Token');
                setCookie('token', token, 1);
                alert("sign in sucessfull !")
                window.location.href = '/';
                return;
            }

            console.error('Login failed:', userRes.statusText);
            setError("Login failed. Please check your credentials.");
            alert("login faled please checkyou credentials! ")
        } catch (error) {
            alert("login faled please try again")
            console.error('Error during login:', error);
        }
        finally {
            setLoading(false); // Set loading to false after login attempt
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        setSignupError("");
        setLoading(true); // Set loading to true during signup

        const form = e.target;
        const data = Object.fromEntries(new FormData(form));

        if (
            !data.userName ||
            !data.userEmail ||
            !data.userPassword ||
            !data.password2 ||
            !data.address ||
            !data.phoneNumber
        ) {
            setSignupError("All fields required");
            setLoading(false); // Set loading to false after signup attempt
            return;
        }

        if (data.userPassword !== data.password2) {
            setSignupError("Passwords do not match");
            setLoading(false); // Set loading to false after signup attempt
            return;
        }

        if (data.userPassword.length < 8) {
            setSignupError("Password must be at least 8 characters");
            setLoading(false); // Set loading to false after signup attempt
            return;
        }

        await signUpUser(data);

        form.reset();
        setLoading(false); // Set loading to false after signup attempt
    }
// Update the component code
return (
    <div className="custom-login-signup-container">
        {loading && <div className="custom-loading-icon"><i className="fas fa-spinner fa-spin"></i></div>}
        
       
        
        {/* Signup form */}
        <div className="custom-signup-form-container">
            <form className="custom-signup-form" onSubmit={handleSignup}>
                <h2>Sign up</h2>
                <FormField name="userName" label="Username"   placeholder="Enter your name" />
                <FormField name="userEmail" label="Email"  placeholder="Enter your email" />
                <FormField name="address" label="Address" 
                placeholder="Enter your complete address: Street Address, Postal Code, City, and Country. Please include Apartment or Floor Number."
                  type="textarea"
                  style={{ width: '100%', height: '8rem', boxSizing: 'border-box', resize: 'none' }}/>
                <p>Please enter country code and number with no spaces or + important!</p>
                <FormField name="phoneNumber" label="Phone Number"  placeholder="country code and number no spaces or +"/>
                
                <div className="custom-form-field">
                    <div>Gender</div>
                    <select name="gender">
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                </div>
                <FormField name="userPassword" label="Password" type="password" />
                <FormField name="password2" label="Repeat password" type="password" />
                <button type="submit">Sign up</button>
                {signupError && <span className="custom-error">{signupError}</span>}
            </form> 
            {/* Login form */}
    
        </div>    <div className="custom-login-form-container">
            <form className="custom-login-form" onSubmit={handleLogin}>
                <h2>Log in</h2>
                <FormField name="email" label="Email" />
                <FormField name="password" label="Password" type="password" />
                <a href="/forgot">Forgot password?</a><br />
                <button type="submit">Log in</button>
                {error && <span className="custom-error">{error}</span>}
            </form>
        </div>
    </div>
);
}