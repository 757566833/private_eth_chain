import React, { useCallback, useEffect, useState } from 'react'
import { Box, List, ListItem, ListItemText, Typography, Divider, Paper, ListItemIcon, ListItemAvatar, Button } from "@mui/material"
import { useRouter } from 'next/router'
import { IBlock } from '@/services/interface';
import { timeRender } from '@/lib/time';
import { useClintNavigation } from '@/hooks/navigation';
import Link from 'next/link';
import modal from '@/lib/modal';

const Block: React.FC = () => {
    const router = useRouter();
    const { query } = router
    const { block } = query
    const [data, setData] = useState<Partial<IBlock>>({})
    const func = useCallback(async (block: string) => {
        const res = await fetch(`http://127.0.0.1:9090/block/${block}`)
        const response: IBlock = await res.json()
        setData(response)
    }, [])
    useEffect(() => {
        if (block) {
            func(block.toString())
        }
    }, [block])
    return <Box width={1400} margin='0 auto'>
        <Typography variant="h5" fontWeight={'bold'}>
            block#{block}
        </Typography>
        <Paper variant='outlined'>
            <List>
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        number 块高度
                    </ListItemIcon>
                    <ListItemText primary={data._source?.number} />
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
                        _txns 交易数量
                    </ListItemIcon>

                    <ListItemText primary={<Link href={`/txs?block=${block}`}>{data._source?.txns || ''}</Link>} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        difficulty
                    </ListItemIcon>

                    <ListItemText primary={data._source?.difficulty} />
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
                    gasLimit
                    </ListItemIcon>
                    <ListItemText primary={data._source?.gasLimit} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        baseFeePerGas
                    </ListItemIcon>
                    <ListItemText primary={data._source?.baseFeePerGas} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        extraData
                    </ListItemIcon>
                    <ListItemText primary={<Box onClick={() => modal.info({ title: '详情', content: data._source?.extraData })}>查看详情</Box>} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        transactionsRoot
                    </ListItemIcon>

                    <ListItemText primary={data._source?.transactionsRoot} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        parentHash
                    </ListItemIcon>

                    <ListItemText primary={data._source?.parentHash} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        sha3Uncles
                    </ListItemIcon>

                    <ListItemText primary={data._source?.sha3Uncles} />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon sx={{ width: 280 }}>
                        nonce
                    </ListItemIcon>

                    <ListItemText primary={data._source?.nonce} />
                </ListItem>
            </List>
        </Paper>
    </Box>
}
export default Block;