import styles from "./inbox.module.scss";
import { useState } from "react";

export default function Messagebox(props){

    const [error, setError] = useState("Type a message");

    const [input, setInput] = useState("")

    const username = props.users[0];
    const other = props.users[1];


    const handleMessage = async (e) =>{
        e.preventDefault();

        const data = {
            sender: username,
            recipient: other,
            message: input
        };

        // check for empty message
        if(!data.message) return setError("Enter an actual message");

        const send = await fetch("/api/chat/send", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        });

        send.json().then(r=>{
            if(r.err) return setError(r.err);

        })
    }

    return(
        <div className={styles.messageBoxContainer} onSubmit={handleMessage}>
            <form className={styles.messageBox}>
                <input
                className={styles.messageInput}
                name="message"
                placeholder={error}
                value={input}
                onChange={(e)=>{
                    setInput(e.target.value)
                }}/>

                <input
                type="image"
                src="/sendmessage.svg"
                name="send"
                width="32"
                height="32"
                alt="send"/>

            </form>
        </div>
    )
}
