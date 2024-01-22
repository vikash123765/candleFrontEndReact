// getAllProducts is an async function that will fetch all the products
import { getProductsByIds } from "../lib/api.js"

import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"

import ProductCard from "../components/ProductCard.jsx"

// since it's async we must await it
// let products = await getAllProducts()
// let products = []
// console.log(products)


export default function Home() {

    const [products, setProducts] = useState([])
    useEffect(()=>{
        getProductsByIds([1, 2, 3])
            .then(p => {
                setProducts(p)
            })
            .catch(err => {
                console.log(err)
            })
    },[])

  return (
    <>
        <section id="hero">
            <h2>Shop and save</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit similique id animi ea quo itaque rerum voluptatem alias quis quaerat totam accusamus numquam eveniet, in cupiditate iusto nihil unde maxime delectus quod? Amet cupiditate adipisci autem eligendi impedit natus distinctio deleniti? Necessitatibus pariatur reiciendis esse nobis tempore provident minus ipsa deserunt, et maxime quam fugiat eveniet blanditiis dolores eum sequi quasi explicabo ab. Eius dolores, rerum quidem eligendi nesciunt deserunt? Eaque rem repellat cupiditate asperiores! Necessitatibus recusandae nemo expedita repellendus quam vel possimus reiciendis molestias quae dolor vero ipsum, voluptatum neque sit earum voluptatem vitae hic id aut doloremque sapiente.</p>
        </section>
        <section id="products">
            {products.map(p => {
                return (
                    <ProductCard key={`pcard-${p.productId}`} p={p} />
                )
            })}
        </section>
        <Link to="/products">See all products</Link>
    </>
  )
}