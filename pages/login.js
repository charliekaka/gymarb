import React, { useState } from "react"

const login = () => {
    // error message
    const [error, setError] = useState("");

    const authUserSubmit = async (event)=>{
        event.preventDefault();
        // user entered data
        const data = {
            email: event.target.email.value.toLowerCase(),
            password: event.target.password.value
        };

        const res = await fetch("/api/authuser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await res.json()
        console.log(result);
    };

    return (
        <div>
            <div className="authFormContainer">
                <form 
                className="authForm"
                onSubmit={authUserSubmit}>

                    <input
                    className="authUsername"
                    name="email"
                    type="text"
                    placeholder="Email"/>
                    <input
                    className="authPassword"
                    name="password"
                    type="password"
                    placeholder="Password" />
                    <input
                    className="authSumbit"
                    type="submit"
                    value="Sign in" />

                </form>
                <h3 className="responseMessage">{error}</h3>
            </div>
        </div>
    )
}

export default login
