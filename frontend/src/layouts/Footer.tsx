import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

function Footer() {
  return (
    <div className='w-full  bg-[#141414] grid lg:grid-cols-3 lg:grid-rows-1 grid-cols-2 grid-rows-2 gap-5 p-5 border-t border-[#262626] '>
      <div className='text-[#666666]  text-xl font-semibold text-center md:text-center lg:text-start '>
        WriteFlow
      </div>

   
      <div className='flex gap-3 justify-center items-center order text-[#666666]'>
        <FaInstagram size={20} className=' cursor-pointer hover:text-white' onClick={()=>{
          window.open("https://www.instagram.com/itzzz_shriii/")
        }}/>
        <FaLinkedin size={20} className=' cursor-pointer hover:text-white' onClick={()=>{
          window.open("https://www.linkedin.com/in/shrinivas-sherikar-a77980231/")
        }}/>
        <FaGithub size={20} className=' cursor-pointer hover:text-white' onClick={()=>{
          window.open("https://github.com/Shrinivas2708")
        }}/>
        <FaTwitter size={20} className=' cursor-pointer hover:text-white' onClick={()=>{
          window.open("https://x.com/ItzzzShri")
        }}/>
      </div>

      <p className='text-[#666666] text-sm text-center md:text-center lg:text-end col-span-2 lg:col-span-1 '>
        © 2024 FutureTech. All rights reserved.
      </p>
 
      
    </div>
  )
}

export default Footer
