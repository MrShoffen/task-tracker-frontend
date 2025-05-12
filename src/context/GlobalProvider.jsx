import {CustomThemeProvider} from "./GlobalThemeContext/CustomThemeProvider.jsx";
import {NotificationProvider} from "./Notification/NotificationProvider.jsx";
import {AuthProvider} from "./Auth/AuthContext.jsx";

export const GlobalProvider = ({children}) => {

    return (
        <CustomThemeProvider>
            <NotificationProvider>
                <AuthProvider>

                    {children}

                </AuthProvider>
            </NotificationProvider>
        </CustomThemeProvider>
    )
}