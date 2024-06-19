import { useAtom } from 'jotai';
import { useState } from 'react';
import { storeAtom } from '../lib/store';
import { addToCart_localStorage } from '../lib/cart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import '../style/modal.css';

export default function ProductModal({ p, image, setModalShown }) {
  const [store, setStore] = useAtom(storeAtom);
  const [stagedItems, setStagedItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAddToCartDisabled, setIsAddToCartDisabled] = useState(false);

  const closeModal = () => {
    setModalShown(false);
  };

  function addToCart() {
    setStore(current => {
      current.cart.push(p);
      addToCart_localStorage(p, store.loggedIn);
      return { ...current };
    });
  }

  function countInCart(productId) {
    return store.cart.filter(item => item.productId === productId).length;
  }

  function addToStagedItems() {
    const newStagedItems = [...stagedItems, p];
    setStagedItems(newStagedItems);
    clearErrorMessage(); // Clear error message on count change
  }

  function removeFromStagedItems() {
    const newStagedItems = stagedItems.slice(0, stagedItems.length - 1);
    setStagedItems(newStagedItems);
    clearErrorMessage(); // Clear error message on count change
  }

  async function addStagedItemsToCart() {
    // Calculate total items including staged items
    let totalInCart = countInCart(p.productId) + stagedItems.length;

    try {
      // Make an API call to check product availability
      const response = await fetch('https://api.vtscases.com/addToCartLimit', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'productId': p.productId,
          'count': totalInCart
        }
      });

      if (response.ok) {
        // Add staged items to cart
        for (let i = 0; i < stagedItems.length; i++) {
          addToCart();
        }
        // Clear staged items and close modal
        setStagedItems([]);
        closeModal();
        // Reset error state and re-enable Add to Cart button
        setErrorMessage('');
        setIsAddToCartDisabled(false);
      } else {
        // Handle error response
        const errorMessage = await response.text();
        setErrorMessage(errorMessage); // Set error message
        setIsAddToCartDisabled(true); // Disable the add to cart button

        // Reset totalInCart to 0
        totalInCart = 0;
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setErrorMessage("An error occurred while adding the product to the cart. Please try again later.");
    }
  }

  function clearErrorMessage() {
    setErrorMessage('');
    setIsAddToCartDisabled(false);
  }

  const displayPrice = p.productPrice.toFixed(2);
  const productType = p.productType.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="product-modal_backdrop" onClick={closeModal}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{p.productName}</h3>
          <button onClick={closeModal}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">
          <div className="left">
            {image && <img className="product-modal_image" src={image} alt="" style={{ border: '1px solid #ccc', borderRadius: '0.5rem' }} />}
          </div>
          <div className="right">
            <div>{productType}</div>
            <div>Description: {p.productDescription}</div>
            <div className="buttons-container">
              <div className="buttons row">
                <div className="col-3">
                  <button onClick={removeFromStagedItems} className="remove">
                    <RemoveIcon />
                  </button>
                </div>
                <div className="col-3">
                  <button onClick={addToStagedItems} className="add">
                    <AddIcon />
                  </button>
                </div>
                <div className="cart col-3">
                  <button disabled={stagedItems.length < 1 || isAddToCartDisabled} onClick={addStagedItemsToCart}>
                    Add {stagedItems.length} to cart
                  </button>
                </div>
                <div className="col-3">
                  <h4 className="price-mobile">Kr {displayPrice}</h4>
                </div>
              </div>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




