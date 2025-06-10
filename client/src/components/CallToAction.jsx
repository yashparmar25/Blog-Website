import React from 'react'

const CallToAction = () => {
  return (
    <div className="flex flex-row border w-[50rem] mx-auto gap-16 h-[20rem] border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className='flex-1 justify-center flex flex-col'>
            <h2 className='text-2xl'>
                Want to learn more about JavaScript?
            </h2>

            <p className='text-blue-500 mt-[1rem] ml-[1.2rem] '>
                Checkout our JavaScript Projects
            </p>

            <button className='w-[15rem] py-5  mt-[1rem] ml-[3.5rem] font-bold bg-red-600 text-white text-lg  rounded-tl-3xl rounded-br-3xl rounded-bl-none shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
                <a href="https://www.100jsprojects.com" target='blank' rel='noopener norefferer'>Javascript Projects</a></button>
        </div>
      <div className="p-7 flex-1">
        <img src ='../images/js.png' alt="" className='h-[15rem] w-[25rem]'/>
      </div>
    </div>
  )
}

export default CallToAction
