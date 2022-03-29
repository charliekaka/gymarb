import styles from "./inbox.module.scss";

export default function Messagebox(props){
    const username = props.users[0]
    const other = props.users[1]

    const handleMessage= (e) =>{
        e.preventDefault()
    }

    return(
        <div className={styles.messageBoxContainer} onSubmit={handleMessage}>
            <form className={styles.messageBox}>
                <input
                className={styles.messageInput}
                name="message"
                placeholder="Type a message"/>

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
