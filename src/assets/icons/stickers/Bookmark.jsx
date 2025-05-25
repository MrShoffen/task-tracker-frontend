export function Bookmark({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Bookmark">
                <path id="Vector"
                      d="M5.99999 2.66666H9.99999C10.3536 2.66666 10.6927 2.80713 10.9428 3.05718C11.1928 3.30723 11.3333 3.64637 11.3333 3.99999V13.3333L7.99999 11.3333L4.66666 13.3333V3.99999C4.66666 3.64637 4.80713 3.30723 5.05718 3.05718C5.30723 2.80713 5.64637 2.66666 5.99999 2.66666Z"
                      stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
}