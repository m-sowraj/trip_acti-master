import React, { useState } from 'react';

const ProgressBar = ({ currentStep }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-6 text-white">Registration Form</h2>
      <div className='w-full mt-2 text-white flex items-center text-sm relative'>
            {/* Progree Line */}
            <div className='w-[66%] m-auto h-1 bg-gray-300 absolute left-[15%]'></div>
            <div className='w-[66%] h-1 bg-orange-500 absolute left-[15%]' style={{width: `${(currentStep - 1) * 33.33}%`}}></div>

            <div className='min-w-[33%] z-50 flex items-center justify-center'>
                <div
                className={`w-4 h-4 rounded-full ${
                    currentStep === 1 ? 'bg-orange-500' : currentStep > 1 ? 'bg-orange-500' : 'bg-gray-300'
                }`}
                ></div>
            </div>
            <div className='min-w-[33%] z-50 flex items-center justify-center' >
                <div
                className={`w-4 h-4 rounded-full ${
                    currentStep === 2 ? 'bg-orange-500' : currentStep > 2 ? 'bg-orange-500' : 'bg-gray-300'
                }`}
                ></div>
            </div>
            <div className='min-w-[33%] z-50 flex items-center justify-center'>
                <div
                className={`w-4 h-4 rounded-full ${
                    currentStep === 3 ? 'bg-orange-500' : currentStep > 3 ? 'bg-orange-500' : 'bg-gray-300'
                }`}
                ></div>
            </div>
      </div>
      <div className='w-full my-2 text-white flex items-start justify-between text-sm'>
        <div className='w-[33%] text-center '>Personal Information</div>
        <div className='w-[33%] text-center '>Upload Restaurant Images & Timings</div>
        <div className='w-[33%] text-center '>Create password</div>
      </div>
    </div>
  );
};

export default ProgressBar;