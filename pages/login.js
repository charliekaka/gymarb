import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
    const router = useRouter();
    // error message
    const [error, setError] = useState("");

    const authUserSubmit = async (event)=>{
        event.preventDefault();
        // user entered data
        const data = {
            username: event.target?.username?.value.toLowerCase(),
            password: event.target?.password?.value
        };
        // post data to api endpoint
        const postData = await fetch("/api/user/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const apiResponse = postData.json();
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
            <Link href="/" className="backArrowSvg">
                <Image src="/backarrow.svg" width={70} height={70}/>
            </Link>
            <div className="authFormContainer">
                <form 
                className="authForm"
                onSubmit={authUserSubmit}>
                    <h1 className="authHeading">Log in</h1>
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
                    <div className="authWrongPath">
                        <p>Don´t have an account? <Link href="/register">Create account</Link></p>
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

export default Login