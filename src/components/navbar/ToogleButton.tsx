import { motion } from "framer-motion";

const ToggleButton = ({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

  return (
    <div className="button-div">
      <button onClick={() => {setOpen((prev) => !prev)}} >
        <svg width="20" height="20" viewBox="0 -5 23 23" className="svg">
          <motion.path
            strokeWidth="3"
            stroke="black"
            strokeLinecap="round"
            variants={{           
              closed: { d: "M 2 2.5 L 20 2.5" },
              open: { d: "M 3 16.5 L 17 2.5" },
            }}
          />
          <motion.path
            strokeWidth="3"
            stroke="black"
            strokeLinecap="round"
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
          />
          <motion.path
            strokeWidth="3"
            stroke="black"
            strokeLinecap="round"
            variants={{
              closed: { d: "M 2 16.346 L 20 16.346" },
              open: { d: "M 3 2.5 L 17 16.346" },
            }}          
          />
        </svg>
      </button>
    </div>
  );
};

export default ToggleButton;
