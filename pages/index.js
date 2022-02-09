export default function Home(props) {
  return (
    <main>
        <>aa</>
      <header>
        <div>
          <a href="/register">
            Register
          </a>
          <a href="/login">
            Log in
          </a>
        </div>
      </header>
    </main>
  )
}

export async function getServerSideProps(ctx) {
  const { verify } = require("jsonwebtoken");
  
  const token = ctx.req.cookies.userToken;

  if(token){
    const userObject;
    try{
      userObject = verify(token, process.env.ACCESS_TOKEN_SECRET)
    }catch(e){
      console.error(e)
    }
    return {
      props: {userObject}
    }
  }

  return{props:{}}
}
