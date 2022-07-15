import React, { useState, useCallback, useEffect } from 'react'
import { Box, AppBar, TablePagination, TableFooter, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, useTheme, IconButton } from '@mui/material'
import { LastPage, FirstPage, KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material'
import { IBlock, IResponseList } from "@/services/interface";
import { timeRender } from "@/lib/time";
import modal from '@/lib/modal'
import Link from 'next/link';

const Blocks: React.FC = () => {
    const theme = useTheme();
    const [page, setPage] = useState(1);
    const [data, setData] = useState<IBlock[]>([])

    const func1 = useCallback(async (page: number) => {
        const res = await fetch(`http://127.0.0.1:9090/blocks?page=${page}&size=10`)
        const response: IResponseList<IBlock> = await res.json()
        const hits = response.hits.hits
        const nextData: IBlock[] = []
        for (const iterator of hits) {
            nextData.push(iterator)
        }
        setData(nextData)
    }, [])

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setPage(page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setPage(page + 1);
    };


    useEffect(() => {
        func1(page)
    }, [page])

    return <Box>
        <Typography variant="h5" fontWeight={'bold'}>
            blocks
        </Typography>
        <TableContainer component={Paper} elevation={0} variant='outlined'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>number</TableCell>
                        <TableCell>timestamp</TableCell>
                        <TableCell>txs</TableCell>
                        <TableCell>baseFeePerGas</TableCell>
                        <TableCell>difficulty</TableCell>
                        <TableCell>extraData</TableCell>
                        <TableCell>gasLimit</TableCell>
                        <TableCell>gasUsed</TableCell>
                        <TableCell>logsBloom</TableCell>
                        <TableCell>miner</TableCell>
                        <TableCell>mixHash</TableCell>
                        <TableCell>nonce</TableCell>
                        <TableCell>parentHash</TableCell>
                        <TableCell>receiptsRoot</TableCell>
                        <TableCell>sha3Uncles</TableCell>
                        <TableCell>stateRoot</TableCell>
                        <TableCell>transactionsRoot</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item: IBlock) => (
                        <TableRow
                            key={item._source?.number}
                        >
                            <TableCell><Link href={`/block/${item._source?.number}`}>{item._source?.number}</Link></TableCell>
                            <TableCell ><Box width={180}>{timeRender(item._source?.timestamp)}</Box></TableCell>
                            <TableCell>{item._source?.txns}</TableCell>
                            <TableCell>{item._source?.baseFeePerGas}</TableCell>
                            <TableCell>{item._source?.difficulty}</TableCell>
                            <TableCell><Button sx={{ width: 80 }} onClick={() => modal.info({ title: '详情', content: item._source?.extraData })}>查看详情</Button></TableCell>
                            <TableCell>{item._source?.gasLimit}</TableCell>
                            <TableCell>{item._source?.gasUsed}</TableCell>
                            <TableCell><Button sx={{ width: 80 }} onClick={() => modal.info({ title: '详情', content: item._source?.logsBloom })}>查看详情</Button></TableCell>
                            <TableCell>{item._source?.miner}</TableCell>
                            <TableCell>{item._source?.mixHash}</TableCell>
                            <TableCell>{item._source?.nonce}</TableCell>
                            <TableCell>{item._source?.parentHash}</TableCell>
                            <TableCell>{item._source?.receiptsRoot}</TableCell>
                            <TableCell>{item._source?.sha3Uncles}</TableCell>
                            <TableCell>{item._source?.stateRoot}</TableCell>
                            <TableCell>{item._source?.transactionsRoot}</TableCell>
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
export default Blocks;