type signupProps ={
  className ?: string
}
function Signup({className}:signupProps) {
  return (
    <div className={`bg-[#141414] text-[#98989A] px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border border-[#262626] hover:text-white transition ${className}`}>
      Sign Up
    </div>
  );
}

export default Signup;
