import styles from "./inbox.module.scss";
import Image from "next/image";
import { useState } from "react"
import { getCookie } from "../api/user/verifyJwt";
import { handleChat } from "../api/chat/get"
import Compose from "./Compose";
import Messagebox from "./Messagebox";


const messages = (props)=>{
    const {username, chats} = props;

    const [chat, setChat] = useState(<Compose name={username} />);

    // other user
    const [other, setRecip] = useState("");

    // no chats open
    const [def, setDefault] = useState(true);

    function formatContacts(items){
        // react renderable elements
        let contacts = [];
        
        // format contacts
        for(let i = 0; i < items.length; i++){
            const {users, logs} = items[i];

            // format chat logs
            const {time, sender, content} = logs[0];
            const formatLogs = <div className={styles.chatLogs}>
                                    <p className={styles.chatLogsSub}>{time}</p>
                                    <p className={styles.chatLogsSub}>{sender}:</p>
                                    <p>{content}</p>
                                </div>

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
                    <li className={styles.contactItem} onClick={()=>{
                        setChat(<Compose name={username} />)
                        setRecip("")
                        setDefault(true)
                    }}>
                        <p className={styles.contactItemText}>
                            Create mew
                        </p>
                    </li>
                    {formatContacts(chats)}
                </div>

                <div className={styles.content}>
                    <div className={styles.chat}>
                        {chat} 
                    </div>
                
                {!def ? <Messagebox users={[username,other]} /> : ""  /*Hide messagebox if no chat open*/}

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

export default messages;
