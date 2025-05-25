export function Layer({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Stack">
                <path id="Vector"
                      d="M2.66669 7.99999L8.00002 10.6667L13.3334 7.99999M2.66669 10.6667L8.00002 13.3333L13.3334 10.6667M8.00002 2.66666L2.66669 5.33332L8.00002 7.99999L13.3334 5.33332L8.00002 2.66666Z"
                      stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
}