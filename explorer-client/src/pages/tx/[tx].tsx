import React, { useCallback, useEffect, useState } from 'react'
import { Box, List, ListItem, ListItemText, Typography, Divider, Paper, ListItemIcon } from "@mui/material"
import { useRouter } from 'next/router'
import { ITx } from '@/services/interface';
import { timeRender } from '@/lib/time';
import { weiToEth, weiToGwei } from '@/lib/utils/eth';
import { ETxStatus, ETxType } from '@/constant/enum';
import Link from 'next/link';

const Block: React.FC = () => {
    const router = useRouter();
    const { query } = router
    const { tx } = query
    const [data, setData] = useState<Partial<ITx>>({})
    const func = useCallback(async (tx: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_RESTFUL}/tx/${tx}`)
        const response: ITx = await res.json()
        setData(response)
    }, [])
    useEffect(() => {
        if (tx) {
            func(tx.toString())
        }

    }, [func, tx])
    return <Box width={1400} margin='0 auto'>
        <Typography color={theme => theme.palette.text.primary} variant="h5" fontWeight={'bold'} padding={3}>
            tx
        </Typography>
        <Paper variant='outlined'>
            <List>
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        hash 交易hash
                    </ListItemIcon>
                    <ListItemText primary={data._source?.hash} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        number 所在块
                    </ListItemIcon>
                    <ListItemText primary={<Link href={`/block/${data._source?.number}`}>{data._source?.number||''}</Link>} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        blockHash
                    </ListItemIcon>
                    <ListItemText primary={data._source?.blockHash} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        timestamp
                    </ListItemIcon>
                    <ListItemText primary={timeRender(data._source?.timestamp)} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                    status
                    </ListItemIcon>
                    <ListItemText primary={data._source?.status!=undefined?ETxStatus[data._source?.status]:''} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        from 发出方
                    </ListItemIcon>
                    <ListItemText primary={data._source?.from} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        to 
                    </ListItemIcon>
                    <ListItemText primary={data._source?.to} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                    contractAddress 
                    </ListItemIcon>
                    <ListItemText primary={data._source?.contractAddress} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        value
                    </ListItemIcon>
                    <ListItemText primary={`${weiToEth(data._source?.value)} eth`} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        gas price
                    </ListItemIcon>
                    <ListItemText primary={`${weiToGwei(data._source?.gasPrice)} gwei`} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        gas limit 
                    </ListItemIcon>
                    <ListItemText primary={data._source?.gas +` 发出的limit，实际可能并未消耗这么多，兼容性大坑`} />
                </ListItem>
                <Divider />
                
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                    gasUsed
                    </ListItemIcon>
                    <ListItemText primary={data._source?.gasUsed} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                    cumulativeGasUsed
                    </ListItemIcon>
                    <ListItemText primary={data._source?.cumulativeGasUsed} />
                </ListItem>
                <Divider />
                
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        maxFeePerGas
                    </ListItemIcon>
                    <ListItemText primary={data._source?.maxFeePerGas+` 兼容性大坑`} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        maxPriorityFeePerGas
                    </ListItemIcon>
                    <ListItemText primary={data._source?.maxPriorityFeePerGas+` 兼容性大坑`} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        nonce
                    </ListItemIcon>
                    <ListItemText primary={data._source?.nonce} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        r
                    </ListItemIcon>
                    <ListItemText primary={data._source?.r} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        s
                    </ListItemIcon>
                    <ListItemText primary={data._source?.s} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        v
                    </ListItemIcon>
                    <ListItemText primary={data._source?.v} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        type
                    </ListItemIcon>
                    <ListItemText primary={data._source?.type != undefined ? ETxType[data._source?.type] : ''} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        input
                    </ListItemIcon>
                    <ListItemText primary={data._source?.input} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        isFake
                    </ListItemIcon>
                    <ListItemText primary={`${data._source?.isFake}`} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                    transactionIndex
                    </ListItemIcon>
                    <ListItemText primary={`${data._source?.transactionIndex}`} />
                </ListItem>
            </List>
        </Paper>
    </Box>
}
export default Block;