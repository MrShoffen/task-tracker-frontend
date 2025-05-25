export function Cube({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Box">
                <path id="Vector"
                      d="M13.3334 5L8.00002 2L2.66669 5M13.3334 5V11L8.00002 14M13.3334 5L8.00002 8M8.00002 14L2.66669 11V5M8.00002 14L8.00002 8M2.66669 5L8.00002 8"
                      stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
}