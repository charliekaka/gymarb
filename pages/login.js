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
        const postData = await fetch("/api/authuser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const apiResponse =  postData.json();
        apiResponse.then(res=>{

            console.log("hellooo", res);

            // // if cookie is returned login is successful
            // if(res.cookie){
            //     // will makes httponly later
            //     // vulnerable to xxs
            //     cookie.set("userToken", res.cookie, {
            //         path:"/",
            //         expires:30 // days
            //     })
            //     // return user to homepage
            //     router.push("/");
            // }else{
            //     return setError("username or password incorrect")
            // }
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
