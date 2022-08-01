import {ethers} from "ethers";
import {ACCOUNTS_CHANGED, CHAIN_CHANGED, ETH_REQUEST_ACCOUNTS} from "@/constant";

export  class  Provider {
    private static provider:ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC);
    /**
     * 这里直接吞了error 没有返回就是错误了
     */
    public static getInstance =async ()=>{
        return  Provider.provider;
    }

}
export default Provider;
