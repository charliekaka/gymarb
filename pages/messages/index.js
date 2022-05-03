import styles from "./inbox.module.scss";
import Image from "next/image";
import { useState } from "react";
import { getCookie } from "../api/user/verifyJwt";
import { handleChat } from "../api/chat/get";
import Compose from "./Compose";
import Link from "next/link";

const Messages = (props)=>{
    const {username} = props

    const [chat, setChat] = useState(<Compose name={username} />);

    // other user
    const [other, setRecip] = useState("");

    // no chats open
    const [def, setDefault] = useState(true);

    // formating time logic
    function formatTime(time){
        let difference = Date.now()-time;

        let seconds = Math.round(difference/1000);
        let minutes = Math.round(seconds/60);
        let hours = Math.round(minutes/60);
        let days = Math.round(hours/24);

        if(seconds > 59) return minutes.toString()+"m";
        if(minutes > 59) return hours.toString()+"h";
        if(hours > 24) return days.toString()+"d";

        return seconds.toString()+"s";
    }

    function formatContacts(items){
        // react renderable elements
        let contacts = [];
        
        // format contacts
        for(let i = 0; i < items.length; i++){
            let {users, logs} = items[i];

            // chat instance of contact
            function formatChatLogs(logs){
                let arr = []
                for(let j = 0; j < logs.length; j++){
                    let {time, sender, content} = logs[j];

                    const cleanTime = formatTime(time) || "";

                    console.log(cleanTime);

                    arr.push(
                        <div key={j} className={styles.chatLogs}>
                            <p className={styles.chatLogsSub}>{cleanTime}</p>
                            <p className={styles.chatLogsSub}>{sender} {">"} </p>
                            <p>{content}</p>
                        </div>
                    )
                }
                return arr
            }

            const formatLogs = formatChatLogs(logs)

            // get the other user
            const other = (users[0]===username)?users[1]:users[0];

            // array of renderable content
            contacts.push(
                    <li key={i} className={styles.contactItem} onClick={(e)=>{
                        setChat(formatLogs)
                        setRecip(other)
                        setDefault(false)
                    }}>
                        <p className={styles.contactItemText}>
                            {other}
                        </p>
                    </li>
            )
        }
        return contacts
    }
    
    const [error, setError] = useState("Type a message");

    const [input, setInput] = useState("")

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
            setInput("")

            const arr = []

            const cleanTime = formatTime(Date.now()) || "";

            arr.push(
                <div key={arr.length} className={styles.chatLogs}>
                    <p className={styles.chatLogsSub}>{cleanTime}</p>
                    <p className={styles.chatLogsSub}>{data.sender} {">"} </p>
                    <p>{data.message}</p>
                </div>
            )

            // assign the temporary message
            setChat(chat => [...chat, arr])
        })
    }

    return(
        <div className={styles.container}>
            <Link className={styles.backArrowSvg} href="/">
                <Image
                src="/backarrow.svg"
                width={70}
                height={70}/>
            </Link>

            <div className={styles.contentContainer}>
                <div className={styles.contacts}>
                    <li className={styles.contactItem} onClick={()=>{
                        setChat(<Compose name={username} />)
                        setRecip("")
                        setDefault(true)
                    }}>
                        <p className={styles.contactItemText}>
                            Create mew
                        </p>
                    </li>
                    {formatContacts(props.chats)}
                </div>

                <div className={styles.content}>
                    <div className={styles.chat}>
                        {chat} 
                    </div>
                
                {!def?
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
                :""}
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

    // get users chats
    const chat = await handleChat(username)

    // return props to client
    return{props:{
        username: username,
        // magically fixes some error
        chats: JSON.parse(JSON.stringify(chat))
    }}
}

export default Messages;
