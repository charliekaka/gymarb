import styles from "./inbox.module.scss";
import { useState } from "react"

export default function Compose(username){

    const [error, setError] = useState("")

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
    )
}