import { useRouter } from "next/router";
import { getCookie } from "./api/user/verifyJwt";

export default function Home(props) {
  // init next router
  const router = useRouter()
  // get username from cookie
  const {username} = props;

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
        <p>
          a
        </p>
      </div>
    </main>
  )
}

// get user data
export async function getServerSideProps(context) {
  const cookie = getCookie(context)
  if(cookie){
    return {
      // return user object to react props
      props: cookie.user
    }
  }
  return{props:{}}
}