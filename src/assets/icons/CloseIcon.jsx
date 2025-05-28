export function CloseIcon({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
             className="flex-none">
            <path d="M13.3337 8H6.66699" stroke={color} stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round"></path>
            <path d="M13.3337 8L10.667 10.6667" stroke={color} stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round"></path>
            <path d="M13.3337 8.00016L10.667 5.3335" stroke={color} stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round"></path>
            <path d="M2.66699 2.6665V13.3332" stroke={color} stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round"></path>
        </svg>
    );
}