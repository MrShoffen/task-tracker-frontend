import {Box, Card, IconButton} from "@mui/material";
import Typography from "@mui/material/Typography";
import {formatDate} from "../../services/util/Utils.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {UserInfo} from "../Users/UserInfo.jsx";
import {useAuthContext} from "../../context/Auth/AuthContext.jsx";
import {DeleteTask} from "../../assets/icons/DeleteTask.jsx";
import {sendDeleteComment} from "../../services/fetch/tasks/comments/SendDeleteCommen.js";
import {HistoryMessage} from "./HistoryMessage.jsx";

export function ChatMessage({message, task}) {
    const {loadUser, userHasPermission} = useTaskOperations();
    const {auth} = useAuthContext();

    const userInfo = loadUser(message.userId);
    const isCurrentUser = auth.user.email === userInfo?.email;

    async function handleCommDel() {
        try {
            await sendDeleteComment(message);
        } catch (error) {
            console.log(error.message);
        }
    }

    if (message.isHistory) {
        return (<HistoryMessage history={message}/>)
    } else {
        return (
            <Box display={"flex"} flexDirection={"row"}>
                {!isCurrentUser &&
                    <UserInfo label={"Автор комментария"} user={userInfo} sx={{
                        height: '30px',
                        width: '30px',
                        mt: '19px',
                        ml: '15px',
                        // mb: 0,
                        cursor: 'pointer',
                    }}/>
                }
                <Card
                    elevation={0}
                    sx={{
                        width: '340px',
                        boxShadow: 2,
                        minHeight: '60px',
                        position: 'relative',
                        display: 'flex',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'action.selected',
                        backgroundColor: isCurrentUser ? 'messageBg' : 'background.default',
                        m: '10px',
                        flexDirection: 'column',
                        ml: isCurrentUser ? '90px' : '0px',
                        pb: '5px',
                    }}
                >

                    <Box sx={{ml: '10px', mr: '10px', mt: 1, display: 'flex', flexDirection: 'row'}}>

                        <Typography
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '290px',
                            }}
                            fontSize='0.8rem' fontWeight='500' color='message'>
                            {
                                (userInfo?.firstName && userInfo?.lastName) ?
                                    (userInfo?.firstName + ' ' + userInfo?.lastName) :
                                    userInfo?.email
                            }
                        </Typography>
                    </Box>


                    <Box sx={{ml: '10px', mr: '10px', mt: '0px'}}>
                        <Typography fontSize='0.8rem' color='message'>
                            {message.message}
                        </Typography>
                    </Box>

                    <Box sx={{ml: '10px', display: 'flex', justifyContent: 'flex-end', mr: '10px', mt: '10px'}}>
                        <Typography fontSize='0.72rem' color='text.disabled'>
                            {formatDate(message.createdAt)}
                        </Typography>
                    </Box>

                    {userHasPermission("DELETE_COMMENTS") &&
                        <IconButton
                            onClick={handleCommDel}
                            sx={{position: 'absolute', right: 1}}
                        >
                            <DeleteTask color={'rgba(209,34,34,0.75)'}/>
                        </IconButton>
                    }
                </Card>
            </Box>
        )
    }
}