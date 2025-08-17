import { MoveUpRight, Plus } from "lucide-react";
import image from "../assets/image.svg?url";

const data = [
  {
    nums: 300,
    words: "Blogs Written",
  },
  {
    nums: "12K",
    words: "Total Shares",
  },
  {
    nums: "10K",
    words: "Active Users",
  },
];
const avatarr = [
 {
  AvatarURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
 } ,
 {
  AvatarURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Df"
 } ,
 {
  AvatarURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
 } ,
 {
  AvatarURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
 } 
]
const z = 10
function Hero() {
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-3">
      <section className=" md:col-span-2    sm:pt-20 pt-10 text-white flex flex-col gap-6 lg:border-r border-[#262626] ">
        <h1 className="text-lg md:text-2xl text-[#666666]">
          Your Journey to Tomorrow Begins Here
        </h1>
        <div className=" text-4xl md:text-5xl font-semibold flex flex-col gap-2">
          <p>Your AI-Powered Gateway </p>
          <p>to Smarter Blogging</p>
        </div>
        <p className="text-[#7E7E81] md:pb-14 text-sm md:text-base">
          WriteFlow helps you create, explore, and share blogs effortlessly.
          Generate AI-powered images and summaries, organize your content with
          tags, and discover what's trending—all in one place.
        </p>
        <div className="  grid grid-cols-3   text-white ">
          {data.map((val, i) => (
            <div
              key={i}
              className=" flex flex-col justify-center px-6  md:px-10 gap-1 py-8 md:py-10 border-t md:border-r border-b border-[#262626] border-r "
            >
              <p className="text-xl md:text-4xl font-bold flex   items-center ">
                {val.nums}
                <Plus color="#FFD11A" size={30} />
              </p>
              <p className="text-xs sm:text-sm md:text-base text-[#98989A]  ">
                {val.words}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="  border-b border-[#262626]  relative    ">
        <div className=" opacity-60">
          <img src={image} alt="sdas" />
        </div>
        <div
          className="absolute    text-white text-2xl top-1/2 left-[50%] md:left-[60%] transform -translate-x-1/2
         w-[350px] "
        >
          <div className="flex items-center space-x-[-12px] sm:space-x-[-16px]">

  {
    
    avatarr.map((val,i)=>{
      return <div key={i} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#262626] ${z+5}`}>
        <img src={val.AvatarURL} alt="sda" className=" rounded-full" />
      </div>
    })
  }
  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#262626] bg-[#2a2a2a] text-white text-xs flex items-center justify-center z-50">
  +3
</div>

</div>


          <p className="text-lg p-2">Explore 1000+ resources</p>
          <p className="text-sm pl-2 pb-2 text-[#98989A]">
            Over 1,000 articles on emerging tech trends and breakthroughs.
          </p>
          <div className="h-[45px] border w-[170px] rounded-lg border-[#262626] cursor-pointer flex items-center justify-center gap-2">
            <p className="text-sm text-[#98989A]   ">Explore Resources</p>
            <div className="pt-1 ">
              <MoveUpRight size={18} color="#FFD11A" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
