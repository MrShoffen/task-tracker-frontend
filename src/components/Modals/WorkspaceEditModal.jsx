import * as React from "react";
import {useState} from "react";
import {useNotification} from "../../context/Notification/NotificationProvider.jsx";
import {
    Box,
    Button,
    Card,
    Divider,
    Grid,
    IconButton,
    Modal,
    Paper,
    ToggleButton,
    ToggleButtonGroup
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

export default function WorkspaceEditModal({workspace, open, onClose}) {

    const {userHasPermission} = useTaskOperations();

    const [wsName, setWsName] = useState(workspace.name);
    const {updateWsField, loadAllWorkspaces} = useTaskOperations();

    const [isPublic, setIsPublic] = useState(workspace.isPublic)
    const handleChange = (event, type) => {
        setIsPublic(type === 'public');
    };

    const [selectedImage, setSelectedImage] = useState(workspace.coverUrl);

    const {showWarn, showSuccess} = useNotification();

    const handleImageClick = async (imageUrl) => {
        if (imageUrl === selectedImage) {
            return;
        }
        try {
            await sendEditWs('cover', workspace, {
                newCoverUrl: imageUrl
            });
            setSelectedImage(imageUrl);
            showSuccess("Обложка обновлена!")
        } catch (error) {
            updateWsField('coverUrl', selectedImage);
            showWarn(error.message);
        }
    };

    const clearFields = () => {
        setWsName(workspace.name);
        setIsPublic(workspace.isPublic);
        setSelectedImage(workspace.coverUrl)
    };

    async function handleNameSave() {
        const oldName = workspace.name;
        try {
            await sendEditWs("name", workspace,
                {
                    newName: wsName
                });
            loadAllWorkspaces();
            showSuccess("Имя обновлено")

        } catch (error) {
            updateWsField('name', oldName);
            setWsName(oldName);
            showWarn(error.message);
        }
    }

    async function handleAccessSave() {
        try {
            // updateWsField('isPublic', isPublic);
            await sendEditWs("access", workspace,
                {
                    isPublic: isPublic
                });
            showSuccess("Уровень доступа обновлен")

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
                      minWidth: {sm: '800px', xs: '100%'},
                      maxWidth: {sm: '800px', xs: '100%'},
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

                <Typography variant="h6" textAlign="center" sx={{width: '100%', mb: 1}}>
                    Настройка проекта
                </Typography>

                <Divider/>


                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                    {userHasPermission("UPDATE_WORKSPACE_NAME") &&
                        <>
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
                                    Имя пространства
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'row'}}>
                                <ValidatedProfileField
                                    label={"Имя"}
                                    name={wsName}
                                    setName={setWsName}
                                    id={"wsName"}
                                />
                                <Button disableRipple sx={{mb: 1}}
                                        onClick={handleNameSave}
                                        disabled={workspace.name === wsName || wsName.trim() === ''}
                                >сохранить</Button>
                            </Box>
                            <Divider/>

                        </>
                    }

                    {userHasPermission("UPDATE_WORKSPACE_ACCESS") &&
                        <>
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
                                    Уровень доступа к пространству
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'row', mt: 1}}>
                                <ToggleButtonGroup
                                    color="primary"
                                    exclusive
                                    onChange={handleChange}
                                    sx={{
                                        alignItems: 'center',
                                        width: '25%',
                                        borderRadius: 2,

                                        mb: 2,
                                        mt: -1
                                    }}
                                >
                                    <ToggleButton
                                        selected={isPublic}
                                        sx={{width: '50%', height: '30px', fontSize: '0.6rem', borderRadius: 3}}
                                        value='public'>Публичный</ToggleButton>
                                    <ToggleButton
                                        selected={!isPublic}
                                        sx={{width: '50%', height: '30px', fontSize: '0.6rem', borderRadius: 3}}
                                        value='private'>Приватный</ToggleButton>
                                </ToggleButtonGroup>
                                <Button
                                    onClick={handleAccessSave}
                                    disabled={isPublic && workspace.isPublic || !isPublic && !workspace.isPublic}
                                    disableRipple sx={{mb: 3, pl: 1}}

                                >сохранить</Button>
                                {workspace.isPublic &&
                                    <CopyLinkButton
                                        linkToCopy={'/public-workspaces/' + workspace.id}/>
                                }
                            </Box>
                            <Divider/>
                        </>}

                    {userHasPermission("UPDATE_WORKSPACE_COVER") &&
                        <>
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
                                    Обложка
                                </Typography>
                            </Box>
                            <Box sx={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                padding: 2,
                                // backgroundColor: (theme) => theme.palette.background.paper,
                                borderRadius: 1
                            }}>
                                <Grid container spacing={2}>
                                    {workspaceCovers.map((imageUrl) => (
                                        <Grid key={imageUrl}>
                                            <Paper
                                                elevation={3}
                                                sx={{
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    '&:hover': {
                                                        boxShadow: 6
                                                    },
                                                    border: selectedImage === imageUrl ? '2px solid' : 'none',
                                                    borderColor: 'success.main'
                                                }}
                                                onClick={() => handleImageClick(imageUrl)}
                                            >

                                                {imageUrl ?
                                                    <Box
                                                        component="img"
                                                        src={imageUrl}
                                                        alt="Cover"
                                                        sx={{
                                                            width: '130px',
                                                            height: '120px',
                                                            objectFit: 'cover',
                                                            display: 'block'
                                                        }}
                                                    /> :
                                                    <Box
                                                        // component="img"
                                                        // src={imageUrl}
                                                        // alt="Cover"
                                                        sx={{
                                                            width: '130px',
                                                            height: '120px',
                                                            objectFit: 'cover',
                                                            display: 'block',
                                                            // alignItems: 'center',
                                                            alignContent: 'center',
                                                            // m: 'auto'
                                                        }}
                                                    >
                                                        <DoDisturbIcon sx={{fontSize: '70px', mt: 1, ml: '30px'}}/>
                                                    </Box>
                                                }
                                                {selectedImage === imageUrl && (
                                                    <IconButton
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 5,
                                                            right: 5,
                                                            color: 'white',
                                                            backgroundColor: 'success.main',

                                                        }}
                                                    >
                                                        <CheckCircleOutlineIcon/>
                                                    </IconButton>
                                                )}
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </>
                    }


                </Box>
            </Card>
        </Modal>
    )
};