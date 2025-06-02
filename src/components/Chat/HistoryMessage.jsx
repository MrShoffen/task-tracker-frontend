import {Box, Card, useTheme} from "@mui/material";
import Typography from "@mui/material/Typography";
import {formatDate} from "../../services/util/Utils.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {UserInfo} from "../Users/UserInfo.jsx";
import {UncheckedIcon} from "../../assets/icons/UncheckedIcon.jsx";
import {CheckedIcon} from "../../assets/icons/CheckedIcon.jsx";
import * as React from "react";
import {TaskCover} from "../Task/TaskCover.jsx";
import {Sticker} from "../Sticker/Sticker.jsx";


export function HistoryMessage({history}) {

    const {loadUser, loadDeskName} = useTaskOperations();
    const theme = useTheme();
    const userInfo = loadUser(history.author);


    if (history.type === 'TASK_UPDATED' && (history.additionalInfo?.orderIndex !== undefined || history.additionalInfo?.color !== undefined) || history.type === 'STICKER_DELETED') {
        return null;
    }

    return (
        <Card
            elevation={0}
            sx={{
                width: '380px',
                minHeight: '60px',
                position: 'relative',
                display: 'flex',
                borderRadius: 2,
                backgroundColor: history.type,
                mb: '20px',
                mt: '20px',
                flexDirection: 'column',
                ml: '35px',
                pb: '10px',
            }}
        >
            <Box sx={{display: 'flex', justifyContent: 'center', m: '10px'}}>
                <Typography fontSize='0.72rem' fontWeight={500} color='text.disabled'>
                    {formatDate(history.timestamp)}
                </Typography>
            </Box>

            <Box sx={{ml: '10px', mr: '10px', mt: '0px'}}>
                <Typography component='span' fontSize='0.8rem' color='message_history'>
                    {'Пользователь '}
                    <Typography component='span' fontWeight='600' fontSize='0.8rem' color='message_history'
                                sx={{
                                    border: '1px solid',
                                    p: '2px',
                                    borderColor: 'action.selected',
                                    borderRadius: '5px',
                                }}
                    >
                        <UserInfo label={"Автор"} user={userInfo} sx={{
                            ml: 1,
                            fontSize: '0.7rem',
                            mt: '10px',
                            bottom: 0,
                            display: 'inline',
                            cursor: 'pointer',
                        }}/> {userInfo.email}
                    </Typography>

                    {
                        history.type === 'TASK_CREATED' &&
                        <Typography component='span' fontSize='0.8rem' color='message_history'
                        > {' создал задачу '}
                            <Typography component='span' fontWeight='600' fontSize='0.8rem' color='message_history'
                            > {history.additionalInfo.taskName}
                                <Typography component='span'fontSize='0.8rem' color='message_history'>{' на доске '}
                                    <Typography component='span' fontWeight='600' fontSize='0.8rem' color='message_history'>
                                        {loadDeskName(history.additionalInfo.deskId).name}
                                    </Typography>
                                </Typography>
                            </Typography>
                        </Typography>
                    }

                    {
                        history.type === 'TASK_UPDATED' && history.additionalInfo?.name &&
                        <Typography component='span' fontSize='0.8rem' color='message_history'
                        > {' изменил имя задачи на '}
                            <Typography component='span' fontWeight='600' fontSize='0.8rem' color='message_history'
                            > {history.additionalInfo.name}
                            </Typography>
                        </Typography>
                    }

                    {
                        history.type === 'TASK_UPDATED' && history.additionalInfo?.completed !== undefined &&
                        <Typography component='span' fontSize='0.8rem' color='message_history'
                        > {' пометил задачу как '}
                            <Typography component='span' fontWeight='600' fontSize='0.8rem' color='message_history'
                            > {history.additionalInfo.completed ? 'выполненную' : 'не выполненную'}

                                <Box component='span'
                                     sx={{
                                         ml: '5px',
                                         mt: '5px',
                                     }}>
                                    {!history.additionalInfo?.completed
                                        ? <UncheckedIcon color={theme.palette.taskName} size={"16px"}/>
                                        : <CheckedIcon size={"17px"}/>
                                    }
                                </Box>
                            </Typography>
                        </Typography>
                    }


                    {
                        history.type === 'TASK_UPDATED' && history.additionalInfo?.deskId !== undefined &&
                        <Typography component='span' fontSize='0.8rem' color='message_history'
                        > {' переместил задачу на доску '}
                            <Typography component='span' fontWeight='600' fontSize='0.8rem' color='message_history'
                            > {loadDeskName(history.additionalInfo.deskId).name}
                            </Typography>
                        </Typography>
                    }

                    {
                        history.type === 'TASK_UPDATED' && history.additionalInfo?.coverUrl !== undefined && history.additionalInfo.coverUrl !== '' &&
                        <Typography component='span' fontSize='0.8rem' color='message_history'
                        > {' загрузил обложку'}
                            <TaskCover coverUrl={history.additionalInfo.coverUrl}/>
                        </Typography>
                    }

                    {
                        history.type === 'TASK_UPDATED' && history.additionalInfo?.coverUrl !== undefined && history.additionalInfo.coverUrl === '' &&
                        <Typography component='span' fontSize='0.8rem' color='message_history'
                        > {' удалил обложку'}
                        </Typography>
                    }

                    {
                        history.type === 'STICKER_CREATED' &&
                        <Typography component='span' fontSize='0.8rem' color='message_history'
                        > {' добавил стикер '}
                            <Sticker maxW={'100px'} sticker={history.additionalInfo.sticker} editable={false}/>
                        </Typography>
                    }


                    {/*{*/}
                    {/*    history.type === 'TASK_UPDATED' && history.additionalInfo?.coverUrl !== undefined && history.additionalInfo.coverUrl === '' &&*/}
                    {/*    <Typography component='span' fontSize='0.8rem' color='message_history'*/}
                    {/*    > {' удалил обложку'}*/}
                    {/*    </Typography>*/}
                    {/*}*/}

                </Typography>
            </Box>
        </Card>
    )
}