import React, {useState} from 'react';
import {Button} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const CopyLinkButton = ({linkToCopy = window.location.href}) => {
    const [text, setText] = useState("Ссылка на публичный проект");


    const handleCopy = () => {
        window.open(linkToCopy, '_blank', 'noopener,noreferrer');
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