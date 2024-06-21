import React, { useState,useEffect } from "react";
import ProductModal from "./ProductModal";

import Iphone14ProMaxPlainCaseImage from "../ProductImages/iphone 14 pro max plain case slicone.jpg";
import Iphone15PlainCover from "../ProductImages/iphone 15 plain case silicone.jpg";
import a14premiumRubberPinkLotus from "../ProductImages/a14 premium rubber case pink lotus flower.jpg";
import iphone15black from "../ProductImages/iphone 15 black silicone.jpg";


import s23Blue from "../ProductImages/s23 ultra blue case sislicone.jpg";
import s24PLain from "../ProductImages/s24 ultra plain case sislicone.jpg";
import s23CrystalRosePremiumRubber from "../ProductImages/crystal rose red premium rubber samsung s23.jpg";
import iphone15MountainLakePremiumRubber from "../ProductImages/iphone 15 gray mountain  lake premium rubber case.jpg";
import s23UltraAnimatedTreePremiumRubber from "../ProductImages/animated tree  samsung s23 ultra premium rubber case .jpg";
import a14PLain from "../ProductImages/a14 sislicone case plain.jpg";
import Iphone14ProMaxNightSkyMountainPremiumRubber from "../ProductImages/iphone 14 pro max premium rubber case  night sky mountain.jpg";
import a14NorthernLights from "../ProductImages/samsung a14 preium rubber northen lights.jpg";
import s23IndianCheif from "../ProductImages/s23 ultra  indian cheif premium rubber case.jpg";
import s23PLain from "../ProductImages/s23 plain case silicone.jpg";
import iphone15RedEyeWorrior from "../ProductImages/iphone 15 pro premium case red eye worrior.jpg";
import s23OceanMountain from "../ProductImages/s23 ultra premium rubber case ocean mountain.jpg";
import a14black from "../ProductImages/black silicone case samsung a14 .jpg";
import s23black from "../ProductImages/black s23 silicone case .jpg";

import s23UltraAstrounutMoon from "../ProductImages/s23 ultra sislicone astronaut moon.jpg";
import s23Maldives from "../ProductImages/maldives s23  and s24 silicone case .jpg";

import Iphone15BlueMoon from "../ProductImages/iphone15BlueMoon.png";

import s23blumoon from "../ProductImages/s23 blue moon.png";
import s23lion from "../ProductImages/s23lion.png";

import iphon15lion from "../ProductImages/iphon15lion.png";


import a14milkyway from "../ProductImages/a14milkyway.png";
import iphone14promaxmilkyway from "../ProductImages/iphone14promax milky way.png";
import iphone15milkyway from "../ProductImages/iphone15milkyway.png";
import s23MilkyWay from "../ProductImages/s23MilkyWay.png";

import iphone15TropicalIsland from "../ProductImages/iphone15TropicalIsland.png";
import s23TropicalIsland from "../ProductImages/s23TropicalIsland.png";



import iphone15tajmahal from "../ProductImages/iphone 15tajmahal.png";
import s24tajmahal from "../ProductImages/s24tajmahal.png";

import s23WaterFall from "../ProductImages/s23WaterFall.png";
import iphone15waterfall from "../ProductImages/iphone15waterfall.png";
import a14waterFall from "../ProductImages/a14waterFall.png";

import a14Madlives from "../ProductImages/a14Madlives.png";


import s23Mountainreflection from "../ProductImages/s23Mountainreflection.png";
import a14mountainreflection from "../ProductImages/a14mountainreflection.png";



import moonEclipseamuraiIphone14ProMax from "../ProductImages/MoonEclipseamuraiIphone14ProMax.png";

import iphone15Pinapple from "../ProductImages/iphone15Pinapple.png";

import iphone15Blue from "../ProductImages/iphone15Blue.png";

import a14tajMahal from "../ProductImages/a14tajMahal.png";
import iphone14pinkbackroundsamuraipremiumrubber from "../iphone 14 pro max premium rubber case pink backround samurai.png";


export default function ProductCard({p, isSoldOut}) {
  const [imageHeight, setImageHeight] = useState('300px'); // Default height for larger screens
  console.log("vikasproduscts", parseFloat)
  const [image, setImage] = useState("");
  const [modalShown, setModalShown] = useState(false);

  // Map product IDs to local storage image paths
  const imageMapping = {
    9: Iphone14ProMaxPlainCaseImage, // Use the actual product ID here
    11: Iphone15PlainCover, // Use the actual product ID here
    10: a14premiumRubberPinkLotus,
    12:iphone15black,
    14: s23Blue,
    15:s24PLain ,
    16:s23CrystalRosePremiumRubber,
    17:iphone15MountainLakePremiumRubber,
    18:s23UltraAnimatedTreePremiumRubber,
    19:a14PLain,
    20:s23PLain,
    21:a14NorthernLights,
    22:Iphone14ProMaxNightSkyMountainPremiumRubber,
    23:s23IndianCheif,
    24:iphone15RedEyeWorrior,
    25:s23OceanMountain,
    26:a14black,
    27:s23black,
    30:s23UltraAstrounutMoon,
    31:s23Maldives,
    34:Iphone15BlueMoon,
    72:s23blumoon,
    38:s23lion,
    40:iphon15lion,
    45:a14milkyway,
    46:iphone14promaxmilkyway,
    47:iphone15milkyway,
    48:s23MilkyWay,
    49:iphone15TropicalIsland,
    50:s23TropicalIsland,
    53:iphone15tajmahal,
    54:s24tajmahal,
    55:s23WaterFall,
    56:iphone15waterfall,
    57:a14waterFall,
    58:a14Madlives,
    60:s23Mountainreflection,
    61:a14mountainreflection,
    65:moonEclipseamuraiIphone14ProMax,
    66:iphone15Pinapple,
    71:iphone15Blue,
    73:a14tajMahal,
    74:iphone14pinkbackroundsamuraipremiumrubber













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
      className={`product-card ${isSoldOut ? "sold-out" : ""}`}
      onClick={handleClick}
      disabled={isSoldOut}
      style={{
        width: "100%",
        height: "auto",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // Ensures items start from the top
        border: "none",
        backgroundColor: "transparent",
      }}
    >
      {image && (
        <img
          src={image}
          alt={image}
          style={{
            width: "100%",
            height: imageHeight,
            objectFit: "cover",
            borderRadius: "0.5rem",
            border: '1px solid #ccc',
            display: "block",
            opacity: isSoldOut ? "0.5" : "1", // Dim the image for sold out products
          }}
        />
      )}
      <div
        className="info"
        style={{
          padding: "0.5rem", // Ensure there is no extra margin or padding
          textAlign: "left",
          marginTop: "0",
          flexGrow: 1, // Makes sure the div takes all available space
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem 0" }}>{p.productName}</h3>
        <div
          className="price"
          style={{
            margin: "0",
            alignSelf: "flex-end", // Aligns the price to the right
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {isSoldOut ? (
            <div>
              {['10', '16', '17', '18', '22', '23', '21', '25', '24'].includes(p.productId.toString()) && (
                <span style={{ textDecoration: "line-through", color: "#FF6666" }}>SEK160</span>
              )}
              {['26','12','13', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69']
                .includes(p.productId.toString()) && (
                <span style={{ textDecoration: "line-through", color: "#FF6666" }}>SEK110</span>
              )}
              {['9','11', '15', '19','20', '14'].includes(p.productId.toString()) && (
                <span style={{ textDecoration: "line-through", color: "#FF6666" }}>SEK100</span>
              )}
              {" "}SEK{displayPrice} (Sold Out)
            </div>
          ) : (
            <div>
             {['10', '16', '17', '18', '22', '23', '21', '25', '24'].includes(p.productId.toString()) && (
                <span style={{ textDecoration: "line-through", color: "#FF6666" }}>SEK160</span>
              )}
               {['26','12','13', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69']
                .includes(p.productId.toString()) && (
                <span style={{ textDecoration: "line-through", color: "#FF6666" }}>SEK110</span>
              )}
              {['9','11', '15', '19','20', '14'].includes(p.productId.toString()) && (
                <span style={{ textDecoration: "line-through", color: "#FF6666" }}>SEK100</span>
              )}
              {" "}SEK{displayPrice}
            </div>
          )}
        </div>
      </div>
    </button>

    {modalShown && <ProductModal p={updatedProduct} image={image} setModalShown={setModalShown} />}
  </>
);
}