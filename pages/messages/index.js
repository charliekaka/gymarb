import styles from "./inbox.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import { getCookie } from "../api/user/verifyJwt";

export default function messages(props){
    const router = useRouter();

    const {username} = props;

    console.log(props);
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

                </div>
                <div className={styles.content}>

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


