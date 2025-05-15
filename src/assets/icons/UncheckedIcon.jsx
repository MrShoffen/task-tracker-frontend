export function UncheckedIcon({color = 'currentColor', size = 16}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                stroke={color}
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5.67 8 1.55 1.56 3.11-3.12M15.35 8A7.35 7.35 0 1 1 .65 8a7.35 7.35 0 0 1 14.7 0Z"
            />
        </svg>
    );
}