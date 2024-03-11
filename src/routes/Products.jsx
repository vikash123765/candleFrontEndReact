import { getAllProducts } from "../lib/api";
import { useEffect, useState, useRef } from "react";
import ProductCard from "../components/ProductCard";



export default function Products() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [priceRangeValues, setPriceRangeValues] = useState([0, 300]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    // Fetch products and set types
    getAllProducts()
      .then(pdx => {
        pdx = createProductDTOs(pdx);
        setProducts(pdx);
        let typesArr = pdx.map(p => p.productType);
        setTypes([...new Set(typesArr)]);
      })
      .catch(err => {
        console.log(err);
      });
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    setProductRange();
  }, [priceRangeValues, products]); // Updated dependency array

  function createProductDTOs(pdx) {
    return pdx.map(p => {
      p.type = p.productType.toLowerCase().replaceAll('_', ' ');
      return p;
    });
  }

  function filterByType(e) {
    const val = e.target.value;
    if (val === 'all') {
      setFilteredProducts([]);
      return;
    }

    setFilteredProducts(products.filter(p => p.productType === val));
  }

  function searchByName() {
    const query = searchRef.current.value.toLowerCase();
    setFilteredProducts(products.filter(p => {
      const words = p.productName.split(' ').map(w => w.toLowerCase());
      return words.includes(query) || query === p.productName.toLowerCase();
    }));
  }

  function resetProducts() {
    setFilteredProducts([]);
  }

  function sortProducts(e) {
    const sortBy = e.target.value;
    if (!sortBy || !filteredProducts) return;

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-d') {
        return b.productPrice - a.productPrice;
      } else if (sortBy === 'price-a') {
        return a.productPrice - b.productPrice;
      } else if (sortBy === 'category' || sortBy === 'all') {
        return a.productType.localeCompare(b.productType);
      }

      return 0;
    });

    setFilteredProducts([...sortedProducts]);
  }

  function handlePriceRangeSlider(e, values) {
    setPriceRangeValues(values);
  }

  function setProductRange() {
    const [rangeMin, rangeMax] = priceRangeValues;

    const uniqueFilteredProducts = new Set(products.filter(p => (
      p.productPrice >= rangeMin && p.productPrice <= rangeMax
    )));

    setFilteredProducts([...uniqueFilteredProducts]);
  }

  return (
    <>
      <div id="product-filters">
        <div>
          Type
          <select onChange={filterByType}>
            <option value="all">
              All
            </option>
            {types.map(type => (
              <option value={type} key={type}>
                {type.toLowerCase().replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div>
          Name
          <input type="search" ref={searchRef} />
          <button onClick={searchByName}>
            Search
          </button>
          <button onClick={resetProducts}>
            Reset
          </button>
        </div>
        <div>
          Sort by
          <select onChange={sortProducts}>
            <option value=""></option>
            <option value="price-d">Price (descending)</option>
            <option value="price-a">Price (ascending)</option>
          </select>
        </div>

      </div>
      <div id="products">
        {(filteredProducts.length > 0 ? Array.from(filteredProducts) : products).map(p => (
          <ProductCard key={`pcard-${p.productId}`} p={p} filteredProducts={filteredProducts} />
        ))}
      </div>
    </>
  );
}
