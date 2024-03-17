import React, { useState } from "react";
import ProductModal from "./ProductModal";

import Iphone14ProMaxPlainCaseImage from "../ProductImages/Iphone_14_pro_max_case_plain.png";
import Iphone15PlainCover from "../ProductImages/Iphone15PlainCase.jpg";
import iphone14proMaxPrint1 from "../ProductImages/iphone14proMaxPrint1.webp";
import iphone14proMaxPrint2 from "../ProductImages/iphone14proMaxPrint2.webp";
import iphone14proMaxPrint3 from "../ProductImages/iphone14proMaxPrint3.webp";
import iphone14proMaxBlue from "../ProductImages/iphone14proMaxBlue.jpg";
import iphone14proMaxBlack from "../ProductImages/iphone14proMaxBlack.jpg";
import iphone15Black from "../ProductImages/iphone15Black.webp"
import iphone14proMaxWhite from "../ProductImages/iphone14proMaxWhite.jpg"
import iphone15White from "../ProductImages/iphone15white.webp"
import iphone15blue from "../ProductImages/iphone15Blue.webp"

import iphone15print1 from "../ProductImages/iphone15print3.jpeg"
import iphone15print2 from "../ProductImages/iphone15print2.jpeg"
import iphone15print3 from "../ProductImages/iphone15print1.jpeg"

import s23plain from "../ProductImages/s23plain.webp"
import s23Black from "../ProductImages/s23Black.jpeg"
import s23white from "../ProductImages/iphone15white.webp"
import s23blue from "../ProductImages/s23blue.jpeg"

import s23print1 from "../ProductImages/s23print1.jpg"
import s23print2 from "../ProductImages/s23print2.jpeg"
import s23print3 from "../ProductImages/s23print3.jpeg"






export default function ProductCard({ p }) {
  console.log("vikasproducts", parseFloat)
  const [image, setImage] = useState("");
  const [modalShown, setModalShown] = useState(false);

  // Map product IDs to local storage image paths
  const imageMapping = {
    1: Iphone14ProMaxPlainCaseImage, // Use the actual product ID here
    14: Iphone15PlainCover, // Use the actual product ID here
    5: iphone14proMaxPrint1,
    9: iphone14proMaxPrint2,
    8: iphone14proMaxPrint3,
    10: iphone14proMaxBlue,
    11: iphone14proMaxBlack,
    12: iphone14proMaxWhite,
    19:iphone15Black,
    18:iphone15White,
    16:iphone15blue,
    20:iphone15print1,
    21:iphone15print2,
    22:iphone15print3,
    23:s23print1,
    24:s23print2,
    25:s23print3,
    27:s23blue,
    28:s23Black,
    29:s23white,
    26:s23plain,

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
    setModalShown(true);
  };

  const closeModal = () => {
    setModalShown(false);
  };

  console.log("Rendering with Image:", image);

  return (
    <>
      <button className="product-card" onClick={handleClick}>
      {image && <img src={image} alt={image} style={{ width: '100%', height: '250px',  objectFit: 'cover', borderRadius: '0.5rem' }} />}



   

   
        <div className="info">
          <h3>{p.productName}</h3>
          <div className="price">
            SEK{displayPrice}</div>
        </div>
      </button>
      {modalShown && <ProductModal p={updatedProduct} image={image} setModalShown={setModalShown} />}
    </>
  );
}
