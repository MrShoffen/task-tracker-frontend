import {useState} from "react";

export function MenuIcon({color = 'currentColor', size = 16}) {
    const [hovered, setHovered] = useState(false);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={hovered ? "rgb(0,137,246)" : color}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none"
            type="ui">
            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
        </svg>
    );
}