import { Heart, MessageCircle, Share2 } from "lucide-react";
import { PopularBlogs } from "../data";
// import ViewBlog from "./ViewBlog";

function Popular() {
  return (
    <div className="w-full border-b border-[#262626]">
      <div className="lg:p-16 p-10 bg-[#1A1A1A] border-b border-[#262626] flex flex-col gap-5">
        <p className=" bg-[#333333]  w-fit lg:py-2 lg:px-2 px-1 py-1 lg:text-base text-sm rounded-sm">
          A Knowledge Treasure Trove
        </p>
        <p className="lg:text-4xl text-3xl">
          Explore FutureTech's In-Depth Blog Posts
        </p>
      </div>
      <div className="lg:px-12 ">
        {PopularBlogs.map((val, i) => {
          return (
            <div key={i} className=" grid lg:grid-cols-3">
              <div className="col-span-1 flex justify-between flex-col  border-[#262626] lg:border-b   px-2 pt-1 ">
                <div className=" p-2  flex  gap-3   h-full pt-5 lg:py-10">
                  <div className="w-14 h-14 rounded-full   ">
                    <img src={val.Avatar} alt="" className="rounded-full" />
                  </div>
                  <div className=" flex flex-col p-2 ">
                    <p className="text-base">{val.Name}</p>
                    <p className="text-[#98989A] text-sm ">{val.Work}</p>
                  </div>
                </div>
              </div>
              <div className="col-span-2  border-[#262626] border-b py-2 lg:py-5 ">
                <div key={i} className=" lg:p-6 p-5 ">
                  {val.BlogData.map((val, i) => {
                    return (
                      <div key={i} className="flex flex-col gap-4 ">
                        <p className="text-[#98989A] font-semibold">
                          {val.date}
                        </p>
                        <p className="text-xl">{val.Title}</p>
                        <p className="text-[#98989A] text-sm">{val.desc}</p>
                        <div className="flex text-xs gap-2">
                          <div className="bg-[#1A1A1A] border-[#262626] border p-2 rounded-3xl text-[#98989A] flex items-center gap-2 cursor-pointer">
                            <Heart size={15} />
                            {val.likes}
                          </div>
                          <div className="bg-[#1A1A1A] border-[#262626] border p-2 rounded-3xl text-[#98989A] flex items-center gap-2 cursor-pointer">
                            <MessageCircle size={15} />
                            {val.cmnt}
                          </div>
                          <div className="bg-[#1A1A1A] border-[#262626] border p-2 rounded-3xl text-[#98989A] flex items-center gap-2 cursor-pointer">
                            <Share2 size={15} />
                            {val.share}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Popular;
