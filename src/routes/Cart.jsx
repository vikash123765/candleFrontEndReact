import { useAtom } from "jotai"
import { storeAtom } from "../lib/store"
import { ROOT, getToken } from '../lib/api.js'
import { clearCart } from "../lib/cart.js"
import { useNavigate } from "react-router-dom"

import GuestCheckoutForm from "../components/GuestCheckoutForm.jsx"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const payPalOptions = {
    clientId: "",
    currency: "EUR"
}

/*
    [
        {iPhone},
        {iPhone},
        {iPhone},
        {Galaxy},
        {Galaxy}
    ]

    ->

    [
        {3},
        {2}
    ]
*/

export default function Cart() {

    // this creates a function we can use to change pages without a hyperlink
    const navigate = useNavigate()

    const [store, setStore] = useAtom(storeAtom)

    // console.log(store.cart)

    async function userCheckout(e) {
        e.preventDefault()
        console.log(`
            Making request to /finalizeOrder
            Token: ${getToken}
            Products: ${JSON.stringify(store.cart.map(p => p.productId))}
        `)
        const res = await fetch(ROOT + '/finalizeOrder', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": getToken()
            },
            body: JSON.stringify(store.cart.map(p => p.productId))
        })
        
        if (!res.ok) {
            alert('something went wrong')
            console.log(res)
        }

        console.log('success')
        clearCart(setStore)
        navigate('/')
    }

    async function guestCheckout(e) {
        e.preventDefault();
    
        const data = Object.fromEntries(new FormData(e.target));
    
        const res = await fetch(
            `http://localhost:8080/finalizeGuestOrder`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonPayload: JSON.stringify(store.cart.map(p => p.productId)),
                    guestOrderRequest: data,
                }),
            }
        );
    
        if (!res.ok) {
            alert('Failed');
            console.log(res);
            return;
        }
    
        alert('Success');
        clearCart(setStore);
        navigate('/');
    }
    

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
    let displayedCart = store.cart.reduce((acc, cv) => {

    }, [])

    let total = store.cart.reduce((acc, cv) => {
        return acc + cv.productPrice
    }, 0)

  return (
    <div>
        {/* 
            value ? () : ()
            is like a ternary expression for JSX.
        */}
        <h3>Your order</h3>
        {store.cart.length ? (
            <>
            <form onSubmit={userCheckout} id="cart_form">
                <div id="cart">
                    {store.cart.map((p, i) => {
                        function remove() {
                            setStore(current => {
                                current.cart.splice(
                                  current.cart.findIndex(item => item.productId === p.productId),
                                  1
                                )
                                return {...current}
                              })
                        }

                        return (
                            <div className="cart-item" key={p.productName+i}>
                                <div className="left">
                                    <img src={`https://picsum.photos/seed/${p.productName}/500/500`} alt="" />
                                </div>
                                <div className="right">
                                    <div>{p.productName}</div>
                                    <div>¤{p.productPrice.toFixed(2)}</div>
                                    <button onClick={remove} type="button">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="foot">
                    <h4 id="cart_total">
                        Total: ¤{total.toFixed(2)}
                    </h4>
                    {/* {store.loggedIn && (
                        <button type="submit">
                            Checkout
                        </button>
                    )} */}
                    {store.loggedIn && (
                        <PayPalScriptProvider>
                            <PayPalButtons />
                        </PayPalScriptProvider>
                    )}
                </div>
            </form>
            {/* {!store.loggedIn && (
                <GuestCheckoutForm guestCheckout={guestCheckout}/>
            )} */}
            {!store.loggedIn && (
                <PayPalScriptProvider>
                    <PayPalButtons />
                </PayPalScriptProvider>
            )}
            </>
        ):(
            <>
                Your cart is empty.
            </>
        )}
    </div>
  )
}