import {Stack, styled} from "@mui/material";

export const BackgroundWrapper = styled(Stack)(({theme}) => ({
    // position: 'relative',
    // minHeight: '100%',
    // width: '100%',
    // overflow: 'hidden',

    '&::before': {
        content: '""',
        position: 'fixed',
        zIndex: 0,
        bottom: 0,
        left: 0,

        width: '100%',
        height: '100%',
        backgroundImage: theme.palette.mode === 'dark'
            ? ' linear-gradient(90deg, #06212D, #22202D)'
            : ' linear-gradient(70deg, #B9DEED, #EFEFEF);',
        // backgroundRepeat: '',
        // backgroundAttachment: 'scroll',

        // backgroundImage: `url('https://i.ibb.co/M5DtFwM8/i.webp)`, // Путь к изображению
        backgroundSize: 'cover', // или 'contain' в зависимости от потребностей
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed', // Фиксированный фон при скролле
        // filter: theme.palette.mode === 'dark' ? 'brightness(0.7)' : 'none'
    },

    '& > *': {
        position: 'relative',
        zIndex: 1
    }
}));