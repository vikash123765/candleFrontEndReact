import { Link } from 'react-router-dom'
import { nav } from '../lib/nav'
import { isLoggedIn } from '../lib/api'

import { useAtom } from 'jotai'
import { storeAtom } from '../lib/store'

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import MenuIcon from '@mui/icons-material/Menu';

export default function Nav() {

    const [store, setStore] = useAtom(storeAtom)

    return (
        <>
            <nav className='desktop'>
                <ul>
                    {/* I'm filtering here for only the routes that have a text property */}
                    {nav.filter(r => r.text).map(function(item){
                        if (store.loggedIn && (item.loggedIn === false)) {
                            return
                        }
                        if (!store.loggedIn && (item.loggedIn === true)) {
                            return
                        }
                        return (
                        <li key={item.to}>
                            <Link to={item.to}>{item.text}</Link>
                        </li>
                        )
                    })}
                    {/* The Cart link is rendered differently than the other links, so I do it separately here, because it should also show the length of the cart. */}
                    <li>
                        <Link to="/cart" className='cart-icon'>
                            <ShoppingCartIcon /> 
                            <div className='badge'>
                                {store.cart.length}
                            </div>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* MOBILE VERSION */}

            <nav className="mobile">
                <div className="icon">
                    <MenuIcon />
                </div>
                <div className="menu">
                    <ul>

                        {nav.filter(r => r.text).map(function(item){
                            if (store.loggedIn && (item.loggedIn === false)) {
                                return
                            }
                            if (!store.loggedIn && (item.loggedIn === true)) {
                                return
                            }
                            return (
                            <li key={item.to}>
                                <Link to={item.to}>{item.text}</Link>
                            </li>
                            )
                        })}

                        <li>
                            <Link to="/cart" className='cart-icon'>
                                <ShoppingCartIcon /> 
                                <div className='badge'>
                                    {store.cart.length}
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}