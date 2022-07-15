import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Box, AppBar, Toolbar, Grid, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, List, ListItem, ListItemAvatar, Avatar, ListItemText, TableFooter, Button } from '@mui/material'
import { IBlock, IResponseList } from "@/services/interface";
import { timeRender } from "@/lib/time";
import { useClintNavigation } from '@/hooks/navigation';
const LastBlock: React.FC = () => {
    const [navigation] = useClintNavigation();
    const [data, setData] = useState<IBlock[]>([])
    const func1 = useCallback(async () => {
        const res = await fetch('http://127.0.0.1:9090/blocks?size=10')
        const response: IResponseList<IBlock> = await res.json()
        const hits = response.hits.hits
        const nextData: IBlock[] = []
        for (const iterator of hits) {
            nextData.push(iterator)
        }
        setData(nextData)
    }, [])
    const handleAll = useCallback(() => {
        navigation.push('/blocks')
    }, [])
    useEffect(() => {
        func1()
    }, [])
    return <>
        <Typography variant="h6" fontWeight={'bold'}>
            最近区块
        </Typography>
        <Typography variant="body1">
            最近开采的区块
        </Typography>
        <TableContainer component={Paper} elevation={0} variant='outlined'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>高度</TableCell>
                        <TableCell>gasLimit</TableCell>
                        <TableCell>gasUsed</TableCell>
                        <TableCell>出块时间</TableCell>
                        <TableCell>交易数</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item: IBlock) => (
                        <TableRow
                            key={item._source?.number}

                        >
                            <TableCell><Link href={`/block/${item._source?.number}`}>{item._source?.number}</Link></TableCell>
                            <TableCell>{item._source?.gasLimit}</TableCell>
                            <TableCell>{item._source?.gasUsed}</TableCell>
                            <TableCell>{timeRender(item._source?.timestamp)}</TableCell>
                            <TableCell>{item._source?.txns}</TableCell>

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
export default LastBlock