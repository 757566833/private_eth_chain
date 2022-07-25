import React, { useState, useCallback, useEffect } from 'react'
import { Box, AppBar, TablePagination, TableFooter, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, useTheme, IconButton } from '@mui/material'
import { LastPage, FirstPage, KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material'
import { IBlock, IResponseList } from "@/services/interface";
import { timeRender } from "@/lib/time";
import {ethers} from 'ethers'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useClintNavigation } from '@/hooks/navigation';

const Blocks: React.FC = () => {
    const theme = useTheme();
    const [data, setData] = useState<IBlock[]>([])
    const router = useRouter();
    const { query } = router;
    const { size='10',page='1' } = query;
    const [clientNavigation] = useClintNavigation()
    const func1 = useCallback(async (page: string,size:string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_RESTFUL}/blocks?page=${page}&size=10`)
        const response: IResponseList<IBlock> = await res.json()
        const hits = response.hits.hits
        const nextData: IBlock[] = []
        for (const iterator of hits) {
            nextData.push(iterator)
        }
        setData(nextData)
    }, [])

    const handleBackButtonClick = useCallback(() => {
        clientNavigation.push(`/blocks?page=${ethers.BigNumber.from(page).sub(1).toString()}&size=${size}`)
    },[ clientNavigation, page, size]);

    const handleNextButtonClick =useCallback( () => {
        clientNavigation.push(`/blocks?page=${ethers.BigNumber.from(page).add(1).toString()}&size=${size}`)
    },[ clientNavigation, page, size]);


    useEffect(() => {
        func1(page.toString(),size.toString())
    }, [func1, page,size])

    return <Box width={1400} margin='0 auto'>
        <Typography color={theme => theme.palette.text.primary} variant="h5" fontWeight={'bold'} padding={3}>
            blocks
        </Typography>
        <TableContainer component={Paper} elevation={0} variant='outlined'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>number</TableCell>
                        <TableCell>timestamp</TableCell>
                        <TableCell>txs</TableCell>
                        <TableCell>difficulty</TableCell>
                        <TableCell>gasLimit</TableCell>
                        <TableCell>gasUsed</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item: IBlock) => (
                        <TableRow
                            key={item._source?.number}
                        >
                            <TableCell><Link href={`/block/${item._source?.number}`}>{item._source?.number||''}</Link></TableCell>
                            <TableCell ><Box width={180}>{timeRender(item._source?.timestamp)}</Box></TableCell>
                            <TableCell><Link href={`/txs?block=${item._source?.number}`}>{item._source?.txns||''}</Link></TableCell>
                            <TableCell>{item._source?.difficulty}</TableCell>
                            <TableCell>{item._source?.gasLimit}</TableCell>
                            <TableCell>{item._source?.gasUsed}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>
                            <Box display={'flex'}>
                                <IconButton
                                    onClick={handleBackButtonClick}
                                    disabled={page.toString() == '1'}
                                    aria-label="previous page"
                                >
                                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                </IconButton>
                                <IconButton
                                    onClick={handleNextButtonClick}
                                    aria-label="next page"
                                >
                                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                                </IconButton>
                            </Box>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    </Box>
}
export default Blocks;