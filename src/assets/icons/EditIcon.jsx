import {Box} from "@mui/material";
import {useState} from "react";

export function EditIcon({color = 'currentColor', size = 16}) {
    const [hovered, setHovered] = useState(false);

    return (
             <svg xmlns="http://www.w3.org/2000/svg"
                 width={size}
                 onMouseEnter={() => setHovered(true)}
                 onMouseLeave={() => setHovered(false)}
                 height={size}
                 viewBox="0 0 24 24" fill="none"
                 stroke={hovered ? "rgb(0,137,246)" : color}
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="" type="ui">
                <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                <path d="M13.5 6.5l4 4"></path>
            </svg>
    );
}