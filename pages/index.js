import { getCookie } from "./api/user/verifyJwt";
import { getListings } from "./api/listing/fetchListings";

export default function Home(props) {
  const {username} = props

  // render specified content if user is logged im
  function checkIfLoggedIn(username){
    if(username){
      return(
        <>
          <p>
          Welcome {username}!
          </p>
          <button onClick={()=>{
            // log out user
            fetch("/api/user/logout")
            .then(()=>{
              // rerender page after logout
              router.push("/")
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

  // main render
  return (
    <main className="app">
      <div className="appContainer">
        <header>
          <div className="headerContentContainer">
            {checkIfLoggedIn(username)}
          </div>
        </header>
        <div>
          
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