import { useRouter } from "next/router";
import { getCookie } from "./api/user/verifyJwt";

export default function Home(props) {
  // init next router
  const router = useRouter()
  // get username from cookie
  const {username} = props;

  function checkIfLoggedIn(username){
    // render if user is logged in
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
        <div className="authBtnContainer">
          <a href="/login" className="loginBtn">
            Log in
          </a>
          <a href="/register" className="registerBtn">
          Register
          </a>
        </div>
      )
    }
  }

  return (
    <main>
      <header>
        <div>
          {checkIfLoggedIn(username)}
        </div>
      </header>
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