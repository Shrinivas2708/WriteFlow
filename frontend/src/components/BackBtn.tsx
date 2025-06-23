
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
type BackBtnProps = {
  navigateTo ?: string
}
function BackBtn({navigateTo} : BackBtnProps) {
  const navigate = useNavigate()
  return (
    <div>
      <FaArrowLeftLong  size={20} className='cursor-pointer  ml-5 md:ml-0' onClick={()=>{
        navigate(`${navigateTo}`)
      }}/>
    </div>
  )
}

export default BackBtn