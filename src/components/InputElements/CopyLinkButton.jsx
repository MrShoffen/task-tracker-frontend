import React, {useState} from 'react';
import {Button} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const CopyLinkButton = ({linkToCopy = window.location.href}) => {
    const [text, setText] = useState("Ссылка на публичный проект");

    const handleCopy = () => {
        navigator.clipboard.writeText(linkToCopy)
            .then(() => setText("Скопировано!"))
            .catch(err => {
                console.error('Не удалось скопировать: ', err);
            });
    };

    return (
        <Button
            startIcon={<ContentCopyIcon/>}
            onClick={handleCopy}
            sx={{
                minWidth: 'fit-content',
                fontSize: '0.7rem',
                height: '30px',
                ml: 4
            }}
        >
            {text}
        </Button>
    );
};

export default CopyLinkButton;