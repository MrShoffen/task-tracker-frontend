import * as React from "react";
import {useState} from "react";
import {useNotification} from "../../context/Notification/NotificationProvider.jsx";
import {
    Box,
    Button,
    Card,
    Divider, FormControlLabel,
    Grid,
    IconButton,
    Modal,
    Paper,
    ToggleButton,
    ToggleButtonGroup, Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import ValidatedProfileField from "../InputElements/TextField/ValidatedProfileField.jsx";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {workspaceCovers} from "../../services/util/Utils.jsx";
import {sendEditWs} from "../../services/fetch/tasks/ws/SendEditWs.js";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CopyLinkButton from "../InputElements/CopyLinkButton.jsx";
import ValidatedEmailTextField from "../InputElements/TextField/ValidatedEmailTextField.jsx";
import {AntSwitch} from "../InputElements/AntSwitch.jsx";
import Switch from "@mui/material/Switch";
import {sendGrantPermission} from "../../services/fetch/perms/SendGrantPermission.js";
import {UserAvatar} from "../Users/UserAvatar.jsx";
import {useAuthContext} from "../../context/Auth/AuthContext.jsx";
import {DeleteTask} from "../../assets/icons/DeleteTask.jsx";
import {sendDeletePerm} from "../../services/fetch/perms/SendDeletePerm.js";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const permissionGroups = {
    "Просмотр": {"Просмотр содержимого проекта (доски, задачи)": "READ_WORKSPACE_CONTENT"},
    "Проект": {"Обновление имени": "UPDATE_WORKSPACE_NAME", "Обновление обложки": "UPDATE_WORKSPACE_COVER"},
    "Доска": {
        "Создание доски": "CREATE_DESK",
        "Обновление имени": "UPDATE_DESK_NAME",
        "Обновление цвета": "UPDATE_DESK_COLOR",
        "Перетаскивание доски в проекте": "UPDATE_DESK_ORDER",
        "Удаление доски": "DELETE_DESK"
    },
    "Задачи": {
        "Создание задачи": "CREATE_TASK", "Обновление имени": "UPDATE_TASK_NAME",
        "Обновление цвета": "UPDATE_TASK_COLOR",
        "Обновление обложки": "UPDATE_TASK_COVER",
        "Отметки о выполнении": "UPDATE_TASK_COMPLETION",
        "Перетаскивание в рамках доски": "UPDATE_TASK_ORDER",
        "Перетаскивание в другую доску": "UPDATE_TASK_DESK",
        "Удаление задачи": "DELETE_TASK"
    },
    "Стикеры": {
        "Создание стикеров": "CREATE_STICKERS",
        "Удаление стикеров": "DELETE_STICKERS"
    },
    "Комментарии": {
        "Создание/просмотр комментариев": "CREATE_READ_COMMENTS",
        "Удаление комментариев": "DELETE_COMMENTS"
    }
};


export default function PermissionsModal({workspace, open, onClose}) {
    const [grantedPermissions, setGrantedPermissions] = useState(["READ_WORKSPACE_CONTENT"])
    const {userHasPermission, addNewPermission, deletePermission} = useTaskOperations();
    const {auth} = useAuthContext();
    const guestPerms = grantedPermissions.includes("READ_WORKSPACE_CONTENT") && grantedPermissions.length === 1;
    const userPerms = grantedPermissions.includes("READ_WORKSPACE_CONTENT")
        && grantedPermissions.includes("CREATE_READ_COMMENTS")
        && grantedPermissions.includes("UPDATE_TASK_COLOR")
        && grantedPermissions.includes("UPDATE_TASK_COVER")
        && grantedPermissions.includes("UPDATE_TASK_COMPLETION")
        && grantedPermissions.includes("UPDATE_TASK_DESK")
        && grantedPermissions.includes("UPDATE_TASK_ORDER")
        && grantedPermissions.includes("CREATE_STICKERS")
        && grantedPermissions.includes("DELETE_STICKERS")
        && grantedPermissions.length === 9;
    const adminPerms = grantedPermissions.includes("READ_WORKSPACE_CONTENT")
        && grantedPermissions.includes("UPDATE_TASK_DESK")
        && grantedPermissions.includes("UPDATE_TASK_ORDER")
        && grantedPermissions.includes("CREATE_READ_COMMENTS")
        && grantedPermissions.includes("UPDATE_TASK_COMPLETION")
        && grantedPermissions.includes("UPDATE_TASK_COLOR")
        && grantedPermissions.includes("UPDATE_TASK_NAME")
        && grantedPermissions.includes("UPDATE_TASK_COVER")
        && grantedPermissions.includes("DELETE_TASK")
        && grantedPermissions.includes("DELETE_DESK")
        && grantedPermissions.includes("DELETE_COMMENTS")
        && grantedPermissions.includes("CREATE_TASK")
        && grantedPermissions.includes("UPDATE_DESK_COLOR")
        && grantedPermissions.includes("CREATE_STICKERS")
        && grantedPermissions.includes("DELETE_STICKERS")
        && grantedPermissions.includes("UPDATE_DESK_ORDER")
        && grantedPermissions.includes("UPDATE_DESK_NAME");

    const handlePermissionChange = (event, perm) => {
        const {checked} = event.target;
        setGrantedPermissions(prev =>
            checked
                ? [...prev, perm]
                : prev.filter(p => p !== perm)
        )
    }

    const users = workspace.usersAndPermissions.map(uap => uap.info.email);

    const handleChange = (event, type) => {
        if (type === 'READ_ONLY') {
            setGrantedPermissions(["READ_WORKSPACE_CONTENT"]);
        }
        if (type === "USER") {
            setGrantedPermissions(["READ_WORKSPACE_CONTENT",
                "UPDATE_TASK_DESK", "UPDATE_TASK_ORDER",
                "UPDATE_TASK_COLOR", "UPDATE_TASK_COVER", "CREATE_STICKERS", "DELETE_STICKERS",
                "CREATE_READ_COMMENTS", "UPDATE_TASK_COMPLETION"]);
        }
        if (type === "ADMIN") {
            setGrantedPermissions(["READ_WORKSPACE_CONTENT",
                "UPDATE_TASK_DESK", "UPDATE_TASK_ORDER",
                "CREATE_READ_COMMENTS", "UPDATE_TASK_COMPLETION", "UPDATE_DESK_ORDER",
                "UPDATE_TASK_COLOR", "UPDATE_TASK_NAME", "UPDATE_TASK_COVER","CREATE_STICKERS", "DELETE_STICKERS",
                "CREATE_TASK", "CREATE_DESK", "UPDATE_DESK_COLOR", "UPDATE_DESK_NAME",
                "DELETE_TASK", "DELETE_DESK", "DELETE_COMMENTS"
            ]);

        }
    };
    const [email, setEmail] = useState('');


    const [usernameError, setUsernameError] = useState('');

    const {showWarn, showSuccess} = useNotification();

    const clearFields = () => {
        setGrantedPermissions(["READ_WORKSPACE_CONTENT"])
    };

    async function handlePermissionsGrant() {
        try {
            const newPerm = await sendGrantPermission(workspace,
                {
                    userEmail: email,
                    permissions: grantedPermissions
                });
            console.log(newPerm);
            addNewPermission(newPerm, email);
            showSuccess("Права выданы")

        } catch (error) {
            showWarn(error.message);
        }
        setEmail('')
    }

    async function revokeGrants(usPerm) {
        try {
            sendDeletePerm(workspace, usPerm);
            deletePermission(usPerm.userId);
        } catch (error) {
            showWarn(error.message);
        }
    }

    return (
        <Modal open={open}
               onClose={() => {
                   onClose();
                   clearFields()
               }}>
            <Card variant="outlined"
                  sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: {sm: '850px', xs: '100%'},
                      maxWidth: {sm: '850px', xs: '100%'},
                      maxHeight: '85%',
                      padding: 2,
                      pt: 1,
                      gap: 1,
                      margin: 'auto',
                      transform: "translate(0%, 0%)", marginTop: "70px",
                      backgroundColor: "modal",
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      boxShadow: 5,
                      borderRadius: 2,
                      position: "relative",
                  }}
            >


                <IconButton
                    aria-label="close"
                    size="small"
                    onClick={() => {
                        onClose();
                        clearFields()
                    }}
                    sx={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        width: '25px',
                        height: '25px',
                    }}
                >
                    <CloseIcon sx={{fontSize: '25px'}}/>
                </IconButton>

                <Typography variant="h6" textAlign="center" sx={{width: '100%',}}>
                    Участники проекта
                </Typography>


                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    {userHasPermission("UPDATE_WORKSPACE_PERMISSIONS") &&
                        <>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1,}}>

                                <Box
                                    sx={{
                                        backgroundColor: 'action.hover',
                                        borderRadius: 2,
                                        // width: '300px',
                                        p: '3px',
                                        border: '1px solid',
                                        borderColor: 'action.disabled'
                                    }}
                                >
                                    <Typography textAlign='center' variant='body2'>
                                        Добавить участника
                                    </Typography>

                                </Box>
                                <Box sx={{display: 'flex', flexDirection: 'row', mt: '3px'}}>

                                    <Tooltip
                                        title={usernameError}
                                        placement="bottom"
                                        arrow
                                        slotProps={{
                                            arrow: {
                                                sx: {
                                                    color: 'error.main', // светло-красный фон
                                                }
                                            },
                                            tooltip: {
                                                sx: {
                                                    fontSize: 13,
                                                    backgroundColor: 'error.main', // светло-красный фон
                                                    // color: '#d32f2f',            // красный текст
                                                    border: 'error.dark',  // красная рамка
                                                    borderRadius: 2,
                                                }
                                            }
                                        }}
                                    >
                                        <Box>
                                            <ValidatedEmailTextField
                                                username={email}
                                                setUsername={setEmail}
                                                usernameError={usernameError}
                                                setUsernameError={setUsernameError}
                                                label="Email пользователя"
                                            />
                                        </Box>

                                    </Tooltip>

                                    <Button disableRipple sx={{mb: 1}}
                                            onClick={handlePermissionsGrant}
                                            disabled={email.trim() === auth.user.email || email.trim() === '' || usernameError}
                                    >
                                        {
                                            users.includes(email.trim()) ?
                                                'обновить' : 'добавить'
                                        }

                                    </Button>
                                </Box>

                                <Box
                                    sx={{
                                        backgroundColor: 'action.hover',
                                        borderRadius: 2,
                                        // width: '300px',
                                        p: '3px',
                                        border: '1px solid',
                                        borderColor: 'action.disabled'
                                    }}
                                >
                                    <Typography variant='body2' textAlign='center'>
                                        Уровень прав участника
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    maxHeight: '450px',
                                    overflowY: 'auto',
                                    // backgroundColor: (theme) => theme.palette.background.paper,
                                    borderRadius: 1
                                }}>
                                    <ToggleButtonGroup
                                        color="primary"
                                        exclusive
                                        onChange={handleChange}
                                        sx={{
                                            alignItems: 'center',
                                            width: '100%',
                                            borderRadius: 2,

                                        }}
                                    >
                                        <ToggleButton sx={{fontSize: '0.6rem', width: '33%', borderRadius: 3}}
                                                      selected={guestPerms}
                                                      value="READ_ONLY">гость</ToggleButton>
                                        <ToggleButton sx={{fontSize: '0.6rem', width: '33%'}}
                                                      selected={userPerms}
                                                      value="USER">пользователь</ToggleButton>
                                        <ToggleButton
                                            selected={adminPerms}
                                            sx={{fontSize: '0.6rem', width: '33%', borderRadius: 3}}
                                            value="ADMIN">админ</ToggleButton>
                                    </ToggleButtonGroup>

                                    {Object.entries(permissionGroups).map(([group, perms]) => (
                                        <Box key={group} sx={{mb: '0px', fontSize: '0.8rem'}}>
                                            <Typography sx={{fontSize: '0.8rem', userSelect: 'none'}}
                                                        variant="h6">{group}</Typography>
                                            <Box sx={{fontSize: '0.8rem'}}>
                                                {
                                                    Object.entries(perms)
                                                        .map(([name, permission]) => (
                                                            <Box
                                                                sx={{
                                                                    flexDirection: 'row',
                                                                    display: 'flex',
                                                                    border: '1px solid',
                                                                    borderColor: 'action.disabled',
                                                                    borderRadius: 2,
                                                                    justifyContent: 'space-between',
                                                                    p: '5px',
                                                                    mb: '5px',
                                                                }}>
                                                                <Typography
                                                                    sx={{fontSize: '0.8rem', userSelect: 'none'}}
                                                                    variant="body2">{name}</Typography>
                                                                <AntSwitch
                                                                    disabled={permission === 'READ_WORKSPACE_CONTENT'}
                                                                    onChange={event => handlePermissionChange(event, permission)}
                                                                    checked={grantedPermissions.includes(permission)}/>
                                                            </Box>
                                                        ))}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{
                                    mx: 1,
                                    alignSelf: 'stretch',
                                }}
                            />
                        </>
                    }

                    <Box sx={{display: 'flex', flexGrow: 1, flexDirection: 'column', gap: 1}}>
                        <Box
                            sx={{
                                backgroundColor: 'action.hover',
                                borderRadius: 2,
                                width: '100%',
                                p: '3px',
                                border: '1px solid',
                                borderColor: 'action.disabled'
                            }}
                        >
                            <Typography textAlign='center' variant='body2'>
                                Текущие участники
                            </Typography>

                        </Box>

                        <Box sx={{
                            maxHeight: '550px',
                            overflowY: 'auto',
                            // backgroundColor: (theme) => theme.palette.background.paper,
                            borderRadius: 1
                        }}>
                            {workspace.usersAndPermissions
                                .filter(uap => auth.user.email === uap.info.email)
                                .map(uap => (
                                    <Box
                                        onClick={() => {
                                            setEmail(uap.info.email);
                                            setGrantedPermissions(uap.permissions)
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            height: '50px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            borderBottom: '1px solid',
                                            p: '4px',
                                            position: 'relative',
                                            alignItems: 'center',
                                            borderColor: 'action.disabled'
                                        }}>
                                        <UserAvatar userInfo={uap.info}/>

                                        <Typography sx={{
                                            fontSize: '0.9rem', ml: 2,
                                            width: '150px',
                                            fontWeight: uap.info.email === auth.user.email ? 'bold' : 'regular',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }} variant="body2">
                                            {uap.info.email}</Typography>

                                        {workspace.userId === uap.userId ?
                                            <Typography sx={{
                                                fontSize: '0.9rem', ml: 2,
                                                width: '150px',
                                                color: 'action.disabled',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }} variant="body2">
                                                Владелец</Typography>

                                            : <Box sx={{width: '150px'}}></Box>}

                                        <Tooltip
                                            title={uap.permissions.join('\n')}
                                            placement="bottom"
                                            arrow
                                            slotProps={{
                                                tooltip: {
                                                    sx: {
                                                        whiteSpace: 'pre-wrap',
                                                        fontSize: 13,
                                                        borderRadius: 2,
                                                    }
                                                }
                                            }}
                                        >
                                            <IconButton disableRipple
                                                        sx={{
                                                            position: 'absolute',
                                                            right: 30,
                                                            top: 7
                                                        }}
                                            >
                                                <QuestionMarkIcon sx={{fontSize: '18px'}}/>
                                            </IconButton>
                                        </Tooltip>

                                        {userHasPermission("UPDATE_WORKSPACE_PERMISSIONS") && workspace.userId !== uap.userId &&
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    revokeGrants(uap)
                                                }}
                                                sx={{
                                                    position: 'absolute',
                                                    right: 2,
                                                    top: 8
                                                }}
                                            >
                                                <DeleteTask color={'rgba(193,9,9,0.9)'}/>
                                            </IconButton>

                                        }
                                    </Box>
                                ))}


                            {workspace.usersAndPermissions
                                .filter(uap => auth.user.email !== uap.info.email)
                                .map(uap => (
                                    <Box
                                        onClick={() => {
                                            setEmail(uap.info.email);
                                            setGrantedPermissions(uap.permissions)
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            height: '50px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            borderBottom: '1px solid',
                                            p: '4px',
                                            position: 'relative',
                                            alignItems: 'center',
                                            borderColor: 'action.disabled'
                                        }}>
                                        <UserAvatar userInfo={uap.info}/>

                                        <Typography sx={{
                                            fontSize: '0.9rem', ml: 2,
                                            width: '150px',
                                            fontWeight: uap.info.email === auth.user.email ? 'bold' : 'regular',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }} variant="body2">
                                            {uap.info.email}</Typography>

                                        {workspace.userId === uap.userId ?
                                            <Typography sx={{
                                                fontSize: '0.9rem', ml: 2,
                                                width: '150px',
                                                color: 'action.disabled',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }} variant="body2">
                                                Владелец</Typography>

                                            : <Box sx={{width: '150px'}}></Box>}

                                        <Tooltip
                                            title={uap.permissions.join('\n')}
                                            placement="bottom"
                                            arrow
                                            slotProps={{
                                                tooltip: {
                                                    sx: {
                                                        whiteSpace: 'pre-wrap',
                                                        fontSize: 13,
                                                        borderRadius: 2,
                                                    }
                                                }
                                            }}
                                        >
                                            <IconButton disableRipple
                                                        sx={{
                                                            position: 'absolute',
                                                            right: 30,
                                                            top: 7
                                                        }}
                                            >
                                                <QuestionMarkIcon sx={{fontSize: '18px'}}/>
                                            </IconButton>
                                        </Tooltip>

                                        {userHasPermission("UPDATE_WORKSPACE_PERMISSIONS") && workspace.userId !== uap.userId &&
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    revokeGrants(uap)
                                                }}
                                                sx={{
                                                    position: 'absolute',
                                                    right: 2,
                                                    top: 8
                                                }}
                                            >
                                                <DeleteTask color={'rgba(193,9,9,0.9)'}/>
                                            </IconButton>

                                        }
                                    </Box>
                                ))}


                        </Box>
                    </Box>
                </Box>
            </Card>
        </Modal>
    )
};