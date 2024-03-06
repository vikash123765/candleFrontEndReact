
import { useAtom } from 'jotai';
import { storeAtom } from '../lib/store';
import { ROOT, getToken } from '../lib/api.js';
import { clearCart } from '../lib/cart.js';
import { useNavigate } from 'react-router-dom';
import GuestCheckoutForm from '../components/GuestCheckoutForm.jsx';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import React, { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
// Declare shippingCost state
const payPalOptions = {
    clientId: 'AW4rF3ytyCzS2oxIhUE_Ihw-ifEVIRKICnYfvZiUqi8-E_XJ-r2xyquy7H1XN0Z2GGEoUCLV_uEdec5_',
    currency: 'SEK',
};

export default function Cart() {
    const navigate = useNavigate();
    const [store, setStore] = useAtom(storeAtom);

    const [isSweden, setIsSweden] = useState(true);
    const [isNonTracable, setIsNonTracable] = useState(false);
    const [isEurope, setIsEurope] = useState(false);
    const [isTracable, setIsTracable] = useState(true);

    const isNonTracableRef = useRef(isNonTracable);  
    const isEuropeRef = useRef(isEurope) 
    const isSwedenRef = useRef(isSweden);
    const isTracableRef = useRef(isTracable);
   
   
    const [shippingPrice, setShippingPrice] = useState(null);
    const [totalWithShipping, setTotalWithShipping] = useState(0);
    const [Total, setTotal] = useState(0)
    const totalRef = useRef(0);

  

    const formRef = useRef(null);
   

    
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);

    let total = store.cart.reduce((acc, cv) => acc + cv.productPrice, 0);
    const [shippingCost, setShippingCost] = useState(null); 
    
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
    
        switch (name) {
            case 'isSweden':
                setIsSweden(checked);
                break;
            case 'isEurope':
                setIsEurope(checked);
                break;
            case 'isTracable':
                setIsTracable(checked);
                break;
            case 'isNonTracable':
                setIsNonTracable(checked);
                break;
            default:
                break;
        }
    
        // Update refs using the current state values
        isSwedenRef.current = isSweden;
        isEuropeRef.current = isEurope;
        isTracableRef.current = isTracable;
        isNonTracableRef.current = isNonTracable;
    };
    
    // ...
    

    const handleCalculateShipping = async () => {
        try {
            setIsCalculatingShipping(true);
            if (!store.cart || store.cart.length === 0) {
                console.error('Cart is empty.');
                return;
            }

            const orderWeight = store.cart.length * 80;

            const response = await fetch(
                `http://localhost:8080/calculate-shipping-rates/${isSweden.toString()}/${isEurope.toString()}/${isTracable.toString()}/${isNonTracable.toString()}/${orderWeight}`
            );

            if (response.ok) {
                const result = await response.json();
                console.log('Shipping Cost Response:', result);

                const { shippingCost, message } = result;

                if (typeof shippingCost === 'number' && !isNaN(shippingCost)) {
                    console.log('Shipping Price:', shippingCost);
                    console.log('Shipping Message:', message);

                    // Calculate the new totalWithShipping
                    const newTotalWithShipping = total + shippingCost;

                    // Update both shippingPrice and totalWithShipping
                    setShippingPrice(shippingCost);
                    setTotalWithShipping(newTotalWithShipping);

                    // Set the shippingCost in the state
                    setShippingCost(result);
                } else {
                    console.error('Invalid shipping cost:', shippingCost);
                }
            } else {
                console.error('Error calculating shipping rates');
            }
        } catch (error) {
            console.error('Error in handleCalculateShipping:', error);
        } finally {
            setIsCalculatingShipping(false);
        }
    };

    const userCheckout = async (data, actions) => {
       
        setIsPlacingOrder(true); // Set loading state
        try {
            const order = await actions.order.capture();
            console.log('Order:', order);

            const res = await fetch(ROOT + '/finalizeOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: getToken(),
                },
                body: JSON.stringify(store.cart.map((p) => p.productId)),
            });

            console.log('Response:', res);

            if (!res.ok) {
                alert('Something went wrong with finalizing the order');
                console.log(res);
                return;
            }

            console.log('Order finalized successfully');
            
        setIsPlacingOrder(false); // Set loading state
            alert('order placed !!');

            clearCart(setStore);
            navigate('/');
        } catch (error) {
            console.error('Error in userCheckout:', error);
        } finally {
            
        setIsPlacingOrder(false); // Set loading state
        }
    };

    const guestCheckout = async (e) => {
        setIsPlacingOrder(true); // Set loading state
       

        // e.preventDefault();
        // const form = e.target;
        // const data = Object.fromEntries(new FormData(form));
        try {


            console.log("Body", JSON.stringify({
                jsonPayload: JSON.stringify(store.cart.map((p) => p.productId)),
                guestOrderRequest: e,
            }))

            console.log("Json Pay Load", JSON.stringify(store.cart.map((p) => p.productId)));

            const res = await fetch(ROOT + '/finalizeGuestOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonPayload: JSON.stringify(store.cart.map((p) => p.productId)),
                    guestOrderRequest: e,
                }),
            });

            if (!res.ok) {
                alert('Something went wrong with finalizing the guest order');
                console.log(res);
                return;
            }

            console.log('Guest order finalized successfully');
            setIsPlacingOrder(false); // Reset loading state
            alert('order placed !!');
            clearCart(setStore);
            console.log("response data", res)
            navigate('/');
        } catch (error) {
            console.error('Error in guestCheckout:', error);
        } finally {
            setIsPlacingOrder(false); // Reset loading state
        }
    };




    const handleApprove = (data, actions) => {
        
        setIsPlacingOrder(true); // Set loading state(true);

        return actions.order
            .capture()
            .then(function (details) {
                const orderStatus = details.status;
                if (store.loggedIn) {
                    userCheckout(data, actions);
                    window.alert('Payment Successful');ä
                    
        setIsPlacingOrder(false); // Set loading state

                } else {
                    const form = document.getElementById('guestCheckoutForm');
                    const formData = Object.fromEntries(new FormData(form));
                    guestCheckout(formData);
                }
            })
            .catch((err) => {
                console.error('Capture Error', err);
                window.alert('Payment Failed');
            })
            .finally(() => {
                
        setIsPlacingOrder(false); // Set loading state
            });
    };



   /*  useEffect(() => {
        handleCalculateShipping(isSweden, isEurope, isTracable, isNonTracable);
    }, [isSweden, isEurope, isTracable, isNonTracable]);
    
    useEffect(() => {
        handleCalculateShipping();
    }, [isSwedenRef.current, isEuropeRef.current, isTracableRef.current, isNonTracableRef.current]);
     */

    useEffect(() => {
        handleCalculateShipping(isSwedenRef.current, isEuropeRef.current, isTracableRef.current, isNonTracableRef.current);
    }, [isSwedenRef.current, isEuropeRef.current, isTracableRef.current, isNonTracableRef.current]);
    

    useEffect(() => {
        totalRef.current = total;
        const calculateTotalWithShipping = () => {
            setTotalWithShipping(total + (shippingPrice || 0));
        };
        console.log("totalshippingUseEffect", totalWithShipping);
        calculateTotalWithShipping();
    }, [total, shippingPrice]);


    return (
        <div>
            <h3>Your order</h3>
            {store.cart.length ? (
                <>
                    <form id="cart_form">
                        <div id="cart">
                            {store.cart.map((p, i) => {
                                function remove() {
                                    setStore((current) => {
                                        current.cart.splice(
                                            current.cart.findIndex((item) => item.productId === p.productId),
                                            1
                                        );
                                        return { ...current };
                                    });
                                }

                                return (
                                    <div className="cart-item" key={p.productName + i}>
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
                                Total: {store && store.cart ? `¤${totalWithShipping.toFixed(2)}` : 'N/A'}
                            </h4>
                            <div className="shipping-form">
            <label>
                <input
                    type="checkbox"
                    name="isSweden"
                    checked={isSweden}
                    onChange={handleCheckboxChange}
                />
                Sweden
            </label>
            <label>
                <input
                    type="checkbox"
                    name="isEurope"
                    checked={isEurope}
                    onChange={handleCheckboxChange}
                />
                Europe
            </label>
            <label>
                <input
                    type="checkbox"
                    name="isTracable"
                    checked={isTracable}
                    onChange={handleCheckboxChange}
                />
                Tracable
            </label>
            <label>
                <input
                    type="checkbox"
                    name="isNonTracable"
                    checked={isNonTracable}
                    onChange={handleCheckboxChange}
                />
                Non-Tracable
            </label>
        </div>
                            <button type="button" onClick={handleCalculateShipping}>
                                Calculate Shipping Rates
                            </button>
                            {shippingPrice !== null && !isNaN(shippingPrice) && (
                                <div>
                                    Shipping Cost: ¤{Number(shippingPrice).toFixed(2)}
                                    {shippingCost && shippingCost.message && <span> ({shippingCost.message})</span>}
                                </div>
                            )}
                             {isPlacingOrder  && <div className="loading-icon"><i className="fas fa-spinner fa-spin"></i></div>}
                             {isFinalizingOrder && <div className="loading-icon"><i className="fas fa-spinner fa-spin"></i></div>}
                            {isCalculatingShipping && <div className="loading-icon">Calculating Shipping...</div>}
                        
                        </div>
                    </form>
                    {/* Display guest checkout form only if there are items in the cart and the user is not logged in */}
                    {store.cart.length > 0 && !store.loggedIn && (
                        <GuestCheckoutForm guestCheckout={guestCheckout} />
                    )}
                    <PayPalScriptProvider options={payPalOptions}>
                    <PayPalButtons
createOrder={(data, actions) => {
    console.log('createOrder function called');
    const orderWeight = store.cart.length * 80;

    // Directly use the state values
    const isSweden = isSwedenRef.current.toString();
    const isTracable = isTracableRef.current.toString();
    const isEurope = isEuropeRef.current.toString();
    const isNonTracable = isNonTracableRef.current.toString();

    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(
                `http://localhost:8080/calculate-shipping-rates/${isSweden}/${isEurope}/${isTracable}/${isNonTracable}/${orderWeight}`
            );

            if (response.ok) {
                const result = await response.json();
                console.log('Shipping Cost Response:', result);

                const { shippingCost } = result;

                if (typeof shippingCost === 'number' && !isNaN(shippingCost)) {
                    console.log('Shipping Price:', shippingCost);

                    const totalWithShippingValue = (total + shippingCost).toFixed(2);

                    resolve(
                        actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: totalWithShippingValue,
                                        currency_code: 'SEK',
                                    },
                                },
                            ],
                        })
                    );
                } else {
                    console.error('Invalid shipping cost:', shippingCost);
                    reject(new Error('Invalid shipping cost'));
                }
            } else {
                console.error('Error calculating shipping rates');
                reject(new Error('Error calculating shipping rates'));
                console.log(isSweden)
                console.log(isTracable)
                console.log(isEurope)
                console.log(isNonTracable)
                console.log(orderWeight)
                const isSweden = isSwedenRef.current.toString();
                const isTracable = isTracableRef.current.toString();
                const isEurope = isEuropeRef.current.toString();
                const isNonTracable = isNonTracabaleRef.current.toString()
            }
        } catch (error) {
            console.error('Error in createOrder:', error);
            reject(error);
        }
    });
}}
onApprove={(paypalData, actions) => handleApprove(paypalData, actions)}
onSuccess={(details, paypalData) => {
    console.log('Transaction completed by ' + details.payer.name);
}}
onError={(err) => {
    console.error('PayPal error', err);
}}
/>
</PayPalScriptProvider>
</>
) : (
<div>Your cart is empty.</div>
)}
</div>
);
}