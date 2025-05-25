export function Music({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Music">
                <path id="Vector"
                      d="M6 11.3333C6 12.4379 5.10457 13.3333 4 13.3333C2.89543 13.3333 2 12.4379 2 11.3333C2 10.2288 2.89543 9.33332 4 9.33332C5.10457 9.33332 6 10.2288 6 11.3333ZM6 11.3333V2.66666H12.6667L12.6667 11.3333M12.6667 11.3333C12.6667 12.4379 11.7712 13.3333 10.6667 13.3333C9.5621 13.3333 8.66667 12.4379 8.66667 11.3333C8.66667 10.2288 9.5621 9.33332 10.6667 9.33332C11.7712 9.33332 12.6667 10.2288 12.6667 11.3333ZM6 5.33332H12.6667"
                      stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
}