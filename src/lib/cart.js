function addToCart_localStorage(p) {
    const lsCart = getCart_localStorage()
    // add the procut to the cart
    lsCart.push(p)
    // stringify the cart and add it to localStorage
    localStorage.setItem('cart', JSON.stringify(lsCart))
}

function getCart_localStorage() {
    // getting the cart from localStorage, and parsing it as json. If it's null, parse the string "[]" into an empty array.
    return JSON.parse(localStorage.getItem('cart')||"[]")
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
