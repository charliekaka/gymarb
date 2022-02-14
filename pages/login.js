import React, { useState } from "react";
import { useRouter } from "next/router";

const login = () => {
    const router = useRouter();
    // error message
    const [error, setError] = useState("");

    const authUserSubmit = async (event)=>{
        event.preventDefault();
        // user entered data
        const data = {
            username: event.target.username.value.toLowerCase(),
            password: event.target.password.value
        };
        // post data to api endpoint
        const postData = await fetch("/api/user/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const apiResponse =  postData.json();
        // get api response
        apiResponse.then(res=>{
            if(res.msg === "success"){
                // go to homepage if successfull login
                router.push("/");
            }else{
                // on failed login
                setError("Login failed");
            }
        })
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
