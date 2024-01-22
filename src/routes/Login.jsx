// useState is for creating data that, when changed, should automatically reflect in the DOM, i.e. "react"
import { useState } from "react";
import FormField from "../components/FormField";
import { signUpUser } from "../lib/api";

/*
    useState takes an intial value, and returns an array of two things:
        1. the state
        2. a funciton for updating the state

    that's why we destrcuture it

    const [count, setCount] = useState(0)

    npm install @paypal/react-paypal-js
*/

const LOGIN_ENDPOINT = "http://localhost:8080/user/signIn";

export default function Login() {

    const [error, setError] = useState("")
    const [signupError, setSignupError] = useState("")

    async function handleLogin(e) {
        e.preventDefault();
        // the error should be set to blank, every time the form is submitted
        setError("")
        const form = e.target;
        // I passed the form data into Object.fromEntries, because FormData is a special data strucutre called a Map, and Object.fromEntries turns a map into an array, which is easier to work with
        const formData = Object.fromEntries(new FormData(form))
        /*
            If we don't do Object.fromEntries, the nthe headers would have to looks like this..
                headers: {
                    email: formData.get('email')
                    password: formData.get('password')
                }
        */

        try {
            let res = await fetch(LOGIN_ENDPOINT, {
                method: "POST",
                // body: formData // sending FormData directly
                headers: {
                    "email": formData.email,
                    "password": formData.password
                }
            });

            // this will only get triggered if the response has a status code that is not in the 200s
            if (!res.ok) {
                // handle bad response, for example:
                console.error("Login failed:", res.statusText);
                return;
            }

            //"Access-Control-Allow-Headers", "X-Token";
            //"Access-Control-Expose-Headers", "X-Token";



            console.log(res)
            const headers = res.headers
            const mockCookie = headers.get('X-Token')
            console.log("mockCookie:", mockCookie)
            document.cookie = mockCookie + ";SameSite=Lax"

            const text = await res.text(); // if your server responds 
            location.href = "/"
        } catch (error) {
            console.error("Error during login:", error);
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        setSignupError("")
        const form = e.target;
        const data = Object.fromEntries(new FormData(form))

        if (
            !data.userName,
            !data.userEmail,
            !data.userPassword,
            !data.password2,
            !data.address,
            !data.phoneNumber
        ) {
            setSignupError("All fields required")
            return
        }

        if (
            data.userPassword !== data.password2
        ) {
            setSignupError("Passwords do not match")
            return
        }

        if (
            data.userPassword.length < 8
        ) {
            setSignupError("Password must be at least 8 characters")
            return
        }

        const result = await signUpUser(data)
        console.log(result)
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h2>Log in</h2>
                <FormField
                    name="email"
                    label="Email"
                />
                <FormField
                    name="password"
                    label="Password"
                    type="password"
                />
                <a href="/forgot">Forgot password?</a><br />
                <button type="submit">
                    Log in
                </button>
                {/* 
                    {something && (<></>)} will render conditionally
                */}
                {error && (
                    <span className="error">
                        {error}
                    </span>
                )}
            </form>
            <form onSubmit={handleSignup}>
                <h2>Sign up</h2>
                <FormField
                    name="userName"
                    label="username"
                />
                <FormField
                    name="userEmail"
                    label="Email"
                />
                <FormField
                    name="address"
                    label="Address"
                />
                <FormField
                    name="phoneNumber"
                    label="Phone Number"
                />
                <div className="form-field">
                    <div>
                        Gender
                    </div>
                    <select name="gender">
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <FormField
                    name="userPassword"
                    label="Password"
                    type="password"
                />
                <FormField
                    name="password2"
                    label="Repeat password"
                    type="password"
                />
                <button>
                    Sign up
                </button>
                {signupError && (
                    <span className="error">
                        {signupError}
                    </span>
                )}
            </form>
        </div>
    );
}