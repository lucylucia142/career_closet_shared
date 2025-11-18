import React, { useEffect, useState } from "react"
const API = import.meta.env.VITE_API_BASE_URL;
const OurPolicy = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}:3000/products`)
        const data = await response.json()

        // You can adjust how many to show — here we take the first 3 products
        setProducts(data.slice(0, 3))
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className="max-w-[250px] mx-auto">
            <img
              src={product.image || "https://via.placeholder.com/150"}
              className="w-24 h-24 object-cover rounded-full m-auto mb-5 shadow-md"
              alt={product.name}
            />
            <p className="font-semibold">{product.name}</p>
            <p className="text-gray-400">
              {product.description
                ? product.description.slice(0, 60) + "..."
                : "No description available"}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 w-full text-center">Loading featured products...</p>
      )}
    </div>
  )
}

export default OurPolicy
