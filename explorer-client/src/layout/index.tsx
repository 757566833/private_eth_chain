import React, {PropsWithChildren, useEffect} from "react";
import Nav from "@/components/nav";
import {Box, Toolbar, useTheme} from "@mui/material";
export const Layout:React.FC<PropsWithChildren<unknown>> = (props)=>{
    const theme = useTheme();
    useEffect(()=>{
        console.log('theme',theme)
    },[theme])
    return <Box>
        <Nav/>
        {props.children}
    </Box>
}
export default Layout
