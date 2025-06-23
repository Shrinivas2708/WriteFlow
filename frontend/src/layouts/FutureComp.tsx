import futureIcon from "../assets/futureicon.svg";
import { FutureData } from "../data";
import arrow from "../assets/arrow.svg";
function FutureComp() {
  return (
    <div className="lg:p-14 p-5 w-full border-b border-t border-[#262626] bg-[#1A1A1A] flex flex-col lg:gap-16  gap-10">
      <div className=" flex gap-5 lg:p-10 p-2 flex-col lg:flex-row">
        <img src={futureIcon} alt="" className="w-20 h-20 md:w-30 md:h-30" />
        <div className="flex flex-col gap-3">
          <p className=" bg-[#333333]  w-fit lg:py-2 lg:px-2 px-1 py-1 lg:text-base text-sm rounded-sm">
            Learn, Connect, and Innovate
          </p>
          <p className="lg:text-4xl  text-2xl font-semibold">
            Be Part of the Future Tech Revolution
          </p>
          <p className="text-[#7E7E81] text-sm">
            Immerse yourself in the world of future technology. Explore our
            comprehensive resources, connect with fellow tech enthusiasts, and
            drive innovation in the industry. Join a dynamic community of
            forward-thinkers.
          </p>
        </div>
      </div>
      <div className="border bg-[#141414] border-[#262626] p-3 flex gap-3 flex-col  lg:flex-row">
        {FutureData.map((val, i) => {
          return (
            <div
              key={i}
              className="bg-[#1A1A1A] border-[#262626] border p-3 rounded-md "
            >
              <div className=" flex justify-between items-center  p-2">
                <p className="text-lg font-semibold">{val.Heading}</p>
                <div className="w-10 h-10 bg-[#FFD11A] rounded-full flex items-center justify-center">
                  <img src={arrow} alt="" />
                </div>
              </div>
              <div className=" p-3">
                <p className="text-[#98989A] text-sm">{val.Subheading}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FutureComp;
