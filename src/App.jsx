import {GlobalProvider} from "./context/GlobalProvider.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {BaseLayout} from "./pages/BaseLayout.jsx";
import UnavailableAfterLoginRoute from "./context/Auth/UnavailableAfterLoginRoute.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import {RegistrationPage} from "./pages/RegistrationPage.jsx";
import {RegistrationConfirmationPage} from "./pages/RegistrationConfirmationPage.jsx";
import WorkspacesPage from "./pages/WorkspacesPage.jsx";
import AvailableAfterLoginRoute from "./context/Auth/AvailableAfterLoginRoute.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import PublicWsPage from "./pages/PublicWsPage.jsx";
import FastLogin from "./pages/FastLogin.jsx";

function App() {

    return (
        <BrowserRouter>
            <GlobalProvider>
                <Routes>
                    <Route element={<BaseLayout/>}>

                        <Route path="*" element={<ErrorPage/>}/>


                        {/*available before login only*/}
                        <Route path="login"
                               element={
                                   <UnavailableAfterLoginRoute>
                                       <LoginPage/>
                                   </UnavailableAfterLoginRoute>
                               }/>

                        <Route path="registration"
                               element={
                                   <UnavailableAfterLoginRoute>
                                       <RegistrationPage/>
                                   </UnavailableAfterLoginRoute>
                               }/>


                        <Route path="fast-sign-up"
                               element={
                                   <UnavailableAfterLoginRoute>
                                       <FastLogin/>
                                   </UnavailableAfterLoginRoute>
                               }/>

                        <Route path="workspaces/*"
                               element={
                                   <AvailableAfterLoginRoute>
                                       <WorkspacesPage/>
                                   </AvailableAfterLoginRoute>
                               }/>

                        <Route path="public-workspaces/*"
                               element={<PublicWsPage/>}
                        />

                        <Route path="profile"
                               element={
                                   <AvailableAfterLoginRoute>
                                       <ProfilePage/>
                                   </AvailableAfterLoginRoute>
                               }/>

                        <Route path="registration-confirm"
                               element={
                                   <UnavailableAfterLoginRoute>
                                       <RegistrationConfirmationPage/>
                                   </UnavailableAfterLoginRoute>
                               }/>


                    </Route>
                </Routes>
            </GlobalProvider>
        </BrowserRouter>
    )
}

export default App
