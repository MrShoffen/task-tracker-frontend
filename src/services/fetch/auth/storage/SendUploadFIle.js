import axios from "axios";
import {API_UPLOAD_FILES} from "../../../../UrlConstants.jsx";
import StorageExceedException from "../../../../exception/StorageExceedException.jsx";
import bytes from "bytes";


export async function sendUpload(files, updateDownloadTask, updateTask, uploadTask, currPath) {

    const formData = new FormData();
    files.forEach(({file, path}) => {
        formData.append("object", file, path);
    })
    formData.append("path", currPath);




    try {
        const response = await axios.post(API_UPLOAD_FILES, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
                updateTask(uploadTask, "progress", "Загружаем... " + bytes( progressEvent.rate) + "/c");
                if (progressEvent.progress === 1) {
                    updateTask(uploadTask, "progress", "Сохраняем в хранилище...")
                }

                updateDownloadTask(uploadTask, progressEvent.progress * 100);
            },
        });

        let resp = response.data[0];

        if (resp.status !== 201) {
            updateTask(uploadTask, "error", resp.detail);

        } else {
            updateTask(uploadTask, "completed", "Загружено");
        }
    } catch (error) {
        if( error.response && error.response.data.status === 413){
            throw new StorageExceedException(error.response.data.detail);
        }
        updateTask(uploadTask, "error", "Ошибка при загрузке. Попробуйте позже");
    }


}
