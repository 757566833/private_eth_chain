import React, { useCallback, useEffect, useState } from 'react'
import {Box, List, ListItem, ListItemText, Typography,Divider} from "@mui/material"
import { useRouter } from 'next/router'
import { IBlock } from '@/services/interface';
import { timeRender } from '@/lib/time';
import { useClintNavigation } from '@/hooks/navigation';
import Link from 'next/link';

const Block:React.FC = ()=>{
    const router = useRouter();
    const [navigation] = useClintNavigation();
    const {query} = router
    const {block} = query
    const [data,setData] = useState<Partial<IBlock>>({})
    const func = useCallback(async(block:string)=>{
        const res = await fetch(`http://127.0.0.1:9090/block/${block}`)
        const response: IBlock = await res.json()
        setData(response)
    },[])
    useEffect(()=>{
        if(block){
            func(block.toString())
        }
    },[block])
    return <Box>
        <Typography variant="h5" fontWeight={'bold'}>
            block#{block}
        </Typography>
        <List>
            <ListItem>
                <ListItemText primary='number 块高度'/>
                <ListItemText primary={data._source?.number}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='timestamp'/>
                <ListItemText primary={timeRender(data._source?.timestamp)}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='_txns 交易数量'/>
                <ListItemText  primary={<Link href={`/txs?block=${block}`}>{data._source?.txns||''}</Link>}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='difficulty'/>
                <ListItemText primary={data._source?.difficulty}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='gasUsed'/>
                <ListItemText primary={data._source?.gasUsed}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='baseFeePerGas'/>
                <ListItemText primary={data._source?.baseFeePerGas}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='extraData'/>
                <ListItemText primary={data._source?.extraData}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='transactionsRoot'/>
                <ListItemText primary={data._source?.transactionsRoot}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='parentHash'/>
                <ListItemText primary={data._source?.parentHash}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='sha3Uncles'/>
                <ListItemText primary={data._source?.sha3Uncles}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='nonce'/>
                <ListItemText primary={data._source?.nonce}/>
            </ListItem>
            <Divider />
        </List>
    </Box>
}
export default Block;