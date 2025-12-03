import React, { useContext, useEffect, useState } from 'react'

import { CardComponent } from '../components/CardComponent'
import { ProductContext } from '../context/ProductContext'
import { CartContext } from '../context/CartContext'
import '../styles/ProductsPage.css';


export const ProductsPage = () => {

    const { products } = useContext(ProductContext)
    const { addProduct, removeProduct } = useContext(CartContext)

    return (
        <>
            <h1>Productos</h1>
            <hr />
            <div className="products-grid">
            {products.map(product => (
                <CardComponent
                    key={product.id}
                    id={product.id}
                    image={product.image}
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    handleAdd={() => addProduct(product)}
                    handleRemove={()=> removeProduct(product.id)}
                />

            )
            )}
            </div>
        </>
    )
}
