import { useAtom } from "jotai";
import { storeAtom } from "../lib/store";
import { ROOT, getToken } from '../lib/api.js';
import { clearCart } from "../lib/cart.js";
import { useNavigate } from "react-router-dom";

import GuestCheckoutForm from "../components/GuestCheckoutForm.jsx";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const payPalOptions = {
    clientId: "AW4rF3ytyCzS2oxIhUE_Ihw-ifEVIRKICnYfvZiUqi8-E_XJ-r2xyquy7H1XN0Z2GGEoUCLV_uEdec5_",
    currency: "SEK"
};

export default function Cart() {
    const navigate = useNavigate();
    const [store, setStore] = useAtom(storeAtom);

    // Function to handle checkout for logged-in users
    async function userCheckout(data, actions) {
        const order = await actions.order.capture();
        console.log("Order:", order);

        // Finalize order on the backend
        const res = await fetch(ROOT + '/finalizeOrder', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": getToken()
            },
            body: JSON.stringify(store.cart.map(p => p.productId))
        });
        
        if (!res.ok) {
            alert('Something went wrong with finalizing the order');
            console.log(res);
            return;
        }

        console.log('Order finalized successfully');
        clearCart(setStore);
        navigate('/');
    }

    // Function to handle checkout for guest users
    async function guestCheckout(data, actions) {
        const order = await actions.order.capture();
        console.log("Order:", order);

        // Finalize guest order on the backend
        const res = await fetch(ROOT + '/finalizeGuestOrder', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                jsonPayload: JSON.stringify(store.cart.map(p => p.productId)),
                guestOrderRequest: data
            })
        });
        
        if (!res.ok) {
            alert('Something went wrong with finalizing the guest order');
            console.log(res);
            return;
        }

        console.log('Guest order finalized successfully');
        clearCart(setStore);
        navigate('/');
    }

    // Calculate total order amount
    let total = store.cart.reduce((acc, cv) => acc + cv.productPrice, 0);
    
    // Example shipping cost, replace with your logic to calculate shipping cost
    const shippingCost = 0.1;
    const totalWithShipping = total + shippingCost;

    return (
        <div>
            <h3>Your order</h3>
            {store.cart.length ? (
                <>
                    <form id="cart_form">
                        <div id="cart">
                            {/* Display cart items */}
                            {store.cart.map((p, i) => {
                                function remove() {
                                    // Remove item from cart
                                    setStore(current => {
                                        current.cart.splice(
                                            current.cart.findIndex(item => item.productId === p.productId),
                                            1
                                        );
                                        return {...current};
                                    });
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
                                );
                            })}
                        </div>
                        <div className="foot">
                            <h4 id="cart_total">
                                Total: ¤{totalWithShipping.toFixed(2)}
                            </h4>
                            {!store.loggedIn && (
                                // Include Guest Checkout Form only if user is logged out
                                <GuestCheckoutForm guestCheckout={guestCheckout} />
                            )}
                            {/* PayPal button */}
                            <PayPalScriptProvider options={payPalOptions}>
                                <PayPalButtons
                                    createOrder={(data, actions) => {
                                        // Create PayPal order
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: totalWithShipping.toFixed(2),
                                                        currency_code: 'SEK'
                                                    }
                                                }
                                            ]
                                        });
                                    }}
                                    // Handle checkout based on user type
                                    onApprove={(data, actions) => {
                                        // Check if payment was successful
                                        if (actions.order.status === 'APPROVED') {
                                            // Proceed with checkout based on user type
                                            if (store.loggedIn) {
                                                userCheckout(data, actions);
                                            } else {
                                                guestCheckout(data, actions);
                                            }
                                        } else {
                                            console.log('Payment was not approved');
                                        }
                                    }}
                                />
                            </PayPalScriptProvider>
                        </div>
                    </form>
                </>
            ) : (
                <div>Your cart is empty.</div>
            )}
        </div>
    );
}
