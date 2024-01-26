import { getAllProducts } from "../lib/api"
import { useEffect, useState, useRef } from "react"
import ProductCard from "../components/ProductCard"
import { Slider } from '@mui/material'

/*
    {
    "productId": 1,
    "productType": "PlAIN_CASES",
    "productName": "iphone14 pro",
    "productDescription": "made in china",
    "productAvailable": true,
    "productPrice": 33,
    "cartItems": [],
    "guestCartItems": [],
    "image": "https://picsum.photos/seed/iphone14 pro/500/500"
    }
*/

const MIN_PRICE = 0
const MAX_PRICE = 400

export default function Products() {

    const [products, setProducts] = useState([])
    const [types, setTypes] = useState([])
    const [priceRangeValues, setPriceRangeValues] = useState([0, 300])
    const [filteredProducts, setFilteredProducts] = useState(null)
    const searchRef = useRef(null)

    function createProductDTOs(pdx) {
        return pdx.map(p => {
            p.type = p.productType.toLowerCase().replaceAll('_',' ')
            return p
        })
    }

    useEffect(()=>{
        getAllProducts()
            .then(pdx => {
                pdx = createProductDTOs(pdx)
                // console.log("getAllProducts:", pdx)
                setProducts(pdx)
                // console.log(pdx[0])
                let typesArr = pdx.map(p => p.productType)
                setTypes([...new Set(typesArr)])
            })
            .catch(err => {
                console.log(err)
            })
    },[])

    useEffect(()=>{
        if (!filteredProducts) return
        
    }, [filteredProducts])

    useEffect(()=>{
        setProductRange()
    }, [priceRangeValues])

    function filterByType(e) {
        const val = e.target.value
        if (val === 'all') {
            setFilteredProducts(null)
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
        setFilteredProducts(null)
    }

    function sortProducts(e) {
        if (!e.target.value) return
        setFilteredProducts(products.toSorted((a, b) => {
            switch(e.target.value) {
                case 'price-d':
                    return b.productPrice - a.productPrice
                case 'price-a':
                    return a.productPrice - b.productPrice
                case 'name-d':
                    return b.productName.localeCompare(a.productName)
                case 'name-a':
                    return a.productName.localeCompare(b.productName)
            }
        }))
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
                            {type.toLowerCase().replaceAll('_',' ')}
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
                    {/* <option value="name-d">Name (descending)</option>
                    <option value="name-d">Name (ascending)</option> */}
                </select>
            </div>
            <Slider
                getAriaLabel={()=>'Price range'}
                min={0}
                max={300}
                defaultValue={[0, 300]}
                marks={[
                    {value: 0, label: '¤0'},
                    {value: 300, label: '¤300'}
                ]}
                onChange={handlePriceRangeSlider}
                valueLabelDisplay="auto"
            />
        </div>    
        <div id="products">
            {(filteredProducts||products).map(p => {
                return (
                    <ProductCard key={`pcard-${p.productId}`} p={p} />
                )
            })}
        </div>
    </>
  )
}