// import React from 'react'
import CardIcon1 from "../../assets/CardIcon1.svg"
import CardIcon2 from "../../assets/CardIcon2.svg"
import CardIcon3 from "../../assets/CardIcon3.svg"
import arrow from "../../assets/arrow.svg"
const CardsData = [
    {
        icon:CardIcon1,
        h1:"Smart Visuals for Every Blog",
        h2:"create  images for your blogs using AI.",
        desc:"10,000+ images generated monthly"
    },{
        icon:CardIcon3,
        h1:"Beautiful Insights",
        h2:"Every blog gets insights",
        desc:"100% accurate and correct insights"
    },
    {
        icon:CardIcon2,
        h1:"Global Readership",
        h2:"Worldwide Impact",
        desc:"2 million monthly readers"
    }
    
]
function HeroCards() {
  return (
    <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   '>
        {
            CardsData.map((val,i)=>{
                return <div
                key={i}
                className=' p-10 flex justify-between border-[#262626] md:even:border-r  md:even:border-l border-b'>
                    <div >
                    <img src={val.icon} alt="" className='' />
                    <p className='pt-6'>{val.h1}</p>
                    <p className='text-[#7E7E81] pt-3'>{val.h2}</p>
                    <p className='text-[#98989A] pt-5'>{val.desc}</p>
                    </div>
                    <div className=' flex   '>
                        <div className='w-16 h-16 flex justify-center items-center rounded-full bg-[#FFD11A]'>
                            <img src={arrow} alt="" />
                        </div>
                    </div>
                </div>
            })
        }
    </div>
  )
}

export default HeroCards