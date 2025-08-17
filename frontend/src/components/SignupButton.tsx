import { useNavigate } from "react-router-dom";

type signupProps ={
  className ?: string
  navigateTo ?: string
}
function SignupButton({className , navigateTo }:signupProps) {
  const navigate = useNavigate()
  return (
    <div className={`bg-[#141414] text-[#98989A] px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border border-[#262626] hover:text-white transition ${className}`}
    onClick={() => {
      navigate(`${navigateTo}`)
    }}
    >
      Sign Up
    </div>
  );
}

export default SignupButton;
