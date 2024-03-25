import Nav from "./components/Nav"
import Footer from "./components/Footer"
import { Routes, Route,useNavigate  } from 'react-router-dom'
import { nav } from './lib/nav'
import { useState, useEffect } from "react"
import { signOutUser, isLoggedIn, getOrders,isAdminLoggedIn } from "./lib/api"
import Login from "./routes/Login.jsx"; // Replace "path-to-your" with the actual path
import Admin from "./routes/Admin.jsx"; // Replace "path
import { storeAtom, updateStore } from "./lib/store"
import { useAtom } from "jotai"
import { getCart_localStorage } from "./lib/cart"

// useEffect is for executing functions at certain points throughout a component's lifecycle (mount, update, destroy)

// npm install --save @stripe/react-stripe-js @stripe/stripe-js



function App() {

  /*
    npm install @mui/icons-material @mui/material @emotion/styled @emotion/react

      Routes (pages)
        - home
        - about
        - shipping info
        - my orders
        - contact
        - cart/checkout
        - products
        - login/signup

      JSX vs HTML
        - when you return JSX, there can only be 1 parent element
        - JSX has "fragments" <></>
        - insert js expressions using {}
        - use "className" instead of "class"
        - generate HTML from an array using map
        - event listeners with on____
              onClick=
              onSubmit=
              etc...
  */

  const [store, setStore] = useAtom(storeAtom)
  const [user, setUser] = useState({})
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [logoutTimer, setLogoutTimer] = useState(null);



  async function fetchOrders() {
    getOrders()
    .then(orders => {
      updateStore(setStore, {orders})
    }) 
  }

  // useEffect with an empty array as the 2nd argument, will only run on the component mount
  const checkSession = async () => {
    const userRes = await isLoggedIn();
    if (userRes.userName || userRes.token) {
      setUser(userRes);
      setLoggedIn(true);
      updateStore(setStore, {
        cart: getCart_localStorage(true),
        user: userRes,
        loggedIn: true
      });
      fetchOrders();
    // Calculate time since token creation on frontend
    const tokenCreationTimeFrontend = new Date(userRes.tokenCreationDateTime).getTime();

    // Adjust token creation time based on time zone difference (8 hours in this case)
    const tokenCreationTimeBackend = tokenCreationTimeFrontend + (8 * 60 * 60 * 1000);

    const currentTime = new Date().getTime();
    const timeSinceTokenCreation = currentTime - tokenCreationTimeBackend;

    // Check if user has been logged in for more than 2 minutes
    if (timeSinceTokenCreation > 2 * 60 * 1000) {
      const timeUntilNext2Minutes = 2 * 60 * 1000 - (timeSinceTokenCreation % (2 * 60 * 1000));

      // Set timer for auto-logout after 2 minutes from token creation time
      const timer = setTimeout(() => {
        logOut();
      }, timeUntilNext2Minutes);

      setLogoutTimer(timer);
    } else {
      // If less than 2 minutes, set the timer for 2 minutes from token creation
      const timer = setTimeout(() => {
        logOut();
      }, 2 * 60 * 1000 - timeSinceTokenCreation);

      setLogoutTimer(timer);
    }
    } else {
      updateStore(setStore, {
        cart: getCart_localStorage()
      });
    }
  };
const currentDate = new Date();
console.log(currentDate);
  useEffect(() => {
    checkSession();

    // Cleanup
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, []);

  useEffect(() => {
    isAdminLoggedIn().then((adminValue)=>{
      if(adminValue){
        setAdminLoggedIn(true);
        updateStore(setStore, {
     
          adminLoggedIn: true
        })
      }else{
        setAdminLoggedIn(false);
        updateStore(setStore, {
     
          adminLoggedIn: false
        })
      }
    })



}, [])

  function logOut() {
    localStorage.removeItem('guest-cart');
    setUser({});
    setLoggedIn(false);
    document.cookie = ""; // Clear cookies here
    clearTimeout(logoutTimer);
    setLogoutTimer(null);
  }


  return (
    <>
    <header>
      <div>
        <h1></h1>
        <h2>Welcome, {user.userName || 'guest'}!</h2>
        <div className="spacer"></div>
        <Nav />
        {loggedIn && (
          <button onClick={logOut}>Log out</button>
        )}
      </div>
    </header>

    <main>
      <div>
        <Routes>
          {nav.map(function (item) {
            return (
              <Route key={item.to} element={item.component} path={item.to} />
            );
          })}
          
     
        </Routes>
      </div>
    </main>

    <Footer />
  </>
);
}

export default App