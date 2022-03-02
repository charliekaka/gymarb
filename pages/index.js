import { getCookie } from "./api/user/verifyJwt";
import { getListings } from "./api/listing/fetchListings";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";

export default function Home(props) {
  const router = useRouter();
  const {username, list} = props;
  // render specified content if user is logged im
  function checkIfLoggedIn(username){
    if(username){
      return(
        <>
          <p>
          Welcome {username}!
          </p>
          <button onClick={()=>router.push("/listing/create")}>New</button>
          <button onClick={()=>{
            // log out user
            fetch("/api/user/logout").then(()=>{
              // rerender page after logout
              router.push("/");
            })
          }}>
            Log out
          </button>
        </>
      )
    }else{
      // render if user is not logged in
      return(
        <>
          <a href="/login" className="loginBtn">
            Log in
          </a>
          <a href="/register" className="registerBtn">
          Register
          </a>
        </>
      )
    }
  }

  // handle listings
  function renderListings(list){
    if(!list) return;

    let listings = [];

    // format listings
    for(let i = 0; i < list.length; i++){
      const {user, title, date, price} = list[i]

      listings.push(
        <div key={i} className="listingItem">
          <div className="itemImageContainer">
            <img className="itemImage" src="/emptyimage.svg" />
          </div>
          <div className="listingTextContainer">

            <h3 className="itemTitle">{title}</h3>
            <p className="itemDate">{date}</p>
            <p className="itemPrice">{price}.€</p>
            <p className="itemUser">{user}</p>
          </div>
        </div>
      )
    }
    return listings;
  }

  // main render
  return (
    <main className="app">
      <div className="appContainer">
        <header>
          <div className="headerContentContainer">
            {checkIfLoggedIn(username)}
          </div>
        </header>
        <div className="listingItemContainer">
          {renderListings(list)}
        </div>
      </div>
    </main>
  )
}

// get data to be rendered
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