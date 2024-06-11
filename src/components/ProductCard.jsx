import React, { useState,useEffect } from "react";
import ProductModal from "./ProductModal";

import Iphone14ProMaxPlainCaseImage from "../ProductImages/iphone 14 pro max plain case slicone.jpg";
import Iphone15PlainCover from "../ProductImages/iphone 15 plain case silicone.jpg";
import a14premiumRubberPinkLotus from "../ProductImages/a14 premium rubber case pink lotus flower.jpg";
import iphone14ProMaxBLue from "../ProductImages/iphone 15 black silicone.jpg";

import s23BlueMoon from "../ProductImages/blue moon sislicone case s23 ultra.jpg";
import s23Blue from "../ProductImages/s23 ultra blue case sislicone.jpg";
import s24PLain from "../ProductImages/s24 ultra plain case sislicone.jpg";
import s23CrystalRosePremiumRubber from "../ProductImages/crystal rose red premium rubber samsung s23.jpg";
import iphone15MountainLakePremiumRubber from "../ProductImages/iphone 15 gray mountain  lake premium rubber case.jpg";
import s23UltraAnimatedTreePremiumRubber from "../ProductImages/animated tree  samsung s23 ultra premium rubber case .jpg";


export default function ProductCard({p, isSoldOut}) {
  const [imageHeight, setImageHeight] = useState('300px'); // Default height for larger screens
  console.log("vikasproducts", parseFloat)
  const [image, setImage] = useState("");
  const [modalShown, setModalShown] = useState(false);

  // Map product IDs to local storage image paths
  const imageMapping = {
    9: Iphone14ProMaxPlainCaseImage, // Use the actual product ID here
    11: Iphone15PlainCover, // Use the actual product ID here
    10: a14premiumRubberPinkLotus,
    12:iphone14ProMaxBLue,
    13: s23BlueMoon,
    14: s23Blue,
    15:s24PLain ,
    16:s23CrystalRosePremiumRubber,
    17:iphone15MountainLakePremiumRubber,
    18:s23UltraAnimatedTreePremiumRubber

    // Add more entries as needed
  };

  // Set image based on product ID
  const newImage = imageMapping[p.productId];
  console.log(p.productId, " p.productId", "newImage", newImage, "image", image)

  if (newImage !== image) {
    setImage(newImage);
  }
  // const updatedProduct = Object.assign({}, p, { image: newImage });
  const updatedProduct = { ...p, image: newImage };
  const displayPrice = p.productPrice.toFixed(2);

  const handleClick = () => {
    if (!isSoldOut) {
      setModalShown(true);
    }
  };

  const closeModal = () => {
    setModalShown(false);
  };

  console.log("Rendering with Image:", image);


   
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth <= 600) {
      setImageHeight('200px'); // Set height to 200px for mobile screens
    } else {
      setImageHeight('300px'); // Set height to 300px for larger screens
    }
  };

  window.addEventListener('resize', handleResize);
  handleResize();

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

return (
  <>
    <button 
      className={`product-card ${isSoldOut ? 'sold-out' : ''}`} 
      onClick={handleClick} 
      disabled={isSoldOut}
      style={{ 
        width: '100%', 
        height: 'auto', 
        padding: '0', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between'
      }}
    >
      {image && (
        <img 
          src={image} 
          alt={image} 
          style={{ 
            width: '100%', 
            height: imageHeight, 
            objectFit: 'cover', 
            borderRadius: '0.5rem',
            display: 'block',
            opacity: isSoldOut ? '0.5' : '1'  // Dim the image for sold out products
          }} 
        />
      )}
  <div className="info">
        <h3>{p.productName}</h3>
        <div className="price">
        {isSoldOut ? (
    <div>
      {['14', '15', '16', '23', '24', '25','34', '35', '36'].includes(p.productId.toString()) && (
        <span style={{ textDecoration: 'line-through', color: '#FF6666' }}>SEK120</span>
      )}
      {['20', '21', '22', '17', '18', '19', '37', '38', '39'].includes(p.productId.toString()) && (
        <span style={{ textDecoration: 'line-through', color: '#FF6666' }}>SEK110</span>
      )}
      {['12', '13', '33'].includes(p.productId.toString()) && (
        <span style={{ textDecoration: 'line-through', color: '#FF6666' }}>SEK100</span>
      )}
      {' '}SEK{displayPrice} (Sold Out)
    </div>
  ) : (
    <div>
      {['14', '15', '16', '23', '24', '25','34', '35', '36'].includes(p.productId.toString()) && (
        <span style={{ textDecoration: 'line-through', color: '#FF6666' }}>SEK120</span>
      )}
      {['20', '21', '22', '17', '18', '19', '37', '38', '39'].includes(p.productId.toString()) && (
        <span style={{ textDecoration: 'line-through', color: '#FF6666' }}>SEK110</span>
      )}
      {['12', '13', '33'].includes(p.productId.toString()) && (
        <span style={{ textDecoration: 'line-through', color: '#FF6666' }}>SEK100</span>
      )}
      {' '}SEK{displayPrice}

      </div>
      

    )}

        </div>
      </div>
    </button>

    {modalShown && <ProductModal p={updatedProduct} image={image} setModalShown={setModalShown} />}
  </>
);
}