import { useRouter } from "next/router";
import { getCookie } from "../api/user/verifyJwt";
import { getListings } from "../api/listing/fetchListings";

export default function listing(props){
    const {list, username} = props

    const router = useRouter();
    const query = router.query.id
    
    let listing;

    // get listing by query
    for(let i = 0; i < list.length; i++){
        if(list[i].id === query){
            listing = list[i]
        }
    }

    return <p>hi</p>
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