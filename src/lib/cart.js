function addToCart_localStorage(p, loggedIn) {
    const lsCart = getCart_localStorage()
    // add the procut to the cart
    lsCart.push(p)
    // stringify the cart and add it to localStorage
    let key = loggedIn ? 'cart' : 'guest-cart'
    localStorage.setItem(key, JSON.stringify(lsCart))
}

function getCart_localStorage(loggedIn) {
    let key = loggedIn ? 'cart' : 'guest-cart'
    let cart = JSON.parse(localStorage.getItem(key)||"[]")
    if (loggedIn) {
        if (cart.length) {
            // if user is logged in and already has items in cart
            return cart
        } else {
            // if the user is logged in but their cart is empty, check if there is a guest cart
            return JSON.parse(localStorage.getItem('guest-cart')||"[]")
        }
    }
    // getting the cart from localStorage, and parsing it as json. If it's null, parse the string "[]" into an empty array.
    return JSON.parse(localStorage.getItem(key)||"[]")
}

function clearCart(setStore) {
    localStorage.removeItem('cart')
    setStore(current => {
        current.cart = []
        return {...current}
    })
}


export {
    addToCart_localStorage,
    getCart_localStorage,
    clearCart
}
