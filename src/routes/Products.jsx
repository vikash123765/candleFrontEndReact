import React, { useEffect, useState, useRef } from "react";
import ProductCard from "../components/ProductCard";
import { getAllProducts, getProductsByIds } from "../lib/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const [soldOutIds, setSoldOutIds] = useState([]);
  const [noProductsFound, setNoProductsFound] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Number of products to load per page
  const observerRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const pdx = await getAllProducts();
        const productsWithDTOs = createProductDTOs(pdx);
        setProducts(productsWithDTOs);

        const typesArr = productsWithDTOs.map(p => p.productType);
        setTypes([...new Set(typesArr)]);

        const soldOutProducts = await getProductsByIds([]);
        const ids = soldOutProducts.map(p => p.productId);
        setSoldOutIds(ids);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products);
      setDisplayedProducts(products.slice(0, productsPerPage));
    }
  }, [products]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreProducts();
      }
    });
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [filteredProducts]);

  // Function to create DTOs for products
  function createProductDTOs(pdx) {
    if (!Array.isArray(pdx)) {
      return [];
    }
    return pdx.map(p => ({
      ...p,
      productType: p.productType.toLowerCase().replaceAll('_', ' ')
    }));
  }

  // Function to filter products based on type and search query
  function filterProducts(products, selectedType, query) {
    let filtered = [...products];

    // Perform filtering based on search query
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

    // Filter by selected type (if not 'all')
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.productType === selectedType);
    }

    return filtered;
  }

  // Update filtered products and displayed products based on filtered data
  function updateFilteredProducts(filtered) {
    setFilteredProducts(filtered);
    setDisplayedProducts(filtered.slice(0, productsPerPage));
    setCurrentPage(1); // Reset pagination to first page
    setNoProductsFound(filtered.length === 0); // Set noProductsFound flag
  }

  // Handle type change filter
  function handleTypeChange(event) {
    const selectedType = event.target.value;
    const filtered = filterProducts(products, selectedType, searchQuery);
    updateFilteredProducts(filtered);
  }

  // Handle search input change
  function handleSearch(event) {
    // Check if Enter key was pressed (keyCode 13) or button was clicked
    if (event.key === 'Enter' || event.type === 'click') {
      const query = searchRef.current.value.trim().toLowerCase(); // Access input value using useRef
      setSearchQuery(query);
      const filtered = filterProducts(products, document.getElementById("typeFilter").value, query);
      updateFilteredProducts(filtered);
    }
  }

  // Sort products based on selected option
  function sortProducts(event) {
    const sortBy = event.target.value;
    let sortedProducts = [...filteredProducts];

    if (sortBy === 'price-d') {
      sortedProducts.sort((a, b) => b.productPrice - a.productPrice || a.productType.localeCompare(b.productType));
    } else if (sortBy === 'price-a') {
      sortedProducts.sort((a, b) => a.productPrice - b.productPrice || a.productType.localeCompare(b.productType));
    } else if (sortBy === 'all') {
      sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));
    }

    updateFilteredProducts(sortedProducts);
  }

  // Function to load more products for pagination
  const loadMoreProducts = () => {
    const nextPage = currentPage + 1;
    const indexOfLastProduct = nextPage * productsPerPage;
    const newProducts = filteredProducts.slice((nextPage - 1) * productsPerPage, indexOfLastProduct);

    if (newProducts.length > 0) {
      setDisplayedProducts(prevProducts => [...prevProducts, ...newProducts]);
      setCurrentPage(nextPage);
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Pagination click handler
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    const indexOfLastProduct = pageNumber * productsPerPage;
    const newProducts = filteredProducts.slice((pageNumber - 1) * productsPerPage, indexOfLastProduct);
    setDisplayedProducts(newProducts);
    window.scrollTo(0, 0); // Scroll to top when changing page
  };
  
  return (
    <>
      <div id="product-filters">
        <div>
          <label htmlFor="typeFilter">Type</label>
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
          <label htmlFor="searchInput">Search</label>
          <input
            type="search"
            id="searchInput"
            ref={searchRef}
            onKeyDown={handleSearch}
            onChange={handleSearch}
          />
          <button onClick={handleSearch} id="searchButton">Search</button>
        </div>
        <div>
          <label htmlFor="sortFilter">Filter</label>
          <select id="sortFilter" onChange={sortProducts}>
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
          displayedProducts.map(p => (
            <ProductCard key={`pcard-${p.productId}`} p={p} isSoldOut={soldOutIds.includes(p.productId)} />
          ))
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex' }}>
        
    
  
            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={`page-${index}`}>
                <button
                  onClick={() => handlePageClick(index + 1)}
                  style={{
                    margin: '0 5px',
                    fontWeight: currentPage === index + 1 ? 'bold' : 'normal',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  {index + 1}
                </button>
              </li>
            ))}
  
         
          </ul>
        </div>
      )}
    </>
  );
}  