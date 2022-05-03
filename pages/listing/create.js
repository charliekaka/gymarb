import { getCookie } from "../api/user/verifyJwt";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./create.module.scss";
import Link from "next/link";

const Createlisting = (props) => {
    const {username} = props;
    const router = useRouter();
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

        // make req to create listing
        const apiPromise = await fetch("/api/listing/create", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })
        apiPromise.json().then(r=>{
            // reroute the user
            if(r?.msg === "success"){
                router.push("/");
            }
        })
    }

    return(
        <div className={styles.container}>
            <Link href="/" className={styles.back}>
                <Image src="/backarrow.svg" width={70} height={70}/>
            </Link>
            <div className={styles.content}>
                <h1>Create a listing!</h1>
                <form className={styles.form} onSubmit={createListingSubmit}>
                    <label htmlFor="user" >Publish as </label>
                    <input className={styles.user} placeholder={username} name="user" id="user" disabled />
                    <label htmlFor="title">Title</label>
                    <input className={styles.title} name="title" id="title" />
                    <label htmlFor="description" >Description</label>
                    <textarea className={styles.description} name="description" id="description" />
                    <label htmlFor="price" >Pricing</label>
                    <input className={styles.price} name="price" id="price" placeholder="€" type="number"/>
                    <label htmlFor="image" >Image</label>
                    <input className={styles.image} name="image" id="image" type="file" />
                    <input className={styles.send} name="submit" type="submit" value="Upload" />
                </form>
                <h3 className={styles.error}>{error}</h3>
            </div>
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

export default Createlisting