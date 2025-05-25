export function Edit({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Pencil">
                <path id="Vector"
                      d="M8.99999 4.33333L11.6667 7M2.66666 13.3333H5.33332L12.3333 6.33333C12.6869 5.97971 12.8856 5.50009 12.8856 5C12.8856 4.4999 12.6869 4.02029 12.3333 3.66666C11.9797 3.31304 11.5001 3.11438 11 3.11438C10.4999 3.11438 10.0203 3.31304 9.66666 3.66666L2.66666 10.6667V13.3333Z"
                      stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
}