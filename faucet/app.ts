import  Koa  from 'koa';
import fs  from 'fs';
import bodyParser  from 'koa-bodyparser';
import {ethers} from 'ethers'
const html = fs.readFileSync('./index.html',{encoding:'utf-8'})
const minersStr = fs.readFileSync('./miner.json',{encoding:'utf-8'})
const miners = JSON.parse(minersStr);
const miner = miners[0]
const from = miner.address;
const privateKey = miner.privateKey
const app = new Koa();
const provider = new ethers.providers.JsonRpcProvider('http://192.168.246.22:8545');
const wallet = new ethers.Wallet(privateKey,provider);
app.use(bodyParser());
app.use(async ctx => {
    const {path} = ctx
    if(path.startsWith('/send/')){
      
       const [a,b,address] = path.split('/');
       const tx = await wallet.sendTransaction({
        from:from,
        gasLimit:210000,
        gasPrice:200,
        to:address,
        value: ethers.utils.parseEther('2').toHexString(),
      });

       return JSON.stringify(tx)
    }
  ctx.body = html;
});

app.listen(9090);