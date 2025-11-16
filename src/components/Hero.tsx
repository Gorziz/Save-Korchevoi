import { useState, useEffect } from 'react'

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Placeholder images - these should be replaced with actual images in the hero-image folder
  const heroImages = [
    'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Ukrainian%20family%20support%20fundraising%20banner%20with%20warm%20colors&image_size=landscape_16_9',
    'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Medical%20treatment%20support%20banner%20with%20hopeful%20atmosphere&image_size=landscape_16_9',
    'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Community%20helping%20hands%20banner%20with%20Ukrainian%20colors&image_size=landscape_16_9'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <section className="relative h-screen max-h-[600px] overflow-hidden">
      <div className="relative w-full h-full">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Hero banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            ДРУЗІ ПРОШУ ДОПОМОГИ
          </h1>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero