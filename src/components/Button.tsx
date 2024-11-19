import Link from "next/link";

const Button = ({name}: {name: string}) => {
    return (
      
            <button className="px-4 py-2 rounded-lg relative bg-first hover:bg-second text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600">
                <div className="absolute inset-x-0 h-[2px] w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
                <span className="relative z-20">{name}</span>
            </button>
    
    );
}

export default Button