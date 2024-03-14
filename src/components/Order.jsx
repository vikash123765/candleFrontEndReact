/*
    Rendering JSX conditionally

    {value && (
        <>
        </>
    )}

    only renders if value is truthy

    npm i dayjs
*/

import dayjs from 'dayjs'

export default function Order({ order, orderIndex }) {
    const orderCreated = dayjs(order.orderCreated).format("ddd D MMM YYYY");
  
    console.log("Order object:", order); // Log the order object to the console
    return ( 

      <div className="order" key={order.orderId}>
      
        {!order.orderId ? (
          <div>No orders placed yet!</div>
        ) : (
          <>
                   <h4>Order id#{order.orderId}</h4>
                    {order.trackingId && <p>Tracking ID: {order.trackingId}</p>}
                    <p>Created {orderCreated}</p>
  
            <div className="order-badges">

              {order.sent ? (
                <div className="order-badge sent">SENT</div>
              ) : (
                <div className="order-badge not">NOT SENT</div>
              )}
              {order.delivered ? (
                <div className="order-badge delivered">DELIVERED</div>
              ) : (
                <div className="order-badge not">NOT DELIVERED</div>
              )}
               
            </div>
   
            <div className="order-products">
              {order.products.map((product, productIndex) => (
                <div className="order-product" key={productIndex}>
                  <h5>{product.productName}</h5>
                  <p>¤{product.productPrice}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
  