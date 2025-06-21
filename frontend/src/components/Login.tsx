type loginProps ={
  className ?: string
}
function Login({ className } : loginProps) {
  return ( 
    <div className={`bg-[#FFD11A] text-black px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-yellow-400 transition ${className}`}>
      Log In
    </div>
  );
}

export default Login;
