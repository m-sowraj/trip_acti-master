import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import PartnerRegistration from './components/Registeration'

function SignUp() {
  return (
    <div className="min-h-screen max-h-screen overflow-scroll flex flex-col bg-gradient-to-br from-teal-400 via-blue-400 to-blue-500">
      <Header />

      <div className="flex-1 flex items-center justify-center p-4 gap-10 h-full w-[80%] max-lg:w-[100%] m-auto">
        <div className='w-[35%] flex flex-col gap-4'>
            <div className="text-start mb-8 pl-10 w-full">
                <h1 className="text-4xl font-bold text-teal-600 mb-2">trrip</h1>
                <h2 className="text-2xl text-black font-semibold">
                    Connecting You to<br />More Customers
                </h2>
            </div>

            {/* Icons */}
            <div className="flex flex-1 gap-4 w-full justify-evenly">
                <div className="text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2">
                    <img src="/assets/img1.svg" alt="We bring tourists to you" className="w-6 h-6" />
                    </div>
                    <p className="text-white text-xs w-24">We bring tourists to you</p>
                </div>
                <div className="text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2">
                    <img src="/assets/img2.svg" alt="Your authentic food reaches" className="w-6 h-6" />
                    </div>
                    <p className="text-white text-xs w-24">Your authentic food reaches</p>
                </div>
                <div className="text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2">
                    <img src="/assets/img3.svg" alt="Increase your potential customer" className="w-6 h-6" />
                    </div>
                    <p className="text-white text-xs w-24">Increase your potential customer base by 3x</p>
                </div>
            </div>
        </div>

        <div className='w-[50%] p-4'>
            <PartnerRegistration/>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SignUp
