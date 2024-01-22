import ProductModal from "./ProductModal"

// this is a hook
/*
    // useState returns an array of two items, so destructure it
    1. the state
    2. a function for updating the state
*/
import { useState } from "react"

// take in props via the parameters of your component

export default function ProductCard({p}) {

    p.image ??= `https://picsum.photos/seed/${p.productName}/500/500`

    let [modalShown, setModalShown] = useState(false)

    function handleClick() {
        setModalShown(true)
    }

    const displayPrice = p.productPrice.toFixed(2)

  return (
    <>
        <button className="product-card" onClick={handleClick}>
            {/* <h1>{count}</h1> */}
            <img src={p.image} alt="" />
            <div className="info">
                <h3>{p.productName}</h3>
                <div className="price">¤{displayPrice}</div>
                {/* <div className="type">{p.type}</div> */}
            </div>
        </button>
        {/* This only shows if modalShown is true */}
        {modalShown && (
            <ProductModal p={p} setModalShown={setModalShown} />
        )}
    </>
  )
}