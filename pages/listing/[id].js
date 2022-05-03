import { useRouter } from "next/router";
import { getCookie } from "../api/user/verifyJwt";
import { getListings } from "../api/listing/fetchListings";
import styles from "./listing.module.scss";
import Image from "next/image";
import Link from "next/link";


export default function Listing(props){
    const {list, username} = props;
    const router = useRouter();

    // get router query
    const routeQuery = parseInt(router.query.id)
    
    // get listing by query
    let item;
    for(let i = 0; i < list.length; i++){
        if(list[i].id === routeQuery){
            item = list[i]
        }
    }

    // handle invalid route
    if(!item) return <h1><Link href="/">home</Link> 404 Not found :/</h1>

    const {title, description, price, user} = item;
    const date = item.date?.plain;

    return(
        <div className={styles.main}>
            <div className={styles.back}>
                <Link href="/">
                    <Image src="/backarrow.svg" width={70} height={70}/>
                </Link>
            </div>

            <div className={styles.container}>
                <div className={styles.date}>
                    <p>Published on {date} by {user}</p>
                </div>
                <div className={styles.title}>
                    <h1>{title}</h1>
                </div>
                <div className={styles.descriptionContainer}>
                    <label>Description</label>
                    <p className={styles.description}>{description}</p>
                </div>
                <div className={styles.price}>
                    <label>Price</label>
                    <p>{price}€</p>
                </div>
                <div className={styles.user}>
                    <p>{user}</p>
                </div>
            </div>
        </div>
    ) 
}

// get data
export async function getServerSideProps(context) {
    // get user data
    const cookie = getCookie(context);
    const username = cookie?.user?.username || null;
    // get listings
    const rawListings = await getListings();
    // props only accepts json
    const listings = JSON.stringify(rawListings);
    // return props to client
    return{props:{
      username:username,
      list:JSON.parse(listings)
    }}
}