import UnauthorizedException from "./UnauthorizedException.jsx";
import ConflictException from "./ConflictException.jsx";
import ForbiddenException from "./ForbiddenException.jsx";
import NotFoundException from "./NotFoundException.jsx";
import StorageExceedException from "./StorageExceedException.jsx";


export const throwSpecifyException = (error) => {

    switch (error.status) {
        case 401:
            throw new UnauthorizedException(error.detail);
        case 409:
            throw new ConflictException(error.detail);
        case 403:
            throw new ForbiddenException(error.detail);

        case 404:
            throw new NotFoundException(error.detail);

        case 413:
            throw new StorageExceedException(error.detail);
        default:
            throw new Error('Unknown error');
    }

}