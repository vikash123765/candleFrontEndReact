import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { nav } from '../lib/nav';
import { isLoggedIn } from '../lib/api';
import logo from '../Logo/logoMobile.webp';
import { useAtom } from 'jotai';
import { storeAtom } from '../lib/store';
import '../style/nav.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';

export default function Nav() {
    const [store, setStore] = useAtom(storeAtom);
    const history = useHistory();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu open/close

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false); // Close menu when a link is clicked
    };

    return (
        <header>
            <img src={logo} alt="Your Logo" className="logo" /> {/* Assuming you want the logo displayed on all screen sizes */}
            <nav className='desktop'>
                <ul>
                    {nav.filter(r => r.text).map(item => {
                        // Filtering logic
                        if (
                            (store.loggedIn && !item.loggedIn) ||
                            (!store.loggedIn && item.loggedIn) ||
                            (store.adminLoggedIn && !item.adminLoggedIn) ||
                            (!store.adminLoggedIn && item.adminLoggedIn)
                        ) {
                            return null;
                        }
                        return (
                            <li key={item.to}>
                                <Link to={item.to} onClick={handleLinkClick}>
                                    {item.text}
                                </Link>
                            </li>
                        );
                    })}
                    <li>
                        <Link to="/cart" className='cart-icon' onClick={handleLinkClick}>
                            <ShoppingCartIcon />
                            <div className='badge'>{store.cart && store.cart.length}</div>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* MOBILE VERSION */}
            <nav className="mobile">
                <div className="icon" onClick={handleMenuToggle}>
                    <MenuIcon />
                </div>
                {isMenuOpen && (
                    <div className="menu">
                        <ul>
                            {nav.filter(r => r.text).map(item => {
                                // Filtering logic
                                if (
                                    (store.loggedIn && !item.loggedIn) ||
                                    (!store.loggedIn && item.loggedIn) ||
                                    (store.adminLoggedIn && !item.adminLoggedIn) ||
                                    (!store.adminLoggedIn && item.adminLoggedIn)
                                ) {
                                    return null;
                                }
                                return (
                                    <li key={item.to}>
                                        <Link to={item.to} onClick={handleLinkClick}>
                                            {item.text}
                                        </Link>
                                    </li>
                                );
                            })}
                            <li>
                                <Link to="/cart" className='cart-icon' onClick={handleLinkClick}>
                                    <ShoppingCartIcon />
                                    <div className='badge'>{store.cart && store.cart.length}</div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    );
}
