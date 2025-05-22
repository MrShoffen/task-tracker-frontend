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

export const lightTaskColor = {
    null: 'white',
    'RED': '#FFB0B0',
    'PINK': '#FFD1D6',
    'YELLOW': '#FFF7AD',
    'GREEN': '#DFFABC',
    'CYAN': '#C8F7E6',
    'BLUE': '#BEE1FB',
    'PURPLE': '#F9C9F7',
};

export const darkTaskColor = {
    // null: '#333c49',
    null: '#333c49',
    'RED': '#703535',
    'PINK': '#713C4F',
    'YELLOW': '#706335',
    'GREEN': '#34572E',
    'CYAN': '#2A5D54',
    'BLUE': '#304D6F',
    'PURPLE': '#673A76',
};

const lightDeskColor = {
    null: 'rgb(123, 134, 158)',
    // 'null': 'rgb(123, 134, 158)',
    'RED': 'rgb(235, 55, 55)',
    'ORANGE': 'rgb(242, 115, 43)',
    'YELLOW': 'rgb(245, 204, 0)',
    'GREEN': 'rgb(92, 220, 17)',
    'CYAN': 'rgb(8, 167, 169)',
    'BLUE': 'rgb(80, 137, 242)',
    'PURPLE': 'rgb(226, 94, 242)',
};

const darkDeskColor = {
    null: 'rgb(102, 112, 133)',
    'RED': 'rgb(219, 60, 60)',
    'ORANGE': 'rgb(216, 103, 39)',
    'YELLOW': 'rgb(212, 177, 2)',
    'GREEN': 'rgb(88, 181, 34)',
    'CYAN': 'rgb(8, 167, 169)',
    'BLUE': 'rgb(70, 125, 225)',
    'PURPLE': 'rgb(191, 72, 205)',
};

export const deskColor = (deskColor) => {
    const {isDarkMode} = useCustomThemeContext();
    return !isDarkMode ? lightDeskColor[deskColor] : darkDeskColor[deskColor];
}

export const deskColorsPalette = () => {
    const {isDarkMode} = useCustomThemeContext();
    return !isDarkMode ? lightDeskColor : darkDeskColor;
}

export const randomDeskColor = () =>
    Object.keys(lightDeskColor)[Math.floor(Math.random() * Object.keys(lightDeskColor).length)];

export function calculateNewOrderIndex(moving, target, elements) {
    const elementsNumber = elements.length;
    let newOrderIndex = 0;
    if (moving < target) {
        if (target !== elementsNumber - 1) {
            console.log(moving)
            console.log(target)
            console.log(elementsNumber)
            newOrderIndex = (elements[target].orderIndex + elements[target + 1].orderIndex) / 2;
        } else {
            newOrderIndex = elements[target].orderIndex + 2021839;
        }
    }
    if (moving > target) {
        if (target <= 0) {
            newOrderIndex = elements[target].orderIndex - 2051839;
        } else {
            newOrderIndex = (elements[target].orderIndex + elements[target - 1].orderIndex) / 2;
        }
    }
    return {
        ...elements[moving],
        orderIndex: newOrderIndex
    }
}

export function calculateNewOrderIndexReversed(moving, target, elements) {
    console.log(elements);
    const elementsNumber = elements.length;
    let newOrderIndex = 0;
    if (moving < target) {
        if (target !== elementsNumber - 1) {
            console.log(moving)
            console.log(target)
            console.log(elementsNumber)
            newOrderIndex = (elements[target].orderIndex + elements[target + 1].orderIndex) / 2;
        } else {
            newOrderIndex = elements[target].orderIndex - 2051234;
        }
    }
    if (moving > target) {
        if (target <= 0) {
            newOrderIndex = elements[target].orderIndex + 2051234;
        } else {
            newOrderIndex = (elements[target].orderIndex + elements[target - 1].orderIndex) / 2;
        }
    }
    return {
        ...elements[moving],
        orderIndex: newOrderIndex
    }
}

export const workspaceCovers = [
    null,
    "https://i.ibb.co/FLH4hCBW/mounts.jpg",
    "https://i.ibb.co/pBd9K2Rn/pole.jpg",
    "https://i.ibb.co/gZY0mGrc/rauma-river-norway-korabli-lodki-shlyupk-708609.jpg",
    "https://i.ibb.co/B2S6Hkp5/skripka.jpg",
    "https://i.ibb.co/qLSNKSYY/les.webp",
    "https://i.ibb.co/PvW5pRfd/doroga.jpg",
    "https://i.ibb.co/8Dpgm5zM/kanion.jpg",
    "https://i.ibb.co/W4x0m5Np/bambuk.jpg",
    "https://i.ibb.co/jkd9p4nY/gorod.jpg",
    "https://i.ibb.co/M5DtFwM8/i.webp",
    "https://i.ibb.co/tpDjgHLn/pshen.jpg",
    "https://i.ibb.co/Qvk9JwTH/plyazh.jpg",
    "https://i.ibb.co/vxvgG8VV/korgi.jpg",
    "https://i.ibb.co/8DPxNtWs/osen.jpg",
    "https://i.ibb.co/3YzyMwY1/oblaka.jpg",
    "https://i.ibb.co/8D5w1NHq/maki.jpg",
    "https://i.ibb.co/4wQ4c1Lc/afrika.jpg",
    "https://i.ibb.co/wNQDXmXh/pagoda.jpg",
    "https://i.ibb.co/GrdyLbL/mayak.jpg",
    "https://i.ibb.co/HL8StHnr/shari.jpg"
]

