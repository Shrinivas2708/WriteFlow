import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

function Footer() {
  return (
    <div className='w-full p-5 bg-[#141414] grid lg:grid-cols-3  grid-cols-2 grid-rows-2 gap-5'>
      
 
      <div className='text-[#666666] text-xl font-semibold text-center md:text-center lg:text-start '>
        WriteFlow
      </div>

   
      <div className='flex gap-3 justify-center items-center order'>
        <FaInstagram size={20} className=' cursor-pointer' />
        <FaLinkedin size={20} className=' cursor-pointer' />
        <FaGithub size={20} className=' cursor-pointer' />
        <FaTwitter size={20} className=' cursor-pointer' />
      </div>

      <p className='text-[#666666] text-sm text-center md:text-center lg:text-end col-span-2 lg:col-span-1 '>
        © 2024 FutureTech. All rights reserved.
      </p>
    </div>
  )
}

export default Footer
