export default function MyButton ({children, onClick}) {
    return (
        <button 
        className="
            text-black 
            rounded-xl 
            px-4 
            py-2 
            mx-3
            cursor-pointer 
            bg-emerald-500 
            hover:bg-white
            transition-all
            duration-500"
        onClick={onClick}>
            {children}
        </button>
    )
}