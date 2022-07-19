import {createTheme, ThemeProvider as ControlTheme} from '@mui/material/styles';
import React, {PropsWithChildren} from "react";
import {useMode} from "@/context/mode";

const ThemeProvider:React.FC<PropsWithChildren<unknown>> = (props)=>{
    const {children} = props;
    const [mode] = useMode();
    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );
    return <ControlTheme theme={theme}>
        <meta name="color-scheme" id={'colorScheme'} content={mode}/>
        {children}
    </ControlTheme>
}
export  default  ThemeProvider
