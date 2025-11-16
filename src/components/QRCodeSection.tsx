import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const QRCodeSection = () => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const paymentMethods = [
    {
      name: 'BTC',
      address: '137mt7vbXyr5UX6YXZxK1UcUSX3nSXiCzx',
      qrCode: '/QR/btc-qr.svg',
      color: 'bg-orange-500',
      network: 'Bitcoin'
    },
    {
      name: 'ETH',
      address: '0x1fc01452587d39b1a1d0d77083ef6b7af4c692b7',
      qrCode: '/QR/eth-qr.svg',
      color: 'bg-purple-500',
      network: 'BNB Smart Chain (BEP20)'
    },
    {
      name: 'USDT',
      address: 'TNZu6XpK7gzqGxDS7JMPUTmNZYgqwpU8Bu',
      qrCode: '/QR/usdt-qr.svg',
      color: 'bg-green-600',
      network: 'Tron (TRC20)'
    },
    {
      name: 'MonoBank',
      address: 'https://send.monobank.ua/jar/3snHpRyG1Y',
      qrCode: '/QR/monobank-qr.svg',
      color: 'bg-indigo-500',
      isLink: true,
      goal: 'Ціль: 1 300 000 ₴'
    }
  ]

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(text)
      setTimeout(() => setCopiedAddress(null), 3000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {paymentMethods.map((method) => (
            <div key={method.name} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200 border border-gray-200">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{method.name}</h3>
                {method.network && (
                  <p className="text-sm text-gray-500 mb-4">Сеть — {method.network}</p>
                )}
                {method.goal && (
                  <p className="text-sm text-gray-500 mb-4">{method.goal}</p>
                )}
                <div className="w-40 h-40 mx-auto rounded-lg border-2 border-gray-200 flex items-center justify-center mb-4 cursor-pointer hover:opacity-80 transition-opacity bg-white p-2"
                     onClick={() => copyToClipboard(method.address)}>
                  <img 
                    src={method.qrCode} 
                    alt={`${method.name} QR Code`}
                    className="w-36 h-36 object-contain"
                  />
                </div>
              </div>
              
              <div className="relative">
                <div 
                  className="bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors group"
                  onClick={() => copyToClipboard(method.address)}
                >
                  <p className="text-sm text-gray-600 break-all font-mono">
                    {method.address}
                  </p>
                  <div className="absolute top-2 right-2">
                    {copiedAddress === method.address ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </div>
                </div>
                
                {method.isLink && (
                  <a 
                    href={method.address}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-500 hover:text-blue-600 text-sm underline"
                  >
                    Відкрити посилання
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {copiedAddress && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            Текст скопійовано!
          </div>
        )}
      </div>
    </section>
  )
}

export default QRCodeSection