import React from 'react';
import { Link } from 'react-router-dom';
import { nav } from '../lib/nav';
import { isLoggedIn } from '../lib/api';
import { useAtom } from 'jotai';
import { storeAtom } from '../lib/store';
import logoImage from '../Logo/tural face.jpeg';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';

const Nav = () => {
  const [store, setStore] = useAtom(storeAtom);

  return (
    <>
      <nav className="desktop">
       {/*  <div className="logo">
          <img
            src={logoImage}
            alt="Company Logo"
            style={{ width: '50px', height: '50px', marginLeft: '-1px', marginTop: '10px', marginRight: 'px' }}
          />
        </div> */}
        <div className="greeting">
          {store.loggedIn && <p>Welcome, {store.user?.userName}!</p>}
        </div>
        <ul>
          {nav
            .filter((r) => r.text)
            .map(function (item) {
              if (store.loggedIn && item.loggedIn === false) {
                return null;
              }
              if (!store.loggedIn && item.loggedIn === true) {
                return null;
              }
              if (store.adminLoggedIn && item.adminLoggedIn === false) {
                return null;
              }
              if (!store.adminLoggedIn && item.adminLoggedIn === true) {
                return null;
              }
              return (
                <li key={item.to}>
                  <Link to={item.to}>{item.text}</Link>
                </li>
              );
            })}
          <li>
            <Link to="/cart" className="cart-icon">
              <ShoppingCartIcon />
              <div className="badge">{store.cart && store.cart.length}</div>
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
            {nav
              .filter((r) => r.text)
              .map(function (item) {
                if (store.loggedIn && item.loggedIn === false) {
                  return null;
                }
                if (!store.loggedIn && item.loggedIn === true) {
                  return null;
                }
                if (store.adminLoggedIn && item.adminLoggedIn === false) {
                  return null;
                }
                if (!store.adminLoggedIn && item.adminLoggedIn === true) {
                  return null;
                }
                return (
                  <li key={item.to}>
                    <Link to={item.to}>{item.text}</Link>
                  </li>
                );
              })}
            <li>
              <Link to="/cart" className="cart-icon">
                <ShoppingCartIcon />
                <div className="badge">{store.cart && store.cart.length}</div>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Nav;
