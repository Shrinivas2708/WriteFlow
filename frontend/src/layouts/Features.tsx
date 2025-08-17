
import Feature1 from "../assets/feature-1.svg"
import Feature2 from "../assets/feature-2.svg"
const feature_card = [
    {
        icon:Feature1,
        heading:"Future Technology Blog",
        subheading:"Stay informed with our blog section dedicated to future technology.",
        data:[
            {
                title:"Quantity",
                desc:"Over 1,000 articles on emerging tech trends and breakthroughs."
            },
            {
                title:"Variety",
                desc:"Articles cover fields like AI, robotics, biotechnology, and more."
            },
            {
                title:"Frequency",
                desc:"Fresh content added daily to keep you up to date."
            },
            {
                title:"Authoritative",
                desc:"Written by our team of tech experts and industry professionals."
            }
        ]
    },
    {
        icon:Feature2,
        heading:"Research Insights Blogs",
        subheading:"Dive deep into future technology concepts with our research section.",
        data:[
            {
                title:"Depth",
                desc:"500+ research articles for in-depth understanding."
            },
            {
                title:"Graphics",
                desc:"Visual aids and infographics to enhance comprehension."
            },
            {
                title:"Trends",
                desc:"Explore emerging trends in future technology research."
            },
            {
                title:"Contributors",
                desc:"Contributions from tech researchers and academics."
            }
        ]
    }
]
function Features() {
  return (
    <div className="w-full ">
      <div className="lg:p-16 p-10 bg-[#1A1A1A] border-b border-[#262626] flex flex-col gap-5">
        <p className=" bg-[#333333]  w-fit lg:py-2 lg:px-2 px-1 py-1 lg:text-base text-sm rounded-sm">
          Unlock the Power of
        </p>
        <p className="lg:text-4xl text-3xl">FutureTech Features</p>
      </div>
      <div className=" ">
        {
            feature_card.map((val,i)=>{
                return <div key={i} className="  grid lg:grid-cols-3  border-[#262626] border-b">
                    <div className=" border-[#262626] lg:border-r border-b lg:col-span-1 lg:pt-20 p-14 ">
                        <img src={val.icon} alt="" />
                        <p className="text-2xl pt-6 font-medium">{val.heading}</p>
                        <p className="text-sm pt-3 text-[#98989A]">{val.subheading}</p>
                    </div>
                    <div className=" lg:p-20 p-10 lg:col-span-2 grid sm:grid-cols-2 gap-2">
                        {
                            val.data.map((val,i)=>{
                                return <div key={i} className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5 ">
                                    <p className="text-lg font-medium">{val.title}</p>
                                    <p className="text-[#98989A] mt-2">{val.desc}</p>
                                </div>
                            })
                        }
                    </div>
                </div>
            })
        }
      </div>
    </div>
  );
}

export default Features;
