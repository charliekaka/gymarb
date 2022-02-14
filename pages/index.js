import { useRouter } from "next/router";
import { getCookie } from "./api/user/verifyJwt";

export default function Home(props) {
  // init next router
  const router = useRouter()
  // get username from cookie
  const {username} = props;

  // show options to register or log in if user is not logged in
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
      return(
        <>
          <a href="/register">
          Register
          </a>
          <a href="/login">
            Log in
          </a>
        </>
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