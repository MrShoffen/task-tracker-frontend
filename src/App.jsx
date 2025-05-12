import './App.css'
import {GlobalProvider} from "./context/GlobalProvider.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {BaseLayout} from "./pages/BaseLayout.jsx";
import UnavailableAfterLoginRoute from "./context/Auth/UnavailableAfterLoginRoute.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import {RegistrationPage} from "./pages/RegistrationPage.jsx";
import {RegistrationConfirmationPage} from "./pages/RegistrationConfirmationPage.jsx";

function App() {

    return (
        <BrowserRouter>
            <GlobalProvider>
                <Routes>
                    <Route element={<BaseLayout/>}>

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
