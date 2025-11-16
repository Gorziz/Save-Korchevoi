import { useState } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const donationServices = [
    {
      name: 'PayPal',
      url: 'https://paypal.me/aleksandrkorchevoj',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Paysend',
      url: 'https://paysend.com',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'BTC',
      url: '#btc',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      name: 'ETH',
      url: '#eth',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'USDT',
      url: '#usdt',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Visa/MasterCard',
      url: 'https://send.monobank.ua/jar/3snHpRyG1Y',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      name: 'Монобанк',
      url: 'https://send.monobank.ua/jar/3snHpRyG1Y',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ]

  const handleDonationClick = (service: typeof donationServices[0]) => {
    if (service.url.startsWith('#')) {
      document.querySelector(service.url)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.open(service.url, '_blank')
    }
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-800">
            Корчевий Олександр
          </div>
          
          <div className="hidden md:flex flex-wrap gap-2">
            {donationServices.map((service) => (
              <button
                key={service.name}
                onClick={() => handleDonationClick(service)}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${service.color}`}
              >
                {service.name}
              </button>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col gap-2">
              {donationServices.map((service) => (
                <button
                  key={service.name}
                  onClick={() => {
                    handleDonationClick(service)
                    setIsMenuOpen(false)
                  }}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${service.color}`}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header