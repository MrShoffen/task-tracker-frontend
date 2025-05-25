import {Avatar} from "@mui/material";
import {avatarColor} from "../../services/util/Utils.jsx";
import * as React from "react";


export function UserAvatar({userInfo, sx = {}}) {

    return (
        <Avatar sx={{
            fontSize: "13px",
            color: 'white',
            border: '2px solid ',
            borderColor: 'action.selected',
            backgroundColor: userInfo ? avatarColor(userInfo?.email) : 'white',
            fontWeight: "500",
            m: 0,
            ...sx
        }}
                alt={userInfo?.email}
                src={userInfo?.avatarUrl}
        >
            {(userInfo.firstName && userInfo.lastName) ?
                (userInfo.firstName.slice(0, 1) + userInfo.lastName.slice(0, 1)) :
                userInfo?.email.slice(0, 2)}
        </Avatar>
    )
}