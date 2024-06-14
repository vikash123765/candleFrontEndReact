import { useEffect, useState, useRef } from "react";
import ProductCard from "../components/ProductCard";
import { getAllProducts, getProductsByIds } from "../lib/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [priceRangeValues, setPriceRangeValues] = useState([0, 300]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const [soldOutIds, setSoldOutIds] = useState([]);
  const [noProductsFound, setNoProductsFound] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Number of products per page

  useEffect(() => {
    async function fetchData() {
      try {
        const pdx = await getAllProducts();
        const productsWithDTOs = createProductDTOs(pdx);
        setProducts(productsWithDTOs);

        const typesArr = productsWithDTOs.map(p => p.productType);
        setTypes([...new Set(typesArr)]);

        const soldOutProducts = await getProductsByIds([12, 34, 14]);
        const ids = soldOutProducts.map(p => p.productId);
        setSoldOutIds(ids);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredProducts(products); // Initialize filtered products with all products
  }, [products]);

  function createProductDTOs(pdx) {
    if (!Array.isArray(pdx)) {
      return [];
    }
    return pdx.map(p => ({
      ...p,
      productType: p.productType.toLowerCase().replaceAll('_', ' ')
    }));
  }

  function setProductRange() {
    const [rangeMin, rangeMax] = priceRangeValues;
    const uniqueFilteredProducts = products.filter(p => (
      p.productPrice >= rangeMin && p.productPrice <= rangeMax
    ));
    setFilteredProducts(uniqueFilteredProducts);
    setCurrentPage(1); // Reset to first page when price range changes
  }

  function handleTypeChange(event) {
    const selectedType = event.target.value;
    let filtered = [...products];

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      const searchTerms = query.split(" ");
      filtered = filtered.filter(p => {
        const productNameWithoutSpaces = p.productName.toLowerCase().replace(/\s+/g, '');
        const typeWithoutSpaces = p.productType.toLowerCase().replace(/\s+/g, '');
        return searchTerms.every(term =>
          productNameWithoutSpaces.includes(term) ||
          typeWithoutSpaces.includes(term) ||
          String(p.productPrice).includes(term) ||
          String(p.productId).includes(term)
        );
      });
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.productType === selectedType);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when type filter changes
  }

  function handleSearch(event) {
    const query = event.target.value;
    setSearchQuery(query);

    if (event.key === 'Enter' || event.keyCode === 13 || event.target.id === 'searchButton' || event.type === 'click') {
      let filtered = [...products]; // Make a copy of products array
  
      if (query) {
        const searchTerms = query.trim().toLowerCase().split(" ");
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
    let sortedProducts = [...filteredProducts];
  
    if (sortBy === 'price-d') {
      sortedProducts.sort((a, b) => {
        if (b.productPrice === a.productPrice) {
          return a.productType.localeCompare(b.productType);
        }
        return b.productPrice - a.productPrice;
      });
    } else if (sortBy === 'price-a') {
      sortedProducts.sort((a, b) => {
        if (a.productPrice === b.productPrice) {
          return a.productType.localeCompare(b.productType);
        }
        return a.productPrice - b.productPrice;
      });
    } else if (sortBy === 'all') {
      sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));
    }
  
    setFilteredProducts(sortedProducts);
    setCurrentPage(1); // Reset to first page when sorting changes
  }
  

  // Calculate current products to display based on pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Pagination click handler
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top when changing page
  };

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
          <input type="search" ref={searchRef} value={searchQuery} onChange={handleSearch} onKeyDown={handleSearch} />
          <button onClick={handleSearch} id="searchButton">Search</button>
        </div>
        <div>
          Sort by
          <select onChange={sortProducts}>
            <option value=""></option>
            <option value="price-d">Price (High-low)</option>
            <option value="price-a">Price (Low-High)</option>
            <option value="all">Alphabetical</option>
          </select>
        </div>
      </div>
      <div id="products">
        {noProductsFound ? (
          <div>Sorry, no products match your search.</div>
        ) : (
          currentProducts.map(p => (
            <ProductCard key={`pcard-${p.productId}`} p={p} isSoldOut={soldOutIds.includes(p.productId)} />
          ))
        )}
      </div>
     {/* Pagination */}
     <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center' }}>
          {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
            <li key={i} style={{ margin: '0 5px' }} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button style={{ textDecoration: 'none', backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc', padding: '5px 10px', cursor: 'pointer' }} className="page-link" onClick={() => handlePageClick(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
