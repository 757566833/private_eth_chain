import {ethers} from "ethers";

export const numToHex = (num?:number)=>{
    if(num==undefined||num==null){
        return
    }
    if(isNaN(num)){
        return
    }
    return `0x${num.toString(16)}`
}
export const strToHex = (str?:string)=>{
    if(str){
        return  ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));
    }
}
