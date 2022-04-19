import { getCookie } from "./api/user/verifyJwt";
import { getListings } from "./api/listing/fetchListings";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import Select from "react-select";
import Image from "next/image";

export default function Home(props) {
  const router = useRouter();
  const {username, list} = props;

  const [listings, renewListings] = useState(renderListings(list));

  // handle listings
  function renderListings(list, option="new"){
    if(!list) return;
    
    // sort array by option
    switch (option) {
      case "new":
        // sort by newest
        list.sort((a,b)=>{
          return b.date.raw - a.date.raw
        })
        break;
      case "old":
        // sort by oldest
        list.sort((a,b)=>{
          return a.date.raw - b.date.raw
        })
        break;
      case "low":
        // sort prices by lowest
        list.sort((a,b)=>{
          return a.price - b.price
        })
        break;
      case "high":
        // sort prices by highest
        list.sort((a,b)=>{
          return b.price - a.price
        })
        break;
      }

      // react renderable data
      let listingData = [];
            
      // format listings
      for(let i = 0; i < list.length; i++){
        const {user, title, date, price, id} = list[i]
        
        listingData.push(
          // listing redirects to endpoint of listing id
          <a key={i} href={`listing/${id}`} className="listingLink">
            <div className="listingItem" >
                <div className="itemImageContainer">
                  <img className="itemImage" src="/emptyimage.svg" />
                </div>
                <div className="listingTextContainer">
                  <h3 className="itemTitle">{title}</h3>
                  <p className="itemDate">{date.plain}</p>
                  <p className="itemPrice">{price}.€</p>
                  <p className="itemUser">{user} {(user===username)?"(you)":""}</p>
                </div>
            </div>
          </a>
      )
    }
    return listingData
  }

  // list sorting options
  const options = [
    {value: "new", label: "New"},
    {value: "old", label: "Old"},
    {value: "low", label: "Low pirce"},
    {value: "high", label: "High price"}
  ]
   

  // render specified header if user is logged im
  function checkIfLoggedIn(username){
    if(username){
      return(
        <>
        <div className="headerRight">
          <a className="inboxSvgContainer" href="/messages">
            <Image
            src="/inbox.svg"
            alt="listing plus icon"
            width={40}
            height={30} />
          </a>
          <a className="inboxSvgContainer" href="/listing/create">
            <Image
            className="listingLinkIcon"
            src="/plusIcon.svg"
            width={25}
            height={25}
            />
          </a>
          <div className="dropdownContainer">
            <div className="profileRefContainer">
              <Image
              src="/profileLink.svg"
              alt="profile link"
              width={64}
              height={64} />
            </div>
            <div className="dropdown-content">
              <a>{username}</a>

              <a onClick={()=>{
                router.push("/listing/create")
              }}>Create listing</a>

              <a onClick={()=>{
                fetch("api/user/logout").then(()=>{
                  router.push("/")
                })
              }}>
                Log out
              </a>

            </div>
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

  // main render
  return (
    <main className="app">
      <div className="appContainer">

        <header>    
          {username ? <h3 className="welcomeMessage">{username}</h3>:""}
          <div className="headerButtonContainer">
            {checkIfLoggedIn(username)}
          </div>
        </header>

        <div className="secondHeader">
          <label className="sort-by">Sort by:</label>
          <Select instanceId={"selector"} options={options} placeholder={"New"} onChange={(e)=>{
            renewListings(renderListings(list, e.value))
          }} />
        </div>
        
        <div className="listingItemContainer">
          {listings}
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