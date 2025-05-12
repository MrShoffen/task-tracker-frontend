import {API_DOWNLOAD_FILES} from "../../../../UrlConstants.jsx";
import {extractSimpleName} from "../../../util/Utils.js";
import {sendGetObjectStats} from "./SendGetObjectStats.js";


export const sendDownloadFile = async (downloadTask, updateTask, updateDownloadTask, size, updateDownloadSpeed) => {
    const filePath = downloadTask.operation.source;

    const params = new URLSearchParams({path: filePath});

    const fetchUrl = `${API_DOWNLOAD_FILES}?${params.toString()}`;

    if(size === 0){
        let stats = await sendGetObjectStats(filePath);
        size = stats.size;
    }

    const response = await fetch(fetchUrl, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        updateTask(downloadTask, "error", "Ошибка при скачивании. Попробуйте еще раз")
        return;
    }


    const updateSpeed = (speed) => {
        updateDownloadSpeed(downloadTask, speed);
    };

    let loadedSize = 0;
    const reader = response.body.getReader();
    const chunks = [];

    const contentName = filePath.endsWith("/")
        ? extractSimpleName(filePath).replace("/", ".zip")
        : extractSimpleName(filePath);

    let lastLoadedSize = 0;
    let count = 0;
    // Запускаем интервал обновления скорости (раз в секунду)
    const speedInterval = setInterval(() => {
        const speed = (loadedSize - lastLoadedSize); // Скорость в КБ/с
        lastLoadedSize = loadedSize;

        updateSpeed(speed); // Обновляем скорость загрузки
    }, 1000);


    while (true) {
        count++;
        const {done, value} = await reader.read();
        if (done) break;

        chunks.push(value);
        loadedSize += value.length;

        if (count === 100) {
            count = 0;
            const progress = (loadedSize / size) * 100;
            updateDownloadTask(downloadTask, progress);
        }
    }
    clearInterval(speedInterval);

    const blob = new Blob(chunks);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', contentName);
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
};