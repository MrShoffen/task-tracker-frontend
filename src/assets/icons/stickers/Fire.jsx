export function Fire({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Flame">
                <path id="Vector"
                      d="M7.33333 2.66666C8 3.33332 9.33333 6.02666 8 7.99999C8.806 8.66666 9.476 8.66666 10.6667 6.66666C11.296 7.37332 12 8.97866 12 9.99999C12 11.0609 11.5786 12.0783 10.8284 12.8284C10.0783 13.5786 9.06087 14 8 14C6.93913 14 5.92172 13.5786 5.17157 12.8284C4.42143 12.0783 4 11.0609 4 9.99999C4 8.82666 4.516 7.50666 5.33333 6.66666C6.15133 5.82732 7.33333 4.69199 7.33333 2.66666Z"
                      stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
}