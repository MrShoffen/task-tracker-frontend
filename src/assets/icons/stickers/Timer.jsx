export function Timer({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Alarm">
                <path id="Vector"
                      d="M7.99998 6.66666V8.66666H9.33331M4.66665 2.66666L2.83331 3.99999M11.3333 2.66666L13.1666 3.99999M12.6666 8.66666C12.6666 11.244 10.5773 13.3333 7.99998 13.3333C5.42265 13.3333 3.33331 11.244 3.33331 8.66666C3.33331 6.08933 5.42265 3.99999 7.99998 3.99999C10.5773 3.99999 12.6666 6.08933 12.6666 8.66666Z"
                      stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
}