import React, { useState, useEffect } from "react";
import ProductModal from "./ProductModal";

import Iphone14ProMaxPlainCaseImage from "../ProductImages/iphone14ProMaxPlainCaseSlicone.jpg";
import Iphone15PlainCover from "../ProductImages/iphone15PlainCaseSilicone.jpg";
import siliconeSamuraiChnieaseLettersIphone14ProMax from "../ProductImages/iphone14ProMaxSamuraiChineaseLetters.jpg";
import iphone14proMaxPrint2 from "../ProductImages/iphone14proMaxPrint2.webp";
import iphone14proMaxPrint3 from "../ProductImages/iphone14proMaxPrint3.webp";
import iphone14proMaxBlue from "../ProductImages/iphone14proMaxBlue.jpg";
import iphone14proMaxBlack from "../ProductImages/iphone14proMaxBlack.jpg";
import iphone15Black from "../ProductImages/iphone15Black.webp";
import iphone14proMaxWhite from "../ProductImages/iphone14proMaxWhite.jpg";
import iphone15White from "../ProductImages/iphone15white.webp";
import iphone15blue from "../ProductImages/iphone15Blue.webp";

import iphone15print1 from "../ProductImages/iphone15print3.jpeg";
import iphone15print2 from "../ProductImages/iphone15print2.jpeg";
import iphone15print3 from "../ProductImages/iphone15print1.jpeg";

import s23plain from "../ProductImages/s23plain.webp";
import s23Black from "../ProductImages/s23Black.jpeg";
import s23white from "../ProductImages/s23White.jpeg";
import s23blue from "../ProductImages/s23blue.jpeg";

import s23print1 from "../ProductImages/s23print1.jpg";
import s23print2 from "../ProductImages/s23print2.jpeg";
import s23print3 from "../ProductImages/s23print3.jpeg";

import rubberCaseiphone14 from "../ProductImages/iphone pro max rubber.jpg";

export default function ProductCard({ p, isSoldOut }) {
  const [imageHeight, setImageHeight] = useState('300px'); // Default height for larger screens
  const [image, setImage] = useState("");
  const [modalShown, setModalShown] = useState(false);

  // Map product IDs to local storage image paths
  const imageMapping = {
    1: Iphone14ProMaxPlainCaseImage, // Use the actual product ID here
    2: Iphone15PlainCover, // Use the actual product ID here
    3: siliconeSamuraiChnieaseLettersIphone14ProMax,
    15: iphone14proMaxPrint2,
    16: iphone14proMaxPrint3,
    17: iphone14proMaxBlue,
    18: iphone14proMaxBlack,
    19: iphone14proMaxWhite,
    20: iphone15Black,
    21: iphone15White,
    22: iphone15blue,
    23: iphone15print1,
    24: iphone15print2,
    25: iphone15print3,
    34: s23print1,
    35: s23print2,
    36: s23print3,
    37: s23blue,
    38: s23Black,
    39: s23white,
    33: s23plain,
    41: rubberCaseiphone14
    // Add more entries as needed
  };

  // Set image based on product ID
  useEffect(() => {
    const newImage = imageMapping[p.productId];
    setImage(newImage);
  }, [p.productId]);

  const updatedProduct = { ...p, image };
  const displayPrice = p.productPrice.toFixed(2);

  const handleClick = () => {
    if (!isSoldOut) {
      setModalShown(true);
    }
  };

  const closeModal = () => {
    setModalShown(false);
  };

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
                {['14', '15', '16', '23', '24', '25', '34', '35', '36'].includes(p.productId.toString()) && (
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
                {['14', '15', '16', '23', '24', '25', '34', '35', '36'].includes(p.productId.toString()) && (
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
