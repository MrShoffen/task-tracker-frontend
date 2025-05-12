import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";


const ThemeContext = createContext();

export const useCustomThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({children}) => {

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('isDarkMode');
        return savedTheme ? JSON.parse(savedTheme) : true;
    });

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('isDarkMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    const theme = useMemo(
        () =>
            createTheme({
                components: {
                    MuiIconButton: {
                        styleOverrides: {
                            root: {
                                '&:focus': {outline: 'none'},
                                '&:focus-visible': {boxShadow: 'none'}
                            }
                        }
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                '&:not(.MuiLoadingButton-loading):not(.Mui-disabled)': {
                                    '&.MuiButton-contained': {
                                        backgroundColor: 'rgb(50,154,232)',
                                        textShadow: 'rgba(0, 0, 0, 0.25) 0 3px 8px',
                                        color: '#FFFFFF',
                                        '&:hover': {
                                            boxShadow: 'rgba(50,154,232, 0.5) 0 1px 20px',
                                        },
                                        '&:active': {
                                            transform: 'translateY(1px)',
                                            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)', // Optional
                                        },

                                    },
                                    '&:focus': {outline: 'none'},

                                }
                            }
                        }
                    }
                },

                palette: {
                    mode: isDarkMode ? 'dark' : 'light',
                    header: isDarkMode ? "rgba(30,30,30,0.8)" : "rgba(240,240,240,0.5)",
                    searchInput: isDarkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)",
                    menu: isDarkMode ? 'rgba(0,0,0,0.8)' : "white",
                    modal: isDarkMode ? "rgba(0,0,0,0.4)" : "white",
                    objectHover: isDarkMode ? "rgba(45,58,112,0.6)" : "rgba(202,202,202,0.7)",
                    objectSelected: isDarkMode ? "rgba(45,86,197,0.35)" : "rgba(126,126,126,0.7)",
                    selectHeader: isDarkMode ? "rgb(18,18,18)" : "rgb(209,209,209)",
                    background: {
                        default: isDarkMode ? 'black' : 'white',
                    },
                },
            }),
        [isDarkMode]
    );

    return (
        <ThemeContext.Provider value={{isDarkMode, toggleTheme}}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme/>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}