
type InputProps = {
    Label? : string
    className? : string
    type ?: string

}
function InputFields({Label , className , type} : InputProps) {
  return <div>
  <label htmlFor = {Label}>{Label}</label>
  <input
    name={Label}
    type={type}
    className={`w-full bg-[#141414] border  border-[#2b2b2b] rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none mt-1 ${className}`}
    placeholder={Label}
  />
</div>
}

export default InputFields