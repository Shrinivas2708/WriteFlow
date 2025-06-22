import { FaStar, FaRegStar } from "react-icons/fa";

function StarRating({ rating }: { rating: number }) {
  const totalStars = 5;

  return (
    <div className="flex text-yellow-400 text-xl absolute top-[-20px] left-1/2 p-2 bg-[#141414] border border-[#262626] gap-1 transform -translate-x-1/2 rounded-3xl">
      {Array.from({ length: totalStars }, (_, i) =>
        i < rating ? <FaStar key={i} /> : <FaRegStar key={i} className="text-[#797979]" />
      )}
    </div>
  );
}



export default StarRating