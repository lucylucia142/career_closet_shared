import React, { useEffect, useState } from 'react'
const API = import.meta.env.VITE_API_BASE_URL;
const About = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}:3000/products`)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <div className='text-2xl text-center pt-8 border-t'>
        <div className='inline-flex gap-2 items-center mb-3'>
          <p className='text-gray-500'>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
          <div className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></div>
        </div>
      </div>

      {/* Products Section */}
      <div className='my-10 mx-4 sm:mx-8 lg:mx-16 xl:mx-24'>
        <h2 className='text-xl font-semibold text-gray-800 mb-6 text-center'>
          Some of Our Featured Products
        </h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products.length > 0 ? (
            products.slice(0, 4).map((product) => (
              <div
                key={product._id}
                className='border rounded-lg p-4 hover:shadow-md transition-shadow text-center'
              >
                <img
                  src={product.image || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className='w-full h-40 object-cover mb-3 rounded'
                />
                <h3 className='font-semibold text-gray-800'>{product.name}</h3>
                <p className='text-gray-600 text-sm'>{product.category}</p>
                <p className='text-gray-700 font-medium mt-2'>R {product.price}</p>
              </div>
            ))
          ) : (
            <p className='text-center text-gray-500 col-span-full'>
              Loading products...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default About
