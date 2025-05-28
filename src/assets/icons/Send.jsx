export function SendIcon({color = 'currentColor', hovered, size = 16}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="flex-none"
             type="ui">
            <path d="M10 14l11 -11"></path>
            <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
        </svg>
    );
}