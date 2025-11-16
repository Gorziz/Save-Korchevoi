import { useState, useMemo, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'

interface QRCodeImageProps {
  title: string
  network?: string
  address: string
  imageBase: string
  altText: string
  goal?: string
  warning?: string
  isMonobank?: boolean
  onCopy: (address: string) => void
  isCopied: boolean
}

const QRCodeImage: React.FC<QRCodeImageProps> = ({
  title,
  network,
  address,
  imageBase,
  altText,
  goal,
  warning,
  isMonobank = false,
  onCopy,
  isCopied
}) => {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  const candidates = useMemo(() => [
    `/QR/${imageBase}.png`,
    `/QR/${imageBase.toUpperCase()}.png`,
    `/QR/${cap(imageBase)}.png`,
    `/QR/${imageBase}.jpg`,
    `/QR/${imageBase.toUpperCase()}.jpg`,
    `/QR/${cap(imageBase)}.jpg`,
    `/QR/${imageBase}.svg`,
    `/QR/${imageBase.toUpperCase()}.svg`,
    `/QR/${cap(imageBase)}.svg`,
  ], [imageBase])
  const [candidateIndex, setCandidateIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState(candidates[0])
  useEffect(() => {
    setCandidateIndex(0)
    setImageSrc(candidates[0])
  }, [candidates])
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      onCopy(text)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatAddress = (addr: string) => {
    if (addr.length > 40) {
      const mid = Math.ceil(addr.length / 2)
      return [addr.slice(0, mid), addr.slice(mid)]
    }
    return [addr]
  }

  const addressLines = formatAddress(address)

  return (
    <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200 border border-gray-200 max-w-sm mx-auto">
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{title}</h3>
      
      {/* Subtitle/Network */}
      {network && (
        <div className="flex justify-between items-center mb-4 text-sm px-2">
          <span className="text-gray-500 font-medium">Сеть</span>
          <span className="text-gray-900 font-medium">{network}</span>
        </div>
      )}
      
      {goal && (
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 font-medium">{goal}</p>
        </div>
      )}

      {/* QR Code Image */}
      <div className="w-full max-w-[16rem] aspect-square mx-auto rounded-lg border-2 border-gray-200 flex items-center justify-center mb-6 cursor-pointer hover:opacity-90 transition-opacity bg-white p-3 shadow-sm"
           onClick={() => copyToClipboard(address)}>
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-full object-contain rounded-lg"
          loading="lazy"
          decoding="async"
          onError={() => {
            if (candidateIndex < candidates.length - 1) {
              const next = candidateIndex + 1
              setCandidateIndex(next)
              setImageSrc(candidates[next])
            }
          }}
        />
      </div>

      {/* Address */}
      <div className="relative mb-4">
        <div className="text-left">
          <span className="text-sm text-gray-500 mb-2 block font-medium">Адрес кошелька</span>
          <div 
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors group relative"
            onClick={() => copyToClipboard(address)}
          >
            <div className="text-sm text-gray-900 font-mono break-all leading-relaxed pr-8">
              {addressLines.map((line, index) => (
                <div key={index} className={index > 0 ? 'mt-1' : ''}>{line}</div>
              ))}
            </div>
            <div className="absolute top-3 right-3">
              {isCopied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Warning text */}
      {warning && (
        <div className="text-xs text-gray-500 text-left mb-4 space-y-1">
          {warning.split('\n').map((line, index) => (
            <p key={index} className="leading-relaxed">{line}</p>
          ))}
        </div>
      )}

      {/* Link for Monobank */}
      {isMonobank && (
        <div className="text-center bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700 mb-3 font-medium">На лікування (рак шкіри) Корчевой Олександр</p>
          <a 
            href={address}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm"
          >
            Відкрити посилання
          </a>
        </div>
      )}
    </div>
  )
}

const QRCodeSection = () => {
  const [globalCopiedAddress, setGlobalCopiedAddress] = useState<string | null>(null)

  const handleCopy = (address: string) => {
    setGlobalCopiedAddress(address)
    setTimeout(() => setGlobalCopiedAddress(null), 3000)
  }

  const qrCodes = [
    {
      title: 'Внести BTC на аккаунт Binance',
      network: 'Bitcoin',
      address: '137mt7vbXyr5UX6YXZxK1UcUSX3nSXiCzx',
      imageBase: 'btc',
      altText: 'QR-код для внесення BTC на акаунт Binance, мережа Bitcoin, адреса 137mt7vbXyr5UX6YXZxK1UcUSX3nSXiCzx',
      warning: 'Не надсилайте NFT на цю адресу.\nВвід за допомогою смарт-контрактів не підтримується, окрім внесення ETH через мережу ERC20, BNB через мережі BEP20, Arbitrum та Optimism.'
    },
    {
      title: 'Внести ETH на аккаунт Binance',
      network: 'BNB Smart Chain (BEP20)',
      address: '0x1fc01452587d39b1a1d0d77083ef6b7af4c692b7',
      imageBase: 'eth',
      altText: 'QR-код для внесення ETH на акаунт Binance, мережа BNB Smart Chain (BEP20), адреса 0x1fc01452587d39b1a1d0d77083ef6b7af4c692b7',
      warning: 'Не надсилайте NFT на цю адресу.'
    },
    {
      title: 'QR-код для поповнення банки',
      goal: 'Ліки Життя • Ціль: 1 300 000 ₴',
      address: 'https://send.monobank.ua/jar/3snHpRyG1Y',
      imageBase: 'monobank',
      altText: 'QR-код для поповнення благодійної банки «Ліки Життя», ціль 1 300 000 ₴, на лікування (рак шкіри) Корчевой Олександр',
      isMonobank: true
    },
    {
      title: 'Внести USDT на аккаунт Binance',
      network: 'Tron (TRC20)',
      address: 'TNZu6XpK7gzqGxDS7JMPUTmNZYgqwpU8Bu',
      imageBase: 'usdt',
      altText: 'QR-код для внесення USDT на акаунт Binance, мережа Tron (TRC20), адреса TNZu6XpK7gzqGxDS7JMPUTmNZYgqwpU8Bu',
      warning: 'Не надсилайте NFT на цю адресу.\nВвід за допомогою смарт-контрактів не підтримується, окрім внесення ETH через мережу ERC20, BNB через мережі BEP20, Arbitrum та Optimism.'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {qrCodes.map((qr, index) => (
            <QRCodeImage 
              key={index} 
              {...qr} 
              onCopy={handleCopy}
              isCopied={globalCopiedAddress === qr.address}
            />
          ))}
        </div>
        
        {globalCopiedAddress && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            Текст скопійовано!
          </div>
        )}
      </div>
    </section>
  )
}

export default QRCodeSection