import React, { useEffect, useState, useCallback } from 'react'
import { Box, Button, TableFooter, Grid, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import { IResponseList, ITx } from "@/services/interface";
import { timeRender } from "@/lib/time";
import { weiToEth, weiToGwei } from '@/lib/utils/eth';
import { useClintNavigation } from '@/hooks/navigation';
import Link from 'next/link';
import { ETxType } from '@/constant/enum';
const LastTx: React.FC = () => {
    const [data, setData] = useState<ITx[]>([])
    const [navigation] = useClintNavigation();
    const func1 = useCallback(async () => {
        const res = await fetch('http://127.0.0.1:9090/txs?size=10')
        const response: IResponseList<ITx> = await res.json()
        const hits = response.hits.hits
        const nextData: ITx[] = []
        for (const iterator of hits) {
            nextData.push(iterator)
        }
        setData(nextData)
    }, [])
    const handleAll = useCallback(() => {
        navigation.push('/txs')
    }, [])
    useEffect(() => {
        func1()
    }, [])
    return <>
        <Typography variant="h6" fontWeight={'bold'}>
            最近交易
        </Typography>
        <Typography variant="body1">
            最近公布的交易
        </Typography>
        <TableContainer component={Paper} elevation={0} variant='outlined'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>hash</TableCell>
                        {/* <TableCell>number</TableCell> */}
                        <TableCell>gas</TableCell>

                        <TableCell>address</TableCell>
                        <TableCell>value</TableCell>
                        <TableCell>交易类型</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item: ITx) => (
                        <TableRow
                            key={item._source?.hash}
                        >
                            <TableCell>
                                <Box style={{ width: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><Link href={`/tx/${item._source?.hash}`}>{item._source?.hash}</Link></Box>
                                <Box>{timeRender(item._source?.timestamp)}</Box>
                            </TableCell>
                            <TableCell>
                                <Box>
                                    gas: {weiToGwei(item._source?.gasPrice)}(gwei)
                                </Box>
                                <Box>
                                    limit: {item._source.gas}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box style={{ width: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>from: <Link href={`/address/${item._source?.from}`}>{item._source?.from}</Link></Box>
                                <Box style={{ width: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>to: <Link href={`/address/${item._source?.to}`}>{item._source?.to}</Link></Box>
                            </TableCell>
                            <TableCell>{weiToEth(item._source?.value)} eth</TableCell>
                            <TableCell>{ETxType[item._source?.type]}</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow><TableCell><Link href={'/txs'}>查看全部</Link></TableCell></TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    </>
}
export default LastTx