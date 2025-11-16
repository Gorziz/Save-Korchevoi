import Header from './components/Header'
import Hero from './components/Hero'
import MonobankJar from './components/MonobankJar'
import QRCodeSectionNew from './components/QRCodeSectionNew'
import InfoBlock from './components/InfoBlock'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <div className="container mx-auto px-4">
        <MonobankJar />
      </div>
      <QRCodeSectionNew />
      <InfoBlock />
      <ContactForm />
      <Footer />
    </div>
  )
}

export default App