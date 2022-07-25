import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,  TableFooter } from '@mui/material'
import { IBlock, IResponseList } from "@/services/interface";
import { timeRender } from "@/lib/time";
const LastBlock: React.FC = () => {
    const [data, setData] = useState<IBlock[]>([])
    const func1 = useCallback(async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_RESTFUL}/blocks?size=10`)
        const response: IResponseList<IBlock> = await res.json()
        const hits = response.hits.hits
        const nextData: IBlock[] = []
        for (const iterator of hits) {
            nextData.push(iterator)
        }
        setData(nextData)
    }, [])
    useEffect(() => {
        func1()
    }, [func1])
    return <>
        <Typography color={theme => theme.palette.text.primary} variant="h6" fontWeight={'bold'}>
            最近区块
        </Typography>
        <Typography color={theme => theme.palette.text.primary} variant="body1">
            最近开采的区块
        </Typography>
        <TableContainer component={Paper} elevation={0} variant='outlined'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>高度</TableCell>
                        <TableCell>gas</TableCell>
                        <TableCell>出块时间</TableCell>
                        <TableCell>交易数</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item: IBlock) => (
                        <TableRow
                            key={item._source?.number}
                        >
                            <TableCell><Link href={`/block/${item._source?.number}`}>{item._source?.number||''}</Link></TableCell>
                            <TableCell>
                                <Box>gasLimit: {item._source?.gasLimit}</Box>
                                <Box>gasUsed: {item._source?.gasUsed}</Box>
                            </TableCell>
                            <TableCell>{timeRender(item._source?.timestamp)}</TableCell>
                            <TableCell><Link href={`/txs?block=${item._source?.number}`}>{item._source?.txns||'0'}</Link></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow><TableCell><Link href={'/blocks?page=1&size=10'}>查看全部</Link></TableCell></TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    </>
}
export default LastBlock