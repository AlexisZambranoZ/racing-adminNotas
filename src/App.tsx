
import './App.css'
import Footer from './assets/components/Footer'
import Formulario from './assets/components/Formulario'
import Header from './assets/components/Header'
import { productos } from './assets/data/db'


function App() {
  console.log(productos)
  return (


    <>
      <div className="flex flex-col">
        <Header />

        <main
          
          className="w-full flex-1 py-10 px-4 bg-white"
        >
          <Formulario/>
        </main>

        <Footer />
      </div>

    </>
  )
}

export default App
