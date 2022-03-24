import styles from "./inbox.module.scss";
import Image from "next/image";
import { useState } from "react"
import { getCookie } from "../api/user/verifyJwt";
import { useRouter } from "next/router";

const messages = (props)=>{
    const router = useRouter()
    const [error, setError] = useState("")
    
    const {username} = props;
    
    const sendMessage = async e=>{
        e.preventDefault();
        setError("")

        const data = {
            author: username,
            recipient: e?.target?.recipient?.value,
            content: e?.target?.message?.value
        }
        // check for empty inputs
        for (let key of Object.keys(data)){
            if(!data[key]){
                return setError(`Enter a valid ${key}`);
            }
        }

        // post data to api endpoint
        const apiRequest = await fetch("/api/chat/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        apiRequest.json().then(result =>{
            if(result.err) return setError(result.err)
            
        })
        
    }

    return(
        <div className={styles.container}>
            <a className={styles.backArrowSvg} href="/">
                <Image
                src="/backarrow.svg"
                width={70}
                height={70}/>
            </a>
            <div className={styles.contentContainer}>
                <div className={styles.contacts}>
                    <div className={styles.contactItem}>
                        <p className={styles.contactItemText}>
                            Compose new message!
                        </p>
                    </div>
                </div>

                <div className={styles.content}>
                    <form className={styles.composeForm} onSubmit={sendMessage}>
                        <label>Send as</label>
                        <input className={styles.sender} placeholder={username} name="user" disabled />
                        <label>Send to</label>
                        <input className={styles.recipient} name="recipient" placeholder="Recipient" />
                        <label>Message content</label>
                        <textarea className={styles.messageContent} name="message" placeholder="Type a message" />
                        <input type="submit" className={styles.submit} value="Send" />
                        <p className={styles.error}>{error}</p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx){
    // get user data
    const cookie = getCookie(ctx);
    const username = cookie?.user?.username || null;
    // check if user is logged in
    if(!username){
        return{
            // redirect user to homepage
            redirect:{
                destination:"/login",
                permament:false
            }
        }
    }
    // return props to client
    return{props:{
        username:username,
    }}
}


export default messages