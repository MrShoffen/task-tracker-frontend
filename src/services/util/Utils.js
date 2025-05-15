import {useCustomThemeContext} from "../../context/GlobalThemeContext/CustomThemeProvider.jsx";

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23", // 24-часовой формат (без AM/PM)
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }).format(date).replace(",", ""); // Удаляем лишнюю запятую
};

export const extractSimpleName = (path) => {
    let sep = path.lastIndexOf("/", path.length - 2);
    return path.substring(sep + 1);

}

export function getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`;
}

export const avatarColor = (email) => {
    const colors = [
        "rgba(6,101,193,0.8)",
        "rgba(202,56,47,0.8)",
        "rgba(55,133,6,0.8)",
        "rgba(193,105,4,0.8)",
        "rgba(152,4,193,0.8)",
        "rgba(6,177,162,0.8)",
        "rgba(146,177,6,0.8)",
    ];


    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Преобразуем в 32-битное целое
    }
    const index = email.charCodeAt(0) % 7;

    const string = colors[index];
    return string;
}

const lightTaskColor = {
    'RED': '#FFB0B0',
    null: 'white',
    'PINK': '#FFD1D6',
    'YELLOW': '#FFF7AD',
    'GREEN': '#DFFABC',
    'CYAN': '#C8F7E6',
    'BLUE': '#BEE1FB',
    'PURPLE': '#F9C9F7',
};

const darkTaskColor = {
    'RED': '#703535',
    null: '#333c49',
    'PINK': '#713C4F',
    'YELLOW': '#706335',
    'GREEN': '#34572E',
    'CYAN': '#2A5D54',
    'BLUE': '#304D6F',
    'PURPLE': '#673A76',
};

export const taskColor = (taskColor) => {
    const {isDarkMode} = useCustomThemeContext();
    return !isDarkMode ? lightTaskColor[taskColor] : darkTaskColor[taskColor];
}