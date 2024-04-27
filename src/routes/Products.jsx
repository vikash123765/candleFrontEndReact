import { getAllProducts,getProductsByIds } from "../lib/api";
import { useEffect, useState, useRef } from "react";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [priceRangeValues, setPriceRangeValues] = useState([0, 300]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const [soldOutIds, setSoldOutIds] = useState([]); 

  useEffect(() => {
    // Fetch products annd set types
    async function fetchProducts() {
      try {
        const pdx = await getAllProducts();
        const productsWithDTOs = createProductDTOs(pdx);
        setProducts(productsWithDTOs);

        const typesArr = productsWithDTOs.map(p => p.productType);
        setTypes([...new Set(typesArr)]);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProducts();

    // Mark products as sold out
    async function markProductsSoldOut() {
      try {
        const soldOutProducts = await getProductsByIds([12, 34, 14]);
        const ids = soldOutProducts.map(p => p.productId);
        setSoldOutIds(ids);
      } catch (err) {
        console.log(err);
      }
    }

    markProductsSoldOut();
  }, []); 

  useEffect(() => {
    setProductRange();
  }, [priceRangeValues, products]);

  function createProductDTOs(pdx) {
    return pdx.map(p => {
      p.type = p.productType.toLowerCase().replaceAll('_', ' ');
      return p;
    });
  }

  function filterProducts() {
    setSearchQuery(searchRef.current.value.toLowerCase());
  }

  function setProductRange() {
    const [rangeMin, rangeMax] = priceRangeValues;
    const uniqueFilteredProducts = products.filter(p => (
      p.productPrice >= rangeMin && p.productPrice <= rangeMax
    ));
    setFilteredProducts(uniqueFilteredProducts);
  }
function handleTypeChange(event) {
  const selectedType = event.target.value;
  let filtered = [...products]; // Make a copy of products array

  const query = searchQuery.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter(p => {
      const productNameWithoutSpaces = p.productName.toLowerCase().replace(/\s+/g, '');
      return productNameWithoutSpaces.includes(query) || query === productNameWithoutSpaces;
    });
  }

  if (selectedType !== 'all') {
    filtered = filtered.filter(p => p.productType === selectedType);
  }

  setFilteredProducts(filtered);
}

function handleSearch(event) {
  if (event.key === 'Enter' || event.keyCode === 13 || event.target.id === 'searchButton' || event.type === 'click') {
    const query = searchQuery.trim().toLowerCase();
    let filtered = [...products]; // Make a copy of products array

    if (query) {
      const searchTerms = query.split(" ");
      filtered = filtered.filter(p => {
        const productNameWithoutSpaces = p.productName.toLowerCase().replace(/\s+/g, '');
        const typeWithoutSpaces = p.productType.toLowerCase().replace(/\s+/g, '');
        // Check if any search term appears anywhere in the product name or type
        return searchTerms.every(term =>
          productNameWithoutSpaces.includes(term) ||
          typeWithoutSpaces.includes(term) ||
          String(p.productPrice).includes(term) ||
          String(p.productId).includes(term)
        );
      });
    }

    const selectedType = document.getElementById("typeFilter").value;
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.productType === selectedType);
    }

    // Set a state variable to indicate if no products were found
    setNoProductsFound(filtered.length === 0);

    setFilteredProducts(filtered);
  }
}

function sortProducts(event) {
  const sortBy = event.target.value;
  let sortedProducts = [...filteredProducts]; // Use the currently filtered products

  if (sortBy === 'price-d') {
    sortedProducts.sort((a, b) => b.productPrice - a.productPrice);
  } else if (sortBy === 'price-a') {
    sortedProducts.sort((a, b) => a.productPrice - b.productPrice);
  } else if (sortBy === 'category') {
    sortedProducts.sort((a, b) => a.productType.localeCompare(b.productType));
  } else if (sortBy === 'all') {
    sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));
  }

  setFilteredProducts(sortedProducts);
}

  

  return (
    <>
      <div id="product-filters">
        <div>
          Type
          <select id="typeFilter" onChange={handleTypeChange}>
            <option value="all">All</option>
            {types.map(type => (
              <option value={type} key={type}>
                {type.toLowerCase().replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div>
          Search
          <input type="search" ref={searchRef}  onKeyDown={handleSearch} onChange={filterProducts} />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div>
          Sort by
          <select onChange={sortProducts}>
            <option value=""></option>
            <option value="price-d">Price (High-low)</option>
            <option value="price-a">Price (Low-High)</option>
          </select>
        </div>
      </div>
      <div id="products">
        {filteredProducts.map(p => (
                  <ProductCard key={`pcard-${p.productId}`} p={p} isSoldOut={soldOutIds.includes(p.productId)}/>
        ))}
      </div>
    </>
  );
}

