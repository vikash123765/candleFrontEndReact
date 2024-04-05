import { useAtom } from 'jotai'
import { useState } from 'react'
import { storeAtom } from '../lib/store'
import { addToCart_localStorage } from '../lib/cart'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import '../style/modal.css';
// you can pass a state-setting-function as a prop
// npm i jotai


export default function ProductModal({ p, image, setModalShown }) {
  const [store, setStore] = useAtom(storeAtom)
  const [stagedItems, setStagedItems] = useState([])


  const closeModal = () => {
    setModalShown(false);
  };


  function addToCart() {
    // console.log(store.cart)
    setStore(current => {
      current.cart.push(p)
      addToCart_localStorage(p, store.loggedIn)
      // return a copy of the current store, so react notices the change
      return { ...current }
    })
  }

  function removeFromCart() {
    setStore(current => {
      current.cart.splice(
        current.cart.findIndex(i => i.productId === p.productId),
        1
      )
      return { ...current }
    })
  }

  function countInCart() {
    // count the number of matching products
    let count = store.cart.filter(item => {
      return item.productName === p.productName
    }).length
    return count
  }

  function addToStagedItems() {
    setStagedItems([...stagedItems, p])
  }

  function removeFromStagedItems() {
    setStagedItems([...stagedItems.slice(0, stagedItems.length - 1)])
  }

  function addStagedItemsToCart() {
    for (let i = 0; i < stagedItems.length; i++) {
      addToCart()
    }
    setStagedItems([])
    closeModal()
  }

  const displayPrice = p.productPrice.toFixed(2)
  let producttype= p.productType;
 

  // Convert the productType string to display in title case
  let formattedProductType = producttype.toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  


  return (
    <div className="product-modal_backdrop" onClick={closeModal}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{p.productName}</h3>
          <button onClick={closeModal}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">
          <div className="left">
            {image && <img className="product-modal_image" src={image} alt="" />}
          </div>
          <div className="right">

          <div>{formattedProductType}</div>
            <div>Description: {p.productDescription}</div>
              <div className="buttons-container">

                <div className="buttons row">

                  <div className='col-3'>
                    <button onClick={removeFromStagedItems} className='remove'>
                      <RemoveIcon />
                    </button>
                  </div>
                  <div className='col-3'>
                    <button onClick={addToStagedItems} className='add'>
                      <AddIcon />
                    </button>
                  </div>
                  <div className='cart col-3'>
                    <button disabled={stagedItems.length < 1} onClick={addStagedItemsToCart}>
                      Add {stagedItems.length} to cart
                    </button>

                  </div>
                  <div className='col-3'>
                    <h4 className="price-mobile"> Kr{displayPrice}</h4>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}