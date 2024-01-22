/*
    Rendering JSX conditionally

    {value && (
        <>
        </>
    )}

    only renders if value is truthy
*/


export default function Order({order, orderIndex}) {
  return !order.orderId ? (
    <div>Failed loading order</div>
  )
  :(
    <div className="order" key={order.orderId}>
        <h4>Order id#{order.orderId}</h4>

        <div className="order-badges">
            {order.sent && (
                <div className="order-badge sent">
                    SENT
                </div>
            )}
            {order.delivered && (
                <div className="order-badge delivered">
                    DELIVERED
                </div>
            )}
        </div>
        
        <div className="order-products">
        {order.products.map((product, productIndex) => {
        
            return (
            <div className="order-product" key={productIndex}>
                <h5>{product.productName}</h5>
                <p>¤{product.productPrice}</p>
            </div>
            )
        })}
        </div>
    </div>
  )
}