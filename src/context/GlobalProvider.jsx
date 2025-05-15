import {CustomThemeProvider} from "./GlobalThemeContext/CustomThemeProvider.jsx";
import {NotificationProvider} from "./Notification/NotificationProvider.jsx";
import {AuthProvider} from "./Auth/AuthContext.jsx";
import {TaskLoadProvider} from "./Tasks/TaskLoadProvider.jsx";

export const GlobalProvider = ({children}) => {

    return (
        <NotificationProvider>
            <CustomThemeProvider>
                <AuthProvider>
                    <TaskLoadProvider>
                        {children}
                    </TaskLoadProvider>
                </AuthProvider>
            </CustomThemeProvider>
        </NotificationProvider>
    )
}