import { getCookie } from "./api/user/verifyJwt";
import { useState } from "react";

const createlisting = (props) => {
    const {username} = props;
    const [error, setError] = useState("");

    // on submit listing
    const createListingSubmit = async e=>{
        e.preventDefault();
        const data = {
            user:username,
            title:e.target?.title?.value,
            description:e.target?.description?.value,
            price:e.target?.price?.value,
        }
        
        // checking for empty inputs
        for (let key of Object.keys(data)){
            if(!data[key]){
                return setError(`Enter a valid ${key}`);
            }
        }
        const a = await fetch("/api/listing/create", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })
        const b = a.json()
        b.then(r=>{
            console.log("wedidit",r);
        })

    }

    return(
        <div>
            <form onSubmit={createListingSubmit}>
                <label htmlFor="user" >Publish as</label>
                <input placeholder={username} name="user" id="user" disabled />
                <label htmlFor="title" >Title</label>
                <input name="title" id="title" />
                <label htmlFor="description" >Description</label>
                <input name="description" id="description" />
                <label htmlFor="price" >Pricing</label>
                <input name="price" id="price" type="number"/>
                <label htmlFor="image" >Image</label>
                <input name="image" id="image" type="file" accept="img/png, img/jpeg"/>
                <input name="submit" type="submit"/>
            </form>
            <h3>{error}</h3>
        </div>
    )
}

export async function getServerSideProps(ctx){
    // decrypted cookie data
    const cookieraw = getCookie(ctx);
    // check if there is a user
    const user = cookieraw?.user?.username;
    if(user){
        return{props:{username:user}}
    }
    // redirect user to homepage if not logged in
    return{
        redirect:{
            destination:"/",
            permament:false
        }
    }
}

export default createlisting