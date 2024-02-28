import { getAllProducts } from "../lib/api"
import { useEffect, useState, useRef } from "react"
import ProductCard from "../components/ProductCard"
import { Slider } from '@mui/material'

const MIN_PRICE = 0
const MAX_PRICE = 400

export default function Products() {

    const [products, setProducts] = useState([])
    const [types, setTypes] = useState([])
    const [priceRangeValues, setPriceRangeValues] = useState([0, 300])
    const [filteredProducts, setFilteredProducts] = useState([]) // Initialize with an empty array instead of null
    const searchRef = useRef(null)

    function createProductDTOs(pdx) {
        return pdx.map(p => {
            p.type = p.productType.toLowerCase().replaceAll('_', ' ')
            return p
        })
    }

    useEffect(() => {
        getAllProducts()
            .then(pdx => {
                pdx = createProductDTOs(pdx)
                setProducts(pdx)
                let typesArr = pdx.map(p => p.productType)
                setTypes([...new Set(typesArr)])
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        setProductRange()
    }, [priceRangeValues])

    function filterByType(e) {
        const val = e.target.value
        console.log(val, "valx")
        if (val === 'all') {
            setFilteredProducts([])
            return
        }
        setFilteredProducts(products.filter(p => {
            return p.productType === val
        }))
    }

    function searchByName() {
        const query = searchRef.current.value.toLowerCase()
        setFilteredProducts(products.filter(p => {
            const words = p.productName.split(' ').map(w => w.toLowerCase())
            return words.includes(query) || query === p.productName.toLowerCase()
        }))
    }

    function resetProducts() {
        setFilteredProducts([])
    }

    function sortProducts(e) {
        const sortBy = e.target.value;
        if (!sortBy) return;
    
        const sortedProducts = [...filteredProducts].sort((a, b) => {
            if (sortBy === 'price-d') {
                return b.productPrice - a.productPrice;
            } else if (sortBy === 'price-a') {
                return a.productPrice - b.productPrice;
            } else if (sortBy === 'category' || sortBy === 'all') {
                // Sort by productType (category) for all categories, including 'all'
                return a.productType.localeCompare(b.productType);
            }
    
            // Handle other sorting cases
            // Add more conditions if needed
    
            return 0;
        });
    
        setFilteredProducts([...sortedProducts]);
    }
    
      
    


    function handlePriceRangeSlider(e, values) {
        setPriceRangeValues(values)
    }

    function setProductRange() {
        const [rangeMin, rangeMax] = priceRangeValues
        setFilteredProducts(products.filter(p => {
            return p.productPrice >= rangeMin && p.productPrice <= rangeMax
        }))
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
                {/*      <Slider
                getAriaLabel={()=>'Price range'}
                min={MIN_PRICE} // Use MIN_PRICE instead of 0
                max={MAX_PRICE} // Use MAX_PRICE instead of 300
                defaultValue={[0, 300]}
                marks={[
                    {value: 0, label: `¤${MIN_PRICE}`},
                    {value: 300, label: `¤${MAX_PRICE}`}
                ]}
                onChange={handlePriceRangeSlider}
                valueLabelDisplay="auto"
            /> */}
            </div>
            <div id="products">
                {(filteredProducts.length > 0 ? filteredProducts : products).map(p => {
                    return (
                        <ProductCard key={`pcard-${p.productId}`} p={p} />
                    )
                })}
            </div>
        </>
    )
}
