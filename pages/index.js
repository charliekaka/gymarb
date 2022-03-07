import { getCookie } from "./api/user/verifyJwt";
import { getListings } from "./api/listing/fetchListings";
import { useRouter } from "next/dist/client/router";

export default function Home(props) {
  const router = useRouter();
  const {username, list} = props;
  // render specified content if user is logged im
  function checkIfLoggedIn(username){
    if(username){
      return(
        <>
          {/* <button onClick={()=>router.push("/listing/create")}>New</button>
          <button onClick={()=>{
            // log out user
            fetch("/api/user/logout").then(()=>{
              // rerender page after logout
              router.push("/");
            })
          }}>
            Log out
          </button> */}

            <div className="dropdownContainer">
              <div className="profileRefContainer">
                <img
                src="/profileLink.svg" 
                alt="profile link" 
                width="64"
                height="64">
                </img>
              </div>
              <div className="dropdown-content">
                <a>{username}</a>
                <a onClick={()=>{
                  fetch("api/user/logout").then(()=>{
                    router.push("/")
                  })
                }}>
                  Log out
                </a>
              </div>
            </div>
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
        <div key={i} className="listingItem" >
          <div className="itemImageContainer">
            <img className="itemImage" src="/emptyimage.svg" />
          </div>
          <div className="listingTextContainer">
            <h3 className="itemTitle">{title}</h3>
            <p className="itemDate">{date}</p>
            <p className="itemPrice">{price}.€</p>
            <p className="itemUser">{user} {(user===username)?"(you)":""}</p>
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
            
          {username ? <h3 className="welcomeMessage">Welcome {username}!</h3>:""}
          <div className="headerButtonContainer">
            {checkIfLoggedIn(username)}
          </div>
          <div>
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