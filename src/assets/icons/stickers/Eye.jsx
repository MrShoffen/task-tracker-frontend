export function Eye({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.00001 12.6667C10.6667 12.6667 12.8887 11.1113 14.6667 8.00001C12.8887 4.88868 10.6667 3.33334 8.00001 3.33334C5.33334 3.33334 3.11134 4.88868 1.33334 8.00001C3.11134 11.1113 5.33334 12.6667 8.00001 12.6667Z"
                stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            <path
                d="M8.00003 9.33336C8.73641 9.33336 9.33336 8.73641 9.33336 8.00003C9.33336 7.26365 8.73641 6.6667 8.00003 6.6667C7.26365 6.6667 6.6667 7.26365 6.6667 8.00003C6.6667 8.73641 7.26365 9.33336 8.00003 9.33336Z"
                stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
    );
}