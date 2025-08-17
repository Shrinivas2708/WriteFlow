import { useNavigate } from "react-router-dom";

type loginProps ={
  className ?: string
  navigateTo ?: string
  label ?: string
}
function LoginButton({ className , navigateTo ,  label } : loginProps) {
  const navigate = useNavigate()
  return ( 
    <div className={`bg-[#FFD11A] text-black px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-yellow-400 transition ${className} text-center`} onClick={() => {
      navigate(`${navigateTo}`)
    }}>
      {label || "Log In"}
    </div>
  );
}

export default LoginButton;
