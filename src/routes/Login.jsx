// Import necessary modules
import React, { useState } from "react";
import FormField from "../components/FormField";
import { signUpUser } from "../lib/api";
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

import '../style/LoginAndsignup.css';
const LOGIN_ENDPOINT = "http://localhost:8080/user/signIn";

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
            let adminRes = await axios("http://localhost:8080/admin/signIn", {
                method: 'POST',
                headers: {
                    "email": formData.email,
                    "password": formData.password,
                },
            });

            if (adminRes.status == '200') {
                const headers = adminRes.headers;
                const mockCookie = headers.get('X-Token')
                localStorage.setItem("tokenA", mockCookie);
                document.cookie = mockCookie + ";SameSite=Lax";
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
                const mockCookie = headers.get('X-Token');
                console.log("User mockCookie:", mockCookie);
                document.cookie = mockCookie + ";SameSite=Lax";
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
        setLoading(true);
    
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
            setLoading(false);
            setSignupError("All fields required");
            alert("All fields required");
            return;
        }
    
        if (data.userPassword !== data.password2) {
            setLoading(false);
            setSignupError("Passwords do not match");
            alert("Passwords do not match");
            return;
        }
    
        if (data.userPassword.length < 8) {
            setLoading(false);
            setSignupError("Password must be at least 8 characters");
            alert("Password must be at least 8 characters");
            return;
        }

        
        // Assuming the phone number includes the country code, e.g., "+1234567890"
        if (!/^\+(\d{1,2})\d{10}$/.test(data.phoneNumber)) {
            setLoading(false);
            setSignupError("Invalid phone number (must start with '+' and be 11 or 12 digits in total)");
            alert("Invalid phone number (must start with '+' and be 11 or 12 digits in total)");
            return;
        }
        
        
    
        try {
            const result = await signUpUser(data);
            console.log(result);
            if (result.status==200) {
                const responseData = await result.json();
    
                if (result.status === 201 && responseData.message === "account_created") {
                    setLoading(false);
                    alert("Account created!!");
                    form.reset();
                } else if (result.status === 409) {
                    const messageType = responseData.message;
    
                    if (messageType === "registered_user") {
                        setSignupError("Email already exists for a registered user. Please sign in instead.");
                    } else if (messageType === "guest_user") {
                        setSignupError("Email already used for guest orders. Please enter an unused one.");
                    } else {
                        console.error('Unexpected response:', responseData);
                        setSignupError("Unexpected error. Please try again.");
                    }
                }
            } else {
                console.error('Unexpected response:', result.statusText);
                setSignupError("Unexpected error. Please try again.");
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setSignupError("Error during signup. Please try again.");
        } finally {
            setLoading(false);
        }
    }    
// Update the component code
return (
    <div className="custom-login-signup-container">
        {loading && <div className="custom-loading-icon"><i className="fas fa-spinner fa-spin"></i></div>}
        <form className="custom-login-form" onSubmit={handleLogin}>
            <h2>Log in</h2>
            <FormField name="email" label="Email"  placeholder="Enter your username"/>
            <FormField name="password" label="Password" type="password"  placeholder="Enter your email"/>
            <a href="/forgot">Forgot password?</a><br />
            <button type="submit">Log in</button>
            {error && <span className="custom-error">{error}</span>}
        </form>
        <form className="custom-signup-form" onSubmit={handleSignup}>
            <h2>Sign up</h2>
            <FormField name="userName" label="Username"  placeholder="Enter your username" />
            <FormField name="userEmail" label="Email" placeholder="Enter your email" />
            <FormField name="address" label="Address" placeholder="Enter your complete address: Street Address,Postal Code,City and Country. Please inculde Apartment or Floor Number  " style={{ width: '100%', height: '8rem', boxSizing: 'border-box', resize: 'none' }} type="textarea"
                            />
            <FormField name="phoneNumber" label="Phone Number" placeholder="Enter your country code and number: ex: +1 1234567890 or +44 9876543210  " />
            <div className="custom-form-field">
                <div>Gender</div>
                <select name="gender">
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>
            </div>
            <FormField name="userPassword" label="Password" type="password"  placeholder="Enter your password" />
            <FormField name="password2" label="Repeat password" type="password"  placeholder="reapet your password"/>
            <button type="submit">Sign up</button>
            {signupError && <span className="custom-error">{signupError}</span>}
        </form>
    </div>
);
}