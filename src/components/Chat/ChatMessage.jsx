import {Box, Card} from "@mui/material";
import Typography from "@mui/material/Typography";

export function ChatMessage({message}) {

    return (
        <Card
            elevation={0}
            sx={{
                width: '340px',
                boxShadow: 2,
                minHeight: '100px',
                display: 'flex',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'action.selected',
                backgroundColor: 'messageBg',
                m: '10px',
                // alignSelf: 'flex-start'
                flexDirection: 'column',
                ml: '90px',
                // ml: '20px',
                pb: '5px',
            }}
        >
            <Box
                sx={{ml: '10px', mr: '10px', mt: 1}}

            >
                <Typography fontSize='0.8rem' fontWeight='500' color='message'>
                    mrshoffen@gmail.com
                </Typography>
            </Box>


            <Box
                sx={{ml: '10px', mr: '10px', mt: '5px'}}
            >
                <Typography fontSize='0.8rem'  color='message'>
               текст асоощващыва
               текст асоощващыва
               текст асоощващыва
               текст асоощващыва
               текст асоощващыва
               текст асоощващыаыа ыфа ыа
                    аы афыв аыфаыфв
                    ы афыв а
                    ыва
               текст асоощващыва
               текст асоощващыва
               текст асоощващыва
               текст асоощващыва
               текст асоощващыва
                </Typography>
            </Box>

            <Box
                sx={{ml: '10px', display: 'flex',  justifyContent: 'flex-end', mr: '10px', mt: '10px'}}
            >
                <Typography fontSize='0.72rem'  color='text.disabled'>
            28.05.25 11:43
                </Typography>
            </Box>

        </Card>
    )
}