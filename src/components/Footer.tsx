import { Facebook, Instagram } from 'lucide-react'

const Footer = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/aleksandr.korchevoj',
      icon: Facebook,
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/aleksandr.korchevoj/',
      icon: Instagram,
      color: 'text-pink-600 hover:text-pink-700'
    }
  ]

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Корчевий Олександр</h3>
            <p className="text-gray-300 text-sm">
              Дякуємо за вашу підтримку та допомогу
            </p>
          </div>
          
          <div className="flex space-x-6">
            {socialLinks.map((social) => {
              const IconComponent = social.icon
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} transition-colors duration-200`}
                  title={social.name}
                >
                  <IconComponent className="w-8 h-8" />
                </a>
              )
            })}
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Корчевий Олександр. Всі права захищені.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Розроблено з любов'ю та підтримкою для допомоги тим, хто потребує
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer