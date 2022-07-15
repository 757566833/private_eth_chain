import React, { useCallback, useEffect, useState } from 'react'
import {Box, List, ListItem, ListItemText, Typography,Divider} from "@mui/material"
import { useRouter } from 'next/router'
import { ITx } from '@/services/interface';
import { timeRender } from '@/lib/time';
import { weiToEth } from '@/lib/utils/eth';
import { ETxType } from '@/constant/enum';

const Block:React.FC = ()=>{
    const router = useRouter();
    const {query} = router
    const {tx} = query
    const [data,setData] = useState<Partial<ITx>>({})
    const func = useCallback(async(tx:string)=>{
        const res = await fetch(`http://127.0.0.1:9090/tx/${tx}`)
        const response: ITx = await res.json()
        setData(response)
    },[])
    useEffect(()=>{
        if(tx){
            func(tx.toString())
        }
      
    },[tx])
    return <Box>
        <Typography variant="h5" fontWeight={'bold'}>
            tx#{tx}
        </Typography>
        <List>
            <ListItem>
                <ListItemText primary='hash 交易hash'/>
                <ListItemText primary={data._source?.hash}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='number 所在块'/>
                <ListItemText primary={data._source?.number}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='timestamp'/>
                <ListItemText primary={timeRender(data._source?.timestamp)}/>
            </ListItem>
            <Divider />
           
            <ListItem>
                <ListItemText primary='to 接收方'/>
                <ListItemText primary={data._source?.to}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='value 价值'/>
                <ListItemText primary={weiToEth(data._source?.value)}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='gas limit'/>
                <ListItemText primary={data._source?.gas}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='maxFeePerGas'/>
                <ListItemText primary={data._source?.maxFeePerGas}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='maxPriorityFeePerGas'/>
                <ListItemText primary={data._source?.maxPriorityFeePerGas}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='nonce'/>
                <ListItemText primary={data._source?.nonce}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='r'/>
                <ListItemText primary={data._source?.r}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='s'/>
                <ListItemText primary={data._source?.s}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='v'/>
                <ListItemText primary={data._source?.v}/>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary='type'/>
                <ListItemText primary={data._source?.type!=undefined?ETxType[data._source?.type]:''}/>
            </ListItem>
            <Divider />
        </List>
    </Box>
}
export default Block;