import { AiOutlineInfoCircle } from 'react-icons/ai';

const InfoField = (props:any) => {

  const handleHover = () => {
    props.setIsHovering(true)
  }

  const handleNoHover = () => {
    props.setIsHovering(false)
  }

  return (
    <>
    <span onMouseOver={handleHover} onMouseOut={handleNoHover} className="pl-1 cursor-pointer group relative font-normal">
      {props.isHovering &&
        <div className={`z-10 info-box ${props.xDirection}-0 ${props.yDirection}-0 w-72 p-4`}>
        <span>
          {props.infoText}
        </span>
      </div>
      }
      <AiOutlineInfoCircle />
    </span>
    </>
  )
}

export default InfoField