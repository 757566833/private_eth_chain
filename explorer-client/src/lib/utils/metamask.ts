import Provider from "@/pc/instance/provider";
import {TransactionRequest} from "@ethersproject/abstract-provider/src.ts/index";
import {bnToWei} from "@/pc/utils/eth";

export const switchMetamaskChain =async (chainId: string,config:{chainId:string,chainName:string,rpcUrls:string[]}) =>{
    const ethereum = (window as any).ethereum
    if(ethereum){
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId}],
            });
        } catch (switchError: any) {
            console.log('switch error',switchError.message)
            // This error code indicates that the chain has not been added to MetaMask.
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        config,
                    ],
                });
            } catch (addError:any) {
                console.log('add error')
                throw Error(`添加失败${addError.toString()}`)
            }
        }
    }else{
        throw Error(`not install metamask`)
    }

}
// https://docs.metamask.io/guide/sending-transactions.html
export interface ISendTransactionRequest {
    nonce: string, // ignored by MetaMask
  gasPrice: string, // customizable by user during MetaMask confirmation.
  gas: string, // customizable by user during MetaMask confirmation.
  to: string, // Required except during contract publications.
  from:string, // must match user's active address.
  value: string, // Only required to send ether to the recipient from the initiating external account.
  data:string, // Optional, but used for defining smart contract creation and interaction.
  chainId: string, // Used to prevent transaction reuse across blockchains. Auto
}
export const sendTransaction = async (request:Partial<ISendTransactionRequest>)=>{
    // const transactionParameters = {
    //     gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
    //     gas: '0x2710', // customizable by user during MetaMask confirmation.
    //     to: '0x0000000000000000000000000000000000000000', // Required except during contract publications.
    //     from: ethereum.selectedAddress, // must match user's active address.
    //     value: '0x00', // Only required to send ether to the recipient from the initiating external account.
    //     data:
    //         '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
    //     chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    // };

// txHash is a hex string
// As with any RPC call, it may throw an error
    const ethereum = (window as any).ethereum
    if(ethereum){
        try {
            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [request],
            });
            return txHash
        } catch (error) {
            return 
        }
       
    }

}

