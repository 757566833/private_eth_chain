import React, { useEffect, useState, useCallback } from 'react'
import { Box, Button, TableFooter, Grid, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import { IResponseList, ITx } from "@/services/interface";
import { timeRender } from "@/lib/time";
import { weiToEth, weiToGwei } from '@/lib/utils/eth';
import { useClintNavigation } from '@/hooks/navigation';
import Link from 'next/link';
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
                        <TableCell>number</TableCell>
                        <TableCell>timestamp</TableCell>
                        <TableCell>gasPrice(gwei)</TableCell>
                        <TableCell>limit</TableCell>
                        <TableCell>to</TableCell>

                        <TableCell>value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item: ITx) => (
                        <TableRow
                            key={item._source?.hash}
                        >
                            <TableCell><Box style={{ width: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><Link href={`/tx/${item._source?.hash}`}>{item._source?.hash}</Link></Box></TableCell>
                            <TableCell>{item._source?.number}</TableCell>
                            <TableCell>{timeRender(item._source?.timestamp)}</TableCell>
                            <TableCell>{weiToGwei(item._source?.gasPrice)}</TableCell>
                            <TableCell>{item._source.gas}</TableCell>
                            <TableCell><Box style={{ width: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><Link href={`/address/${item._source?.to}`}>{item._source?.to}</Link></Box></TableCell>
                            <TableCell>{weiToEth(item._source?.value)}</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <Box flex={1}></Box>
                    <TableRow>
                        <Button onClick={handleAll}>查看全部</Button>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    </>
}
export default LastTx