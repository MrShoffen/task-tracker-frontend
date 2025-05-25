export function Star({color = 'currentColor'}) {
    return (
        <svg width="16"
             height="16"
             viewBox="0 0 16 16"
             fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8 11.8333L3.88533 13.9967L4.67133 9.41466L1.338 6.16999L5.938 5.50332L7.99533 1.33466L10.0527 5.50332L14.6527 6.16999L11.3193 9.41466L12.1053 13.9967L8 11.8333Z"
                stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" stroke={color}></path>
        </svg>
    );
}