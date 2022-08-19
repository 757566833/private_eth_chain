const utils = require ('./utils')

// 通过aes获取私钥
// utils.getPrivateKey('./chain/account/keystore','./chain/password')
// 通过aes获取私钥 并生成文件
utils.getPrivateKeyAndCreateFile('./chain/account/keystore','./chain/password')
// 通过助记词生成种子从而生成账户
utils.createKeys("test test test test test test test test test test test junk")
// 随机生成助记词
// console.log(utils.generateMnemonic())


