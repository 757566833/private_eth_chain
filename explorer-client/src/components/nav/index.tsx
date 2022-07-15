import React, { useCallback } from 'react'
import { Box, AppBar, Toolbar, Typography } from "@mui/material"
import { useClintNavigation } from '@/hooks/navigation';

const Nav: React.FC = () => {
    const [navigation] = useClintNavigation();
    const handleClick = useCallback(()=>{
        navigation.push("/")
    },[])
    return <AppBar position="static">
        <Toolbar>
            <Typography variant="h5" fontWeight={'bold'} onClick={handleClick}>
                区块链浏览器
            </Typography>

        </Toolbar>
    </AppBar>
}
export default Nav;

