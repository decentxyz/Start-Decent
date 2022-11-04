import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Spinner = ({ height, width, color }:any) => {
  return (
    <span className={`loading flex items-center ${color}`}>
      <AiOutlineLoading3Quarters style={{ height, width }} />
    </span>
  );
};

export default Spinner;