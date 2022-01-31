import React, { useState } from "react"

const login = () => {
    // error message
    const [error, setError] = useState("");

    const authUserSubmit = async (event)=>{
        event.preventDefault();
        // user entered data
        const data = {
            username: event.target.username.value.toLowerCase(),
            password: event.target.password.value
        };

        const res = await fetch("/api/authuser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result =  res.json();
        result.then(sucessLogin=>console.log("bbb",sucessLogin))
    };

    return (
        <div>
            <div className="authFormContainer">
                <form 
                className="authForm"
                onSubmit={authUserSubmit}>

                    <input
                    className="authUsername"
                    name="username"
                    type="text"
                    placeholder="username"/>
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