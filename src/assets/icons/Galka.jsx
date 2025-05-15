export function Galka({color = 'currentColor'}) {


    return (
        <svg
            width="9"
            height="7"
            viewBox="0 0 9 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
             className="text-primary text-invert absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-[.5px]">
            <path d="M1 3L3.5 5.5L7.5 1" stroke={color} stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round"></path>
        </svg>
    );
}