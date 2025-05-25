export function Flash({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Bolt">
                <path id="Vector" d="M8.66671 6.66667V2L3.33337 9.33333H7.33337V14L12.6667 6.66667H8.66671Z"
                      stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
}