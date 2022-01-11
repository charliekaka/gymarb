import React, { useState } from "react";

const register = () => {
  // error message
  const [error, setError] = useState("");

  // register function
  const registerUserSubmit = async (event) => {
    event.preventDefault();
    // user entered data
    const data = {
      email: event.target.email.value.toLowerCase(),
      username: event.target.username.value.toLowerCase(),
      password: event.target.password.value
    };

    // check if a username is entered
    if(!data.username) return setError("Please enter a username");
    // check if username contains special characters
    if(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(data.username)) return setError("Username can not contain special characters");
    // check if username is too long
    if(data.username.length >= 10) return setError("Username must be less than 10 characters");
    // check if a username is entered
    if(!data.password) return setError("Please enter a password");
    // check if password is too short
    if(data.password.length <= 5) return setError("Password must be atleast 6 characters long");

    setError("");

    // POST to server
    const res = await fetch("/api/registeruser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // server response
    const result = await res.json();

    // show error to user
    if(result.error) setError(result.error);
  };

    return (
        <div>
            <div className="authFormContainer">
                <form 
                className="authForm"
                onSubmit={registerUserSubmit}>

                    <input
                    className="authEmail"
                    name="email"
                    type="email"
                    placeholder="Email" />
                    <input
                    className="authUsername"
                    name="username"
                    type="text"
                    placeholder="Username"/>
                    <input
                    className="authPassword"
                    name="password"
                    type="password"
                    placeholder="Password" />
                    <input
                    className="authSumbit"
                    type="submit"
                    value="Register" />

                </form>
                <h3 className="registerResponse">{error}</h3>
            </div>
        </div>
    )
}

export default register