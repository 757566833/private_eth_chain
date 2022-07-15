import fs from "fs";
import keythereum from 'keythereum';
import * as bip39 from 'bip39';
import * as ethers from 'ethers';
import { bufferToHex, toBuffer } from 'ethereumjs-util';
const DERIVE_PATH_PREFIX = 'm/44\'/60\'/0\'/0/';
export class utils {
    public static getPrivateKey(KEYSTORE: string, PASSWORD_FILE: string) {
        for (const file of fs.readdirSync(KEYSTORE)) {
            const keyObject = JSON.parse(fs.readFileSync(KEYSTORE + "/" + file, "utf8"));
            const publicAddr = keyObject.address;
            //@ts-ignore
            const privateKey = keythereum.recover(fs.readFileSync(PASSWORD_FILE), keyObject).toString("hex");
            console.log(`address  :  0x${publicAddr}`);
            console.log(`privateKey :  0x${privateKey}`);
        }
    }
    public static getPrivateKeyAndCreateFile(KEYSTORE: string, PASSWORD_FILE: string) {
        const json: { privateKey: string, address: string }[] = []
        for (const file of fs.readdirSync(KEYSTORE)) {
            const keyObject = JSON.parse(fs.readFileSync(KEYSTORE + "/" + file, "utf8"));
            const publicAddr = keyObject.address;
            //@ts-ignore
            const privateKey = keythereum.recover(fs.readFileSync(PASSWORD_FILE), keyObject).toString("hex");
            let _key = privateKey;
            if (!_key.startsWith('0x')) {
                _key = `0x${_key}`;
            }
            const address = ethers.utils.computeAddress(_key);
            console.log(`address  :  ${address}`);
            console.log(`privateKey :  0x${privateKey}`);
            json.push({
                address: address,
                privateKey: `0x${privateKey}`
            })
        }
        fs.writeFileSync('./miner.json', JSON.stringify(json))
    }

    public static generateMnemonic() {
        const mnemonic = bip39.generateMnemonic();
        console.log(`mnemonic: ${mnemonic}`)
        return mnemonic;
    }
    public static async mnemonicToSeed(mnemonic: string) {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const str = bufferToHex(seed)
        console.log(`seed: ${str}`)
        return str;
    }
    public static async createPrivateKeyAndPublicKeyAndAddressBySeed(seed: string, length: number = 20, derive_path_prefix: string = DERIVE_PATH_PREFIX) {
        const json: { privateKey: string, publicKey: string, address: string }[] = []
        const hdWallet = ethers.utils.HDNode.fromSeed(toBuffer(seed));
        for (let index = 0; index < length; index++) {
            const key = hdWallet.derivePath(derive_path_prefix + index);
            const { privateKey, publicKey, address } = key;
            json.push({ privateKey, publicKey, address })
            console.log(`privateKey: ${privateKey}`)
            console.log(`publicKey: ${publicKey}`)
            console.log(`address: ${address}`)
        }
        return json;
    }

    public static async createKeys(mnemonic?: string) {
        let _mnemonic = mnemonic || bip39.generateMnemonic();
        const seed = await bip39.mnemonicToSeed(_mnemonic);
        const json: { privateKey: string, publicKey: string, address: string }[] = []
        const hdWallet = ethers.utils.HDNode.fromSeed(seed);
        for (let index = 0; index < 20; index++) {
            const key = hdWallet.derivePath(DERIVE_PATH_PREFIX + index);
            const { privateKey, publicKey, address } = key;
            json.push({ privateKey, publicKey, address })
        }
        fs.writeFileSync('./key.json', JSON.stringify(json))
        return json;
    }
}
export default utils;
