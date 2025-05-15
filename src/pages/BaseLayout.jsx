import {Outlet} from "react-router-dom";
import {PersistentDrawerLeft} from "../components/Layouts/PersistentDrawerLeft.jsx";
import {useState} from "react";


export const BaseLayout = () => {
    const [open, setOpen] = useState(() => {
        const savedState = localStorage.getItem("drawerOpen");
        return savedState !== null ? JSON.parse(savedState) : true;
    });
    return (
        <PersistentDrawerLeft open={open} setOpen={setOpen}>
            <Outlet /> {/* Здесь будут отображаться страницы */}
        </PersistentDrawerLeft>
    )

}