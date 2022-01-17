import React, { useState } from "react"

const login = () => {
    // error message
    const [error, setError] = useState("");

    const authUserSubmit = (event)=>{
        event.preventDefault();
    }

    return (
        <div>
            <div className="authFormContainer">
                <form 
                className="authForm"
                onSubmit={authUserSubmit}>

                    <input
                    className="authUsername"
                    name="user"
                    type="text"
                    placeholder="Email or username"/>
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
