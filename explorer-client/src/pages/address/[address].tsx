import React, { useState, useCallback, useEffect } from 'react'
import { Box, AppBar, TablePagination, TableFooter, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, useTheme, IconButton } from '@mui/material'
import { LastPage, FirstPage, KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material'
import { ITx, IResponseList } from "@/services/interface";
import { timeRender } from "@/lib/time";
import modal from '@/lib/modal'
import { useRouter } from 'next/router';
import { ETxType } from '@/constant/enum';
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
    const router = useRouter();
    const {query} = router
    const {address} = query
    const func1 = useCallback(async (page: number,address:string) => {
        const res = await fetch(`http://127.0.0.1:9090/address/${address}?page=${page}&size=10`)
        const response: IResponseList<ITx> = await res.json()
        const hits = response.hits.hits
        const nextData: ITx[] = []
        for (const iterator of hits) {
            nextData.push(iterator)
        }
        setData(nextData)
    }, [])

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setPage(page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setPage( page + 1);
    };


    useEffect(() => {
        if(address){
            func1(page,address.toString())
        }
       
    }, [page,address])

    return <Box>
        <Typography variant="h5" fontWeight={'bold'}>
            address
        </Typography>
        <TableContainer component={Paper} elevation={0} variant='outlined'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>hash</TableCell>
                        <TableCell>timestamp</TableCell>
                        <TableCell>gas</TableCell>
                        <TableCell>gasPrice</TableCell>
                        <TableCell>maxFeePerGas</TableCell>
                        <TableCell>maxPriorityFeePerGas</TableCell>
                        <TableCell>nonce</TableCell>
                        <TableCell>input</TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>r</TableCell>
                        <TableCell>s</TableCell>
                        <TableCell>v</TableCell>
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
                            <TableCell>{item._source?.hash}</TableCell>
                            <TableCell ><Box width={180}>{timeRender(item._source?.timestamp)}</Box></TableCell>
                            <TableCell>{item._source?.gas}</TableCell>
                            <TableCell>{item._source?.gasPrice}</TableCell>
                            <TableCell>{item._source?.maxFeePerGas}</TableCell>
                            <TableCell>{item._source?.maxPriorityFeePerGas}</TableCell>
                            <TableCell>{item._source?.nonce}</TableCell>
                            <TableCell><Button sx={{ width: 80 }} onClick={() => modal.info({ title: '详情', content: item._source?.input })}>查看详情</Button></TableCell>
                            <TableCell>{item._source?.number}</TableCell>
                            <TableCell>{item._source?.r}</TableCell>
                            <TableCell>{item._source?.s}</TableCell>
                            <TableCell>{item._source?.v}</TableCell>
                            <TableCell>{item._source?.to}</TableCell>
                            <TableCell>{ETxType[item._source?.type]}</TableCell>
                            <TableCell>{item._source?.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
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
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    </Box>
}
export default Address;