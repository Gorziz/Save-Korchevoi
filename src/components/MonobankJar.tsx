import { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'

const MonobankJar = () => {
  const [jarData, setJarData] = useState<{
    amount: number
    goal: number
    currency: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch Monobank jar data
    const fetchJarData = async () => {
      try {
        // Note: This is a mock implementation. In a real scenario, you would need:
        // 1. CORS proxy or backend endpoint to fetch Monobank API
        // 2. Proper API key and jar ID from Monobank
        // For now, we'll use placeholder data based on the provided information
        
        // Mock data based on the provided information
        const mockData = {
          amount: 111347.29,
          goal: 1280000,
          currency: '₴'
        }
        
        setJarData(mockData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching jar data:', error)
        setLoading(false)
      }
    }

    fetchJarData()
  }, [])

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-blue-700">Завантаження даних...</span>
        </div>
      </div>
    )
  }

  if (!jarData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <p className="text-yellow-700">Не вдалося завантажити дані про збір коштів</p>
      </div>
    )
  }

  const progress = (jarData.amount / jarData.goal) * 100

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <DollarSign className="w-6 h-6 text-green-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Стан збору коштів</h3>
        </div>
        <span className="text-sm text-gray-500">MonoBank Jar</span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Зібрано</span>
          <span>Ціль: {jarData.goal.toLocaleString('uk-UA')}{jarData.currency}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600 mb-1">
          {jarData.amount.toLocaleString('uk-UA')}{jarData.currency}
        </div>
        <div className="text-sm text-gray-500">
          {progress.toFixed(1)}% від цілі
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <a 
          href="https://send.monobank.ua/jar/3snHpRyG1Y"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Підтримати через MonoBank
        </a>
      </div>
    </div>
  )
}

export default MonobankJar