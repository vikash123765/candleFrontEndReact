// an atom is like global state
import { atom } from 'jotai'

const storeAtom = atom({
    cart: [],
    guestCart: [],
    orders: [],
    loggedIn: false,
    adminLoggedIn: false // Add adminLoggedIn to the initial state
})

const updateStore = (setStore, obj) => {
    setStore(current => {
        Object.entries(obj).forEach(([key,val]) => {
            current[key] = val
        })
        return {...current}
    })
}
console.log("storeAtom", storeAtom)

export {
    storeAtom,
    updateStore
}