// imports static files from public folder
import "next/image"

export default function Home() {
  return (
    <main>
      <header>
        <div className="dropdownContainer">
          <div className="profileRefContainer">
            <img
            src="/profileRef.svg" 
            alt="profile link" 
            width="48"
            height="48">
            </img>
          </div>
          <div className="dropdown-content">
            <a>Log in</a>
            <a href="/register">Register</a>
          </div>
        </div>
      </header>
    </main>
  )
}
