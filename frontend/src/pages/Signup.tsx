import { useNavigate } from "react-router-dom";
import loginIcon from "../assets/Auth.png?url";
import BackBtn from "../components/BackBtn";
import InputFields from "../components/InputFields";
import LoginButton from "../components/LoginButton";
function Signup() {
  const navigate = useNavigate()
  return <div className=" h-screen sm:p-16 flex justify-center items-center">
      
  <div className=" p-5 bg-[#FFD119] h-[500px] w-[400px] md:flex justify-center items-center rounded-l-xl border border-[#262626] hidden ">
    <img src={loginIcon} alt=""  />
  </div>
  <div className=" sm:p-10 px-2 bg-[#191919] h-[500px] flex flex-col justify-center border border-[#262626] lg:rounded-r-xl lg:rounded-none rounded-xl">

     <BackBtn navigateTo="/" />
    
    <div className=" text-4xl font-semibold  text-center p-1 ">
      Sign Up
    </div>
    <div className=" p-5  flex gap-3 flex-col">
      <InputFields Label="Name" type="text"/>
      <InputFields Label="Email" type="email" />
      <InputFields Label="Password" type="password"/>
    </div>
   
    <div className=" flex justify-center 1 flex-col items-center gap-5">
        <LoginButton className=" text-center w-[150px] mt-2 " navigateTo="/" label="Sign Up" />
        <p className="text-[#7E7E81] text-sm">Already have an account?
        <span className="ml-1 hover:text-white cursor-pointer" onClick={()=>{
          navigate("/login")
        }}>Log In</span>
        </p>
        
    </div>
  </div>
</div>
}

export default Signup