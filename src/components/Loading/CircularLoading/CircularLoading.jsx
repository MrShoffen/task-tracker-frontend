import './Circular.css'
import {useEffect, useState} from "react";


export const CircularLoading = ({loading}) => {

    const [state, setState] = useState("hide-my");

    useEffect(() => {

        setState(loading ? "progress-my" : "ready-my");
    }, [loading])


    useEffect(() => {
        if (state === "ready-my") {
            setTimeout(() => {
                setState("hide-my");
            }, 3000)
        }
    }, [state])


    return (
        <svg className={state} id="check" version="1.1" xmlns="http://www.w3.org/2000/svg"
             xmlnsXlink="http://www.w3.org/1999/xlink"
             viewBox="0 0 500 500" xmlSpace="preserve">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{"stopColor": "#2f6ce4"}}/>
                    <stop offset="100%" style={{"stopColor": "#1887cf"}}/>
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{"stopColor": "#25872d"}}/>
                    <stop offset="100%" style={{"stopColor": "#65ae71"}}/>
                </linearGradient>
            </defs>
            <circle id="circle" cx="50" cy="50" r="46" stroke="url(#grad1)" fill="transparent"/>
            <polyline id="tick" points="25,55 45,70 75,33" stroke="url(#grad1)" fill="transparent"/>
        </svg>
    )
}