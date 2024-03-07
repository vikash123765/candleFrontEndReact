import React, { useState } from "react";
import ProductModal from "./ProductModal";
import Iphone14ProMaxPlainCaseImage from "../ProductImages/Iphone_14_pro_max_case_plain.png";

export default function ProductCard({ p }) {
  const [image, setImage] = useState("");
  const [modalShown, setModalShown] = useState(false);

  // Map product names to local storage image paths
  const imageMapping = {
    "Iphone 14 pro max plain case": Iphone14ProMaxPlainCaseImage,
    "Iphone 14 pro max printed case style1": "/ProductImages/product2.jpg",
    // Add more entries as needed
  };

  // Set image based on product name
  const newImage = imageMapping[p.productName] || `https://picsum.photos/seed/${p.productName}/500/500`;
  if (newImage !== image) {
    setImage(newImage);
  }

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
        {image && <img src={image} alt={p.productName} />}
        <div className="info">
          <h3>{p.productName}</h3>
          <div className="price">¤{displayPrice}</div>
        </div>
      </button>
      {modalShown && <ProductModal p={p} image={image} setModalShown={setModalShown} />}
    </>
  );
}
