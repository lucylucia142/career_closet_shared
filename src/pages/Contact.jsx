import React, { useEffect, useState } from 'react'
 const API = import.meta.env.VITE_API_BASE_URL;
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [products, setProducts] = useState([]) // products from MongoDB
  const [loading, setLoading] = useState(true)

  // Fetch products from MongoDB backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}:3000/products`) // adjust to your backend URL
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Input handling
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim() || formData.message.trim().length < 10)
      newErrors.message = 'Message must be at least 10 characters'
    return newErrors
  }

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors)

    setIsSubmitting(true)
    setTimeout(() => {
      alert('Message sent! We’ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <div className='inline-flex gap-2 items-center mb-3'>
          <p className='text-gray-500'>
            CONTACT <span className='text-gray-700 font-medium'>US</span>
          </p>
          <div className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></div>
        </div>
      </div>

      {/* Contact Form */}
      <div className='my-10 flex flex-col md:flex-row gap-16 mx-4 sm:mx-8 lg:mx-16 xl:mx-24'>
        <div className='md:w-3/5'>
          <div className='bg-white border border-gray-300 rounded-lg p-8'>
            <h2 className='text-xl font-semibold text-gray-800 mb-6'>Send us a Message</h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                placeholder='Your Name'
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-gray-500'
                }`}
              />
              {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}

              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Your Email'
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-gray-500'
                }`}
              />
              {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}

              <input
                type='text'
                name='subject'
                value={formData.subject}
                onChange={handleInputChange}
                placeholder='Subject'
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-gray-500'
                }`}
              />
              {errors.subject && <p className='text-red-500 text-sm'>{errors.subject}</p>}

              <textarea
                name='message'
                value={formData.message}
                onChange={handleInputChange}
                placeholder='Message...'
                rows='6'
                className={`w-full px-4 py-3 border rounded-lg resize-none ${
                  errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-gray-500'
                }`}
              />
              {errors.message && <p className='text-red-500 text-sm'>{errors.message}</p>}

              <button
                type='submit'
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-8 py-3 bg-gray-800 text-white text-sm font-medium rounded-lg ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Display some products from MongoDB */}
        <div className='md:w-2/5'>
          <h2 className='text-xl font-semibold text-gray-800 mb-6'>Featured Products</h2>
          {loading ? (
            <p className='text-gray-500'>Loading products...</p>
          ) : products.length > 0 ? (
            <div className='space-y-4'>
              {products.slice(0, 3).map((product) => (
                <div
                  key={product._id}
                  className='border border-gray-200 p-4 rounded-lg flex items-center gap-4 hover:bg-gray-50 transition'
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-16 h-16 object-cover rounded'
                  />
                  <div>
                    <p className='font-medium text-gray-800'>{product.name}</p>
                    <p className='text-gray-600 text-sm'>R{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500'>No products available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Contact
