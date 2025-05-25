export function Video({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Movie">
                <path id="Vector"
                      d="M5.33335 2.66666V13.3333M10.6667 2.66666V13.3333M2.66669 5.33332H5.33335M2.66669 10.6667H5.33335M2.66669 7.99999H13.3334M10.6667 5.33332H13.3334M10.6667 10.6667H13.3334M4.00002 2.66666H12C12.7364 2.66666 13.3334 3.26361 13.3334 3.99999V12C13.3334 12.7364 12.7364 13.3333 12 13.3333H4.00002C3.26364 13.3333 2.66669 12.7364 2.66669 12V3.99999C2.66669 3.26361 3.26364 2.66666 4.00002 2.66666Z"
                      stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
}