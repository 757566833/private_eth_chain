import React, {PropsWithChildren, useEffect} from "react";
import Nav from "@/components/nav";
import {Box, Toolbar, useTheme} from "@mui/material";
export const Layout:React.FC<PropsWithChildren<unknown>> = (props)=>{
    return <Box bgcolor={theme=>theme.palette.background.default} minHeight={1057}>
        <Nav/>
        {props.children}
    </Box>
}
export default Layout
