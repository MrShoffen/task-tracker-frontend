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
        backgroundAttachment: 'scroll',
    },

    '& > *': {
        position: 'relative',
        zIndex: 1
    }
}));