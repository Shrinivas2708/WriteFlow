import { useNavigate } from "react-router-dom";
import loginIcon from "../assets/Auth.png?url";
import BackBtn from "../components/BackBtn";
import InputFields from "../components/InputFields";
import LoginButton from "../components/LoginButton";
function Login() {
  const navigate = useNavigate()
  return (
    
    <div className=" h-screen sm:p-16 flex justify-center items-center">
      
      <div className=" p-5 bg-[#FFD119] h-[500px] w-[400px] md:flex justify-center items-center rounded-l-xl border border-[#262626] hidden ">
        <img src={loginIcon} alt=""  />
      </div>
      <div className=" sm:p-10 px-2 bg-[#191919] h-[500px] flex flex-col justify-center border border-[#262626] lg:rounded-r-xl lg:rounded-none rounded-xl">
   
         <BackBtn navigateTo="/" />
        
        <div className=" text-4xl font-semibold  text-center p-5 ">
          Log In
        </div>
        <div className=" p-5  flex gap-3 flex-col">
          <InputFields Label="Email" type="email"/>
          <InputFields Label="Password" type="password"/>
        </div>
        <div className=" flex px-5 gap-2   items-center">
            <input type="checkbox" name="remember" id="remember" className="accent-yellow-500 w-4 h-4 cursor-pointer" />
            <label htmlFor="remember" className="text-[#7E7E81] text-sm">Remember Me</label>
        </div>
        <div className=" flex justify-center  py-3 flex-col items-center gap-5">
            <LoginButton className=" text-center w-[150px] mt-2 " navigateTo="/" />
            <p className="text-[#7E7E81] text-sm">Don't have an account? 
            <span className="ml-1 hover:text-white cursor-pointer" onClick={()=>{
              navigate("/signup")
            }}>Sign up</span>
            </p>
            
        </div>
      </div>
    </div>
  );
}

export default Login;
