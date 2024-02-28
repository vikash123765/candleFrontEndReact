// Import necessary modules
import React, { useState } from "react";
import FormField from "../components/FormField";
import { signUpUser } from "../lib/api";
import "../style/LoginAndSignup.css";

const LOGIN_ENDPOINT = "http://localhost:8080/user/signIn";

export default function Login() {
    const [error, setError] = useState("");
    const [signupError, setSignupError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        const form = e.target;
        const formData = Object.fromEntries(new FormData(form));

        try {
            let adminRes = await fetch("http://localhost:8080/admin/signIn", {
                method: 'POST',
                headers: {
                    "email": formData.email,
                    "password": formData.password,
                },
            });

            if (adminRes.ok) {
                const headers = adminRes.headers;
                const mockCookie = headers.get('X-Token');
                console.log("Admin mockCookie:", mockCookie);
                document.cookie = mockCookie + ";SameSite=Lax";
                alert("sign in sucessfull !")
                window.location.href = '/admin';
                return;
            }

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
    }

    async function handleSignup(e) {
        e.preventDefault();
        setSignupError("");

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
            return;
        }

        if (data.userPassword !== data.password2) {
            setSignupError("Passwords do not match");
            return;
        }

        if (data.userPassword.length < 8) {
            setSignupError("Password must be at least 8 characters");
            return;
        }

        try {
            const result = await signUpUser(data);
            console.log(result);
            alert("account created!! ")

            form.reset();

            
        } catch (error) {
            console.error('Error during signup:', error);
            alert("Error during signp please try again")
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h2>Log in</h2>
                <FormField name="email" label="Email" />
                <FormField name="password" label="Password" type="password" />
                <a href="/forgot">Forgot password?</a><br />
                <button type="submit">Log in</button>
                {error && <span className="error">{error}</span>}
            </form>
            <form onSubmit={handleSignup}>
                <h2>Sign up</h2>
                <FormField name="userName" label="Username" />
                <FormField name="userEmail" label="Email" />
                <FormField name="address" label="Address" />
                <FormField name="phoneNumber" label="Phone Number" />
                <div className="form-field">
                    <div>Gender</div>
                    <select name="gender">
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <FormField name="userPassword" label="Password" type="password" />
                <FormField name="password2" label="Repeat password" type="password" />
                <button>Sign up</button>
                {signupError && <span className="error">{signupError}</span>}
            </form>
        </div>
    );
}