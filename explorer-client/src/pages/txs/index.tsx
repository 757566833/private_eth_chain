import React, { useState, useCallback, useEffect } from 'react'
import { Box, AppBar, TablePagination, TableFooter, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, useTheme, IconButton } from '@mui/material'
import { LastPage, FirstPage, KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material'
import { ITx, IResponseList } from "@/services/interface";
import { timeRender } from "@/lib/time";
import modal from '@/lib/modal'
import { ETxType } from '@/constant/enum';
import { useRouter } from 'next/router';
import Ellipsis from '@/lib/ellipsis';
import Link from 'next/link';
import { weiToEth, weiToGwei } from '@/lib/utils/eth';
import { receiverTypeRender } from '@/utils/render';
interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

const Txs: React.FC = () => {
    const theme = useTheme();
    const [page, setPage] = useState(1);
    const [data, setData] = useState<ITx[]>([])
    const router = useRouter();
    const { query } = router;
    const { block } = query;
    const func1 = useCallback(async (page: number, block?: string) => {
        let url = `http://192.168.246.22:9090/txs?page=${page}&size=10`
        if (block) {
            url += `&block=${block}`
        }
        const res = await fetch(url)
        const response: IResponseList<ITx> = await res.json()
        const hits = response.hits.hits
        const nextData: ITx[] = []
        for (const iterator of hits) {
            nextData.push(iterator)
        }
        setData(nextData)
    }, [])

    const handleBackButtonClick = () => {
        setPage(page - 1);
    };

    const handleNextButtonClick = () => {
        setPage(page + 1);
    };


    useEffect(() => {
        func1(page, block as string | undefined)
    }, [page, block])

    return <Box width={1400} margin='0 auto'>
        <Typography variant="h5" fontWeight={'bold'}>
            txs
        </Typography>
        <Typography variant="body1">
            from block <Link href={`/block/${block}`}>{block||''}</Link>
        </Typography>
        <TableContainer component={Paper} elevation={0} variant='outlined'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>hash</TableCell>
                        <TableCell>timestamp</TableCell>
                        <TableCell>gas</TableCell>
                        <TableCell>gasPrice</TableCell>
                        <TableCell>from</TableCell>
                        <TableCell>receiver</TableCell>
                        <TableCell>type</TableCell>
                        <TableCell>value</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item: ITx) => (
                        <TableRow
                            key={item._source?.number}
                        >
                            <TableCell>
                                <Ellipsis width={100}>
                                    <Link href={`/tx/${item._source?.hash}`}>{item._source?.hash||''}</Link>
                                </Ellipsis>
                            </TableCell>
                            <TableCell ><Box width={180}>{timeRender(item._source?.timestamp)}</Box></TableCell>
                            <TableCell>{item._source?.gas}</TableCell>
                            <TableCell>{weiToGwei(item._source?.gasPrice)} gwei</TableCell>
                            <TableCell>
                                <Ellipsis width={100}>
                                    <Link href={`/address/${item._source?.from}`}>{item._source?.from||''}</Link>
                                </Ellipsis>
                            </TableCell>
                            <TableCell>
                                <Ellipsis width={100}>
                                    {receiverTypeRender(item._source?.to,item._source?.contractAddress)}: <Link href={`/address/${item._source?.to||item._source?.contractAddress}`}>{item._source?.to||item._source?.contractAddress||''}</Link>
                                </Ellipsis>
                            </TableCell>
                            <TableCell>{ETxType[item._source?.type]}</TableCell>
                            <TableCell>{weiToEth(item._source?.value)} eth</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>
                            <Box display={'flex'}>

                                <IconButton
                                    onClick={handleBackButtonClick}
                                    disabled={page === 0}
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
export default Txs;