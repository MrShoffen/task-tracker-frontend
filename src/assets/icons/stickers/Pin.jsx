export function Pin({color = 'currentColor', size = 16}) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Pin">
                <path id="Vector"
                      d="M10.129 2.3871L7.03226 5.48387L3.93548 6.64516L2.77419 7.80645L8.19355 13.2258L9.35484 12.0645L10.5161 8.96774L13.6129 5.87097M5.48387 10.5161L2 14M9.74194 2L14 6.25806"
                      stroke={color} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
    );
}