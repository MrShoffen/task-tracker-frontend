import UnauthorizedException from "./UnauthorizedException.jsx";
import ConflictException from "./ConflictException.jsx";
import ForbiddenException from "./ForbiddenException.jsx";
import NotFoundException from "./NotFoundException.jsx";
import BadRequestException from "./BadRequestException.jsx";


export const throwSpecifyException = (error) => {

    switch (error.status) {
        case 400:
            throw new BadRequestException(error.detail);
        case 401:
            throw new UnauthorizedException(error.detail);
        case 409:
            throw new ConflictException(error.detail);
        case 403:
            throw new ForbiddenException(error.detail);

        case 404:
            throw new NotFoundException(error.detail);

        default:
            throw new Error('Unknown error');
    }

}