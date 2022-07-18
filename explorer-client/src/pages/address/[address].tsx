import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link';
import { Box, Chip, TablePagination, TableFooter, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, useTheme, IconButton } from '@mui/material'
import { LastPage, FirstPage, KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material'
import { ITx, IResponseList } from "@/services/interface";
import { timeRender } from "@/lib/time";
import modal from '@/lib/modal'
import { useRouter } from 'next/router';
import { ETxType } from '@/constant/enum';
import Provider from '@/instance/provider';
import { weiToEth } from '@/lib/utils/eth';
import Ellipsis from '@/lib/ellipsis';
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

const Address: React.FC = () => {
    const theme = useTheme();
    const [page, setPage] = useState(1);
    const [data, setData] = useState<ITx[]>([])
    const [balance, setbalance] = useState("")
    const router = useRouter();
    const { query } = router
    const { address } = query
    const func1 = useCallback(async (page: number, address: string) => {
        const res = await fetch(`http://192.168.246.22:9090/address/${address}?page=${page}&size=10`)
        const response: IResponseList<ITx> = await res.json()
        const hits = response.hits.hits
        const nextData: ITx[] = []
        for (const iterator of hits) {
            nextData.push(iterator)
        }
        setData(nextData)
    }, [])
    const func2 = useCallback(async (address: string) => {
        console.log()
        const instance = await Provider.getInstance();
        const res = await instance.getBalance(address)
        console.log(res)
        setbalance(res.toString())
    }, [])
    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setPage(page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setPage(page + 1);
    };


    useEffect(() => {
        if (address) {
            func1(page, address.toString())
            func2(address.toString())
        }

    }, [page, address])

    return <Box width={1400} margin='0 auto'>
        <Typography variant="h5" fontWeight={'bold'}>
            address
        </Typography>
        <Typography variant="body1" >
            {weiToEth(balance)} eth
        </Typography>
        <TableContainer component={Paper} elevation={0} variant='outlined'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>hash</TableCell>
                        <TableCell>timestamp</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>from</TableCell>
                        <TableCell>to</TableCell>
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
                                <Ellipsis width={160}>
                                    <Link href={`/tx/${item._source?.hash}`}>{item._source?.hash || ''}</Link>
                                </Ellipsis>
                            </TableCell>
                            <TableCell >
                                <Box width={140}>{timeRender(item._source?.timestamp)}</Box>
                            </TableCell>
                            <TableCell><Link href={`/block/${item._source?.number}`}>{item._source?.number || ''}</Link></TableCell>
                            <TableCell>
                                {address == item._source.from ? <Chip label={<Ellipsis width={160}>
                                    <Link href={`/address/${item._source?.from}`} passHref={true}>
                                        <a style={{ color: '#ffffff' }}>{item._source?.from || ''}</a>
                                    </Link>
                                </Ellipsis>} color="primary" /> : <Ellipsis width={160}>
                                    <Link href={`/address/${item._source?.from}`}>{item._source?.from || ''}</Link>
                                </Ellipsis>}

                            </TableCell>
                            <TableCell>

                                {address == item._source.to ? <Chip label={<Ellipsis width={160}>
                                    <Link href={`/address/${item._source?.to}`} passHref={true}><a style={{ color: '#ffffff' }}>{item._source?.to || ''}</a></Link>
                                </Ellipsis>} color="primary" /> : <Ellipsis width={160}>
                                    <Link href={`/address/${item._source?.to}`}>{item._source?.to || ''}</Link>
                                </Ellipsis>}

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
export default Address;