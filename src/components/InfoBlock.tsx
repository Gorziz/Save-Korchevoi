const InfoBlock = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Інформація про збір коштів
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-4">
                Шановні друзі та небайдужі люди! Звертаюся до вас з проханням про допомогу. 
                На даний момент я проходжу лікування від раку шкіри, і мені потрібна ваша підтримка.
              </p>
              <p className="mb-4">
                Кошти будуть спрямовані на:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Медичні препарати та лікування</li>
                <li>Діагностичні процедури</li>
                <li>Подальше медичне спостереження</li>
                <li>Транспортні витрати на лікування</li>
              </ul>
              <p className="mb-4">
                Кожен внесок, незалежно від розміру, є важливим і дуже цінним для мене. 
                Дякую всім, хто відгукнувся і допомагає в цей складний час.
              </p>
              <p className="text-sm text-gray-500">
                Контент буде оновлюватися по мірі збору інформації про поточний стан справ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InfoBlock