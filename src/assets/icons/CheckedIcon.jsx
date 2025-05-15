export function CheckedIcon({color = 'currentColor', size = 16}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             width={size}
             height={size}
             fill="none"
             className="flex-none block">
            <path fill="#80C856" fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z" clipRule="evenodd"></path>
            <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3"
                  d="m5.67 8 1.55 1.56 3.11-3.12"></path>
        </svg>
    );
}