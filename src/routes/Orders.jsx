import { useAtom } from "jotai";
import { storeAtom } from "../lib/store";

import Order from "../components/Order";

export default function Orders() {
    const [store, setStore] = useAtom(storeAtom);

    return (
        <div id="orders-container">
            <h2>Your orders</h2>
            <div id="orders">
                {store.orders.map((order, i) => (
                    <Order key={`${order.orderId}-${i}`} order={order} orderIndex={i} />
                ))}
                  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7185928504834368"
     crossorigin="anonymous"></script>
            </div>
        </div>
    );
}
