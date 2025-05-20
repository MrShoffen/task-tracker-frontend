export function NewDeskIcon({color = 'currentColor', hovered, size = 16}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             width="16"
             height="16"
             viewBox="0 0 24 24"
             fill="none"
             stroke={hovered ? "rgb(0,137,246)" : color}
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             className="w-16 h-16 flex-none" type="ui">
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M9 12l6 0"></path>
            <path d="M12 9l0 6"></path>
        </svg>
    );
}