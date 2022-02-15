import React, { useState } from "react";
import { useRouter } from "next/router";

const register = () => {
  // error message
  const [error, setError] = useState("");
  const router = useRouter();

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
    const res = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // server response
    const result = await res.json();

    if(result){
      // renavigate user to homepage
      router.push("/");
    }else{
      setError("Username is already taken");
    }
  };

    return (
        <div>
          <a href="/">
            <img src="/backarrow.svg" className="backArrowSvg"/>
          </a>
            <div className="authFormContainer">
                <form 
                className="authForm"
                onSubmit={registerUserSubmit}>
                    <h1 className="authHeading">Sign up!</h1>
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

                    <div className="authWrongPath">
                      <p>Already registered? <a href="/login">Log in</a></p>
                    </div>
                </form>
                <h3 className="responseMessage">{error}</h3>
            </div>
        </div>
    )
}

// redirect user if already logged in
export async function getServerSideProps(ctx){
  try{
      const {cookies} = ctx.req;
      // check if user has auth cookie
      if(cookies.userToken){
          return{
              // redirect user to homepage
              redirect:{
                  destination:"/",
                  permament:false
              }
          }
      }
  }catch(e){
      console.error(e)
  }
  return{props:{}}
}

export default register