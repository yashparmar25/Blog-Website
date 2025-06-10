import React from 'react'
import PostCard from '../components/PostCard'
import CallToAction from '../components/CallToAction'

const About = () => {
  return (
    <div className='h-screen'>
      <div className="">
        <h1 className='text-3xl font font-semibold text-center my-7'>About Blogify</h1>
        <div className="text-md text-gray-500 flex flex-col gap-6">
          <p className='mx-auto'>
            This Blog is created to share the thoughts and ideas with the world.
            <br />
            This provides the user interaction between the millions of of people
          </p>
        </div>
        <br />
        <br />
       <CallToAction></CallToAction>
      </div>
       
    </div>
  )
}

export default About
