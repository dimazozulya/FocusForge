export default function MyButtonWhite ({children, onClick}) {
    return (
        <button 
        className="
            text-black 
            rounded-xl 
            border-2
            px-4 
            py-2 
            cursor-pointer 
            bg-white
            hover:bg-emerald-500 
            transition-all
            duration-500
           "
            
        onClick={onClick}
        >
            {children}
        </button>
    )
}