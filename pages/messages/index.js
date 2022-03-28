import styles from "./inbox.module.scss";
import Image from "next/image";
import { useState } from "react"
import { getCookie } from "../api/user/verifyJwt";
import { handleChat } from "../api/chat/get"
import Compose from "./Compose";

const messages = (props)=>{
    const {username, chats} = props;

    const [chat, setChat] = useState(Compose(username))
    
    function formatChats(items){
        // react renderable elements
        let chatElements = [];
        
        // format chats
        for(let i = 0; i < items.length; i++){
            const {users, logs} = items[i];

            chatElements.push(
                    <div key={i} className={styles.contactItem}>
                        <p className={styles.contactItemText}>
                            {(users[0]===username)?users[1]:users[0] /*returns the other user*/}
                        </p>
                    </div>
            )
        }
        return chatElements
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
                    {formatChats(chats)}
                </div>

                <div className={styles.content}>
                    {chat}
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
