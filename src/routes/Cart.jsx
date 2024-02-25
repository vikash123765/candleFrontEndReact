import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { storeAtom } from '../lib/store';
import { ROOT, getToken } from '../lib/api.js';
import { clearCart } from '../lib/cart.js';
import { useNavigate } from 'react-router-dom';
import GuestCheckoutForm from '../components/GuestCheckoutForm.jsx';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const payPalOptions = {
    clientId: 'AW4rF3ytyCzS2oxIhUE_Ihw-ifEVIRKICnYfvZiUqi8-E_XJ-r2xyquy7H1XN0Z2GGEoUCLV_uEdec5_',
    currency: 'SEK',
};

export default function Cart() {
    const navigate = useNavigate();
    const [store, setStore] = useAtom(storeAtom);
    const [isSweden, setIsSweden] = useState(true);
    const [isTracable, setIsTracable] = useState(false);
    const [shippingPrice, setShippingPrice] = useState(null);
    const [totalWithShipping, setTotalWithShipping] = useState(0);
    const [Total, setTotal] = useState(0)
    let total = store.cart.reduce((acc, cv) => acc + cv.productPrice, 0);
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        if (name === 'isSweden') {
            setIsSweden(checked);
        } else if (name === 'isTracable') {
            setIsTracable(checked);
        }
    };

   const handleCalculateShipping = async () => {
        if (!store.cart || store.cart.length === 0) {
            console.error('Cart is empty.');
            return;
        }

        const orderWeight = store.cart.length * 80;

        try {
            const response = await fetch(
                `http://localhost:8080/calculate-shipping-rates/${isSweden.toString()}/${isTracable.toString()}/${orderWeight}`
            );

            if (response.ok) {
                const result = await response.json();
                console.log('Shipping Price:', result.shippingCost);
                setShippingPrice(result.shippingCost);
                const newTotalWithShipping = total + result.shippingCost;
                setTotalWithShipping(newTotalWithShipping);
            } else {
                console.error('Error calculating shipping rates');
            }
        } catch (error) {
            console.error('Error in handleCalculateShipping:', error);
        }
    };

    const userCheckout = async (data, actions) => {
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
            clearCart(setStore);
            navigate('/');
        } catch (error) {
            console.error('Error in userCheckout:', error);
        }
    };

    const guestCheckout = async (data, actions) => {
        try {
            const order = await actions.order.capture();
            console.log('Order:', order);

            const res = await fetch(ROOT + '/finalizeGuestOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonPayload: JSON.stringify(store.cart.map((p) => p.productId)),
                    guestOrderRequest: data,
                }),
            });

            if (!res.ok) {
                alert('Something went wrong with finalizing the guest order');
                console.log(res);
                return;
            }

            console.log('Guest order finalized successfully');
            clearCart(setStore);
            navigate('/');
        } catch (error) {
            console.error('Error in guestCheckout:', error);
        }
    };



    const handleApprove = (data, actions) => {
        return actions.order
            .capture()
            .then(function (details) {
                const orderStatus = details.status;
                if (store.loggedIn) {
                    userCheckout(data, actions);
                    window.alert('Payment Successful');
                } else {
                    guestCheckout(data, actions);
                }
                console.log('Order Status:', orderStatus);
            })
            .catch((err) => {
                console.error('Capture Error', err);
                window.alert('Payment Failed');
            });
    };


    useEffect(() => {
        const calculateTotal = () => {
            const newTotal = store.cart.reduce((acc, cv) => acc + cv.productPrice, 0);
            setTotal(newTotal);
        };
        calculateTotal();
    }, [store.cart]);

    useEffect(() => {
        const calculateTotalWithShipping = () => {
            setTotalWithShipping(prevTotalWithShipping => prevTotalWithShipping = total + (shippingPrice || 0));
        };
       console.log("totalshippingUseEffect", totalWithShipping)
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
                                        name="isTracable"
                                        checked={isTracable}
                                        onChange={handleCheckboxChange}
                                    />
                                    Tracable
                                </label>
                            </div>
                            <button type="button" onClick={handleCalculateShipping}>
                                Calculate Shipping Rates
                            </button>
                            {/* Display shipping price if available */}
                            {shippingPrice !== null && !isNaN(shippingPrice) && (
                                <div>
                                    Shipping Price: ¤{Number(shippingPrice).toFixed(2)}
                                </div>
                            )}
                        </div>
                    </form>
                    {/* Display guest checkout form only if there are items in the cart and the user is not logged in */}
                    {store.cart.length > 0 && !store.loggedIn && <GuestCheckoutForm guestCheckout={guestCheckout} />}
                    <PayPalScriptProvider options={payPalOptions}>
                        <PayPalButtons
                            createOrder={(data, actions) => {
                                console.log('Total with Shipping', totalWithShipping.toFixed(2));
                                console.log('Total', total.toFixed(2));
                                console.log('Total with shipping price', shippingPrice ? shippingPrice.toFixed(2) : '0.00');

                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: totalWithShipping,
                                                currency_code: 'SEK',
                                                breakdown: {
                                                    item_total: {
                                                        currency_code: 'SEK',
                                                        value: total,
                                                    },
                                                    shipping: {
                                                        currency_code: 'SEK',
                                                        value: shippingPrice ? shippingPrice.toFixed(2) : '0.00',
                                                    },
                                                },
                                            },
                                            items: store.cart.map((product) => ({
                                                name: product.productName,
                                                quantity: '1',
                                                category: 'PHYSICAL_GOODS',
                                                unit_amount: {
                                                    currency_code: 'SEK',
                                                    value: product.productPrice.toFixed(2),
                                                },
                                            })),
                                        },
                                    ],
                                });
                            }}
                            onApprove={(data, actions) => {
                                return handleApprove(data, actions);
                            }}
                            onSuccess={(details, data) => {
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
