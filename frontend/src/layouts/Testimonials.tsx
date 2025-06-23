
import { TestimonialsData } from "../data";

import StarRating from "../components/Stars";

function Testimonials() {
  return (
    <div className="w-full ">
      <div className="lg:p-16 p-10 bg-[#1A1A1A] border-b border-[#262626] flex flex-col gap-5">
        <p className=" bg-[#333333]  w-fit lg:py-2 lg:px-2 px-1 py-1 lg:text-base text-sm rounded-sm">
        What Our Readers Say
        </p>
        <p className="lg:text-4xl text-3xl">
        Real Words from Real Readers
        </p>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-rows-2  ">
        {
            TestimonialsData.map((val,i)=>{
                    return <div key={i} className="lg:p-12 p-10 flex flex-col gap-5 border  border-[#262626] ">
                    <div className="flex  justify-center py-3 gap-3 ">
                        <div className="w-12 h-12 ">
                            <img src={val.Avatar} alt="" className="rounded-full" />
                        </div>
                        <div className="">
                            <p className="text-base">{val.Name}</p>
                            <p className="text-[#666666] text-sm">{val.Location}</p>
                        </div>
                    </div>
                    <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5 text-center relative ">
                        <StarRating rating={val.Star} />
                        <p className="text-sm">{val.Review}</p>
                    </div>
                </div>
            })
        }
      </div>
    </div>
  );
}

export default Testimonials;
