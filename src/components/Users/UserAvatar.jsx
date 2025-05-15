import {Avatar} from "@mui/material";
import {avatarColor} from "../../services/util/Utils.js";
import * as React from "react";


export function UserAvatar({userInfo, sx = {}}) {

    return (
        <Avatar sx={{
            fontSize: "13px",
            color: 'white',
            border: '2px solid ',
            borderColor: 'action.selected',
            backgroundColor: avatarColor(userInfo.email),
            fontWeight: "500",
            m: 0,
            ...sx
        }}
                alt={userInfo.email}
                src={userInfo.avatarUrl}
        >
            {userInfo.email.slice(0, 3)}
        </Avatar>
    )
}