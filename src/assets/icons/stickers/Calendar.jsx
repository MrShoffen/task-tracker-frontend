export function Calendar({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Calendar Event">
                <path id="Vector"
                      d="M10.6667 2V4.66667M5.33335 2V4.66667M2.66669 7.33333H13.3334M4.00002 3.33333H12C12.7364 3.33333 13.3334 3.93029 13.3334 4.66667V12.6667C13.3334 13.403 12.7364 14 12 14H4.00002C3.26364 14 2.66669 13.403 2.66669 12.6667V4.66667C2.66669 3.93029 3.26364 3.33333 4.00002 3.33333ZM5.33335 10H6.66669V11.3333H5.33335V10Z"
                      stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
}