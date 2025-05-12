import {UsageHint} from "../components/hints/UsageHint.jsx";
import {Box} from "@mui/material";
import {FilePageButton} from "../components/FilePageButton/FilePageButton.jsx";
import {useAuthContext} from "../context/Auth/AuthContext.jsx";


export const Help = () =>{
    const {auth} = useAuthContext();

    return(
        <Box sx={{pt: 10}}>
            {auth.isAuthenticated && <FilePageButton/>}

        <UsageHint/>
        </Box>
    )
}