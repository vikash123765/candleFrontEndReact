 import { useAtom } from "jotai"
import { storeAtom } from "../lib/store"

import Order from "../components/Order"

/*
  {
    "orderId": 1,
    "delivered": false,
    "userName": "newtural",
    "order placed : ": null, ❌
    "sent": false,
    "products": [
      {
        "productName": "phone13",
        "productType": "PlAIN_CASES",
        "productPrice": 31
      },
      {
        "productName": "galxy s7",
        "productType": "PlAIN_CASES",
        "productPrice": 12
      }
    ],
    "total Cost": 43
  }
*/
export default function Orders() {

    const [store, setStore] = useAtom(storeAtom)
    console.log(store.orders)

  return (
    <div id="orders-container">
      <h2>Your orders</h2>
      <div id="orders">
        {store.orders.map((order, i) => {

          return <Order key={order.orderId} order={order} orderIndex={i} />
        })}
      </div>
    </div>
  )
} 