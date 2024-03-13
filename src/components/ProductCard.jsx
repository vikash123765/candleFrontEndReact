import React, { useState } from "react";
import ProductModal from "./ProductModal";

import Iphone14ProMaxPlainCaseImage from "../ProductImages/Iphone_14_pro_max_case_plain.png";
import Iphone15PlainCover from "../ProductImages/Iphone15PlainCase.jpg";
import iphone14proMaxPrint1 from "../ProductImages/iphone14proMaxPrint1.webp";
import iphone14proMaxPrint2 from "../ProductImages/iphone14proMaxPrint2.webp";
import iphone14proMaxPrint3 from "../ProductImages/iphone14proMaxPrint3.webp";
import iphone14proMaxBlue from "../ProductImages/iphone14proMaxBlue.jpg"
import iphone14proMaxBlack from "../ProductImages/iphone14proMaxBlack.jpg"
import iphone14proMaxWhite from "../ProductImages/iphone14proMaxWhite.jpg"

export default function ProductCard({ p }) {
  console.log("vikasproducts", parseFloat)
  const [image, setImage] = useState("");
  const [modalShown, setModalShown] = useState(false);

  // Map product IDs to local storage image paths
  const imageMapping = {
    4: Iphone14ProMaxPlainCaseImage, // Use the actual product ID here
    14: Iphone15PlainCover, // Use the actual product ID here
    5: iphone14proMaxPrint1,
    9: iphone14proMaxPrint2,
    8: iphone14proMaxPrint3,
    10: iphone14proMaxBlue,
    11: iphone14proMaxBlack,
    12: iphone14proMaxWhite,
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
        {image && <img src={image} alt={image} />}
        <div className="info">
          <h3>{p.productName}</h3>
          <div className="price">€{displayPrice}</div>
        </div>
      </button>
      {modalShown && <ProductModal p={updatedProduct} image={image} setModalShown={setModalShown} />}
    </>
  );
}
