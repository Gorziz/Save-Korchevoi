import { useState } from 'react'
import { Mail, User, MessageSquare } from 'lucide-react'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setIsSubmitting(true)
    try {
      const pub = await fetch('/api/public-key').then(r => r.json())
      const key = await window.crypto.subtle.importKey(
        'jwk',
        pub.key,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt']
      )
      const payload = JSON.stringify({ ...formData, ts: Date.now() })
      const enc = new TextEncoder()
      const cipherBuffer = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, key, enc.encode(payload))
      const bytes = new Uint8Array(cipherBuffer)
      let b64 = ''
      for (let i = 0; i < bytes.length; i++) b64 += String.fromCharCode(bytes[i])
      const ciphertext = btoa(b64)

      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ciphertext })
      })
      const data = await resp.json()
      if (resp.ok && data.ok) {
        setSubmitMessage(data.preview ? `Повідомлення надіслано (перевірка: ${data.preview})` : 'Дякуємо за ваше повідомлення! Ми відповімо вам найближчим часом.')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitMessage(data?.details ? `Не вдалося: ${data.details}` : 'Не вдалося відправити повідомлення. Спробуйте пізніше.')
      }
    } catch (err) {
      setSubmitMessage('Сталася помилка при відправленні. Спробуйте пізніше.')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(''), 5000)
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Маєте питання?
          </h2>
          
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-8 shadow-lg">
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Ваше ім'я
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введіть ваше ім'я"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введіть ваш email"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Повідомлення
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Введіть ваше повідомлення"
                />
              </div>
            </div>

            {submitMessage && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              {isSubmitting ? 'Відправка...' : 'Надіслати повідомлення'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactForm