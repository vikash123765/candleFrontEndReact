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
        console.log("Fetching products...");
        const pdx = await getAllProducts();
        const productsWithDTOs = createProductDTOs(pdx);
        setProducts(productsWithDTOs);

        const typesArr = productsWithDTOs.map(p => p.productType);
        setTypes([...new Set(typesArr)]);
        console.log("Products fetched:", productsWithDTOs);
        console.log("Types set:", types);
      } catch (err) {
        console.log("Error fetching products:", err);
      }
    }

    fetchProducts();

    // Mark products as sold out
    async function markProductsSoldOut() {
      try {
        console.log("Marking products as sold out...");
        const soldOutProducts = await getProductsByIds([25, 35,19]);
        const ids = soldOutProducts.map(p => p.productId);
        setSoldOutIds(ids);
        console.log("Sold out product IDs:", ids);
        console.log("Products marked as sold out:", soldOutIds);
      } catch (err) {
        console.log("Error marking products as sold out:", err);
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

  function handlePriceRangeSlider(e, values) {
    setPriceRangeValues(values);
  }

  function sortProducts(e) {
    const sortBy = e.target.value;
    if (!sortBy || !filteredProducts) return;
  
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-d') {
        return b.productPrice - a.productPrice;
      } else if (sortBy === 'price-a') {
        return a.productPrice - b.productPrice;
      } else if (sortBy === 'category') {
        return a.productType.localeCompare(b.productType);
      } else if (sortBy === 'all') {
        return a.productName.localeCompare(b.productName);
      }
  
      return 0;
    });
  
    setFilteredProducts(sortedProducts);
  }

  function handleSearch(event) {
    if (event.key === 'Enter' || event.keyCode === 13) { // Added this condition to check if Enter key is pressed
      const query = searchQuery.trim().toLowerCase().replace(/\s+/g, ''); // remove spaces and convert to lowercase
      let filtered = products;
    
      if (query) {
        filtered = products.filter(p => {
          const productNameWithoutSpaces = p.productName.toLowerCase().replace(/\s+/g, ''); // remove spaces and convert to lowercase
          return productNameWithoutSpaces.includes(query) || query === productNameWithoutSpaces;
        });
      }
    
      const selectedType = document.getElementById("typeFilter").value;
      if (selectedType !== 'all') {
        filtered = filtered.filter(p => p.productType === selectedType);
      }
    
      setFilteredProducts(filtered);
    }
  }
  
  

  return (
    <>
      <div id="product-filters">
        <div>
          Type
          <select id="typeFilter" onChange={handleSearch}>
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
            <option value="price-d">Price (descending)</option>
            <option value="price-a">Price (ascending)</option>
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
