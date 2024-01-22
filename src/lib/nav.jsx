import Home from "../routes/Home"
import About from "../routes/About"
import Contact from "../routes/Contact"
import Login from "../routes/Login"
import Products from "../routes/Products"
import Cart from "../routes/Cart"
import Profile from "../routes/Profile"
import Forgot from "../routes/Forgot"
import Orders from "../routes/Orders"

const nav = [
    {
        to: "/",
        text: "Home",
        component: <Home />
    },
    {
      to: "/about",
      text: "About",
      component: <About />
    },
    {
      to: "/contact",
      text: "Contact",
      component: <Contact />
    },
    {
      to: "/login",
      text: "Log in / Sign up",
      component: <Login />,
      loggedIn: false
    },
    {
      to: '/profile',
      text: 'Profile',
      loggedIn: true,
      component: <Profile />
    },
    {
      to: "/products",
      text: "Products",
      component: <Products />
    },
    {
      to: '/orders',
      text: 'My Orders',
      loggedIn: true,
      component: <Orders />
    },
    // routes without a "text" property will not be mapped over in the Nav component
    {
      to: "/cart",
      component: <Cart />
    },
    {
      to: '/forgot',
      component: <Forgot />
    }
]

export {
    nav
}