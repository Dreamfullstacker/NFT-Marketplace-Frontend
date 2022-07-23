import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Web3 from "web3";
import {ethers} from 'ethers';
import { accountSave, contractABIFromAddress, mintDataSave } from "../action/account.action";
import { errorOccured, successOccured } from '../action/error.action';
import env from '../env.json';
const web3 = new Web3(new Web3.providers.HttpProvider(env.API_KEY));

function Home() {
    const user = useSelector(state => state.auth.user);
    const accounts = useSelector(state => state.account.accountList);
    const contractABI = useSelector(state => state.account.contractABI);
    const contractFunction = useSelector(state => state.account.contractFunction);

    const [gasPriceAuto, SetGasPriceAuto] = useState(true);
    const [gasPrice, SetGasPrice] = useState(30);
    const [gasLimitAuto, SetGasLimitAuto] = useState(true);
    const [gasLimit, SetGasLimit] = useState(30000);
    const [tokenPrice, SetTokenPrice] = useState(0);
    const [tokenAmount, SetTokenAmount] = useState(0);

    const [sendDate, SetSendDate] = useState('2022-7-15');
    const [sendTime, SetSendTime] = useState('00:00:00');
    const [privateKey, SetPrivateKey] = useState('0x');
    const [contractAddress, SetContractAddress] = useState('0x');
    const [mintFunction, SetMintFunction] = useState('mint');

    const dispatch = useDispatch();

    useEffect(() => {
        let now = new Date();
        let year = now.getFullYear();
        let month = (now.getMonth()+1) > 9 ? (now.getMonth()+1) : '0' + (now.getMonth()+1).toString();
        let day = now.getDate() > 9 ? now.getDate() : '0' + now.getDate().toString();
        let hour =  now.getHours() > 9 ? now.getHours() : '0' + now.getHours().toString();
        let minute =  now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes().toString();
        let second =  now.getSeconds() > 9 ? now.getSeconds() : '0' + now.getSeconds().toString();
        let sendDate = `${year}-${month}-${day}`;
        let sendTime = `${hour}:${minute}:${second}`;
        SetSendDate(sendDate);
        SetSendTime(sendTime);
    }, [])

    const onSetGasPrice = (e) => {
        try {
          let gasPrice = e.target.value;
          SetGasPrice(gasPrice);
        }
        catch(err) {dispatch(errorOccured(err))}
    }

    const onSetGasLimit = (e) => {
        try {
            let gasLimit = Number(e.target.value);
            SetGasLimit(gasLimit);
        }
        catch(err) {dispatch(errorOccured(err))}
    }
    
    const onCreateWallet = (e) => {
        let newAccount = web3.eth.accounts.create();
        let data = {_id: user._id, privateKey: newAccount.privateKey};
        dispatch(accountSave(data));
    }

    const onAccountAddressChange = (e) => {
        try {
            let currentAddress = e.target.value;
            if(currentAddress.includes('0x') && currentAddress!=='0x') {
                for(let i=0;i<accounts.length;i++) {
                    let privateKey = accounts[i];
                    let account = web3.eth.accounts.privateKeyToAccount(privateKey);
                    if(account.address === currentAddress) {
                        SetPrivateKey(privateKey);
                        let provider = new ethers.providers.WebSocketProvider(env.WSS_KEY);
                        let wallet = new ethers.Wallet(privateKey, provider);
                        wallet.connect(provider);
                    }
                }
            }
        }
        catch(err) {dispatch(errorOccured(err))}
    }

    const onSearchABIFromAddress = () => {
        dispatch(contractABIFromAddress({address: contractAddress}));
    } 

    const onSetTokenPrice = async (e) => {
        try {
            SetTokenPrice(e.target.value);
            const gasPrice = await web3.eth.getGasPrice();
            SetGasPrice(gasPrice/Math.pow(10,9))
        }
        catch(err) {dispatch(errorOccured(err))}
    }

    const onSetTokenAmount = async (e) => {
        try {
            SetTokenAmount(e.target.value);  
            const gasPrice = await web3.eth.getGasPrice();
            SetGasPrice(gasPrice/Math.pow(10,9))
        }
        catch(err) {dispatch(errorOccured(err))}
    }

    const onMintNFT = async () => {
        try {
            let account = web3.eth.accounts.privateKeyToAccount(privateKey);
            let publicKey = account.address;
            const nonce = await web3.eth.getTransactionCount(publicKey, 'latest'); 
            let NFTContract = new web3.eth.Contract(contractABI, contractAddress, account);
           
             //the transaction
            const tx = {
                'from': publicKey,
                'to': contractAddress,
                'nonce': nonce,
                'gas': gasLimit,
                'maxPriorityFeePerGas': parseInt(gasPrice*Math.pow(10,9)),
                'data': NFTContract.methods[mintFunction](Number(tokenAmount)).encodeABI()
            };
            const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
            signPromise.then((signedTx) => {
                let time = new Date(sendDate+' '+sendTime);
                let now = new Date();
                if(Math.abs(time-now) > 60*1000) { // 1 minute
                    let data = {_id: user._id, account: account.address, time, rawTransaction: signedTx.rawTransaction};
                    dispatch(mintDataSave(data));
                }
                else {
                    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
                        if (!err) {
                            dispatch(successOccured("The hash of your transaction is: \n"+ hash+"\nCheck etherscan's Mempool to view the status of your transaction!")); 
                        } else {
                            dispatch(errorOccured("Something went wrong when submitting your transaction.\n"+err));
                        }
                    });
                }
            }).catch((err) => {
                console.log("Promise failed:"+err);
            });
        }
        catch(err) {dispatch(errorOccured(err))}
    }

    return (
        <div class="body-padding">
            <div bg="dark" variant="light">
            <Container>
                <div class="top-text-group">
                    <div class="d-flex justify-content-left">
                    <div class="text-white px-3 pt-4 h1 flex-grow-1 font-bold-poppins">Win NFT Trading</div>
                        <div class='text-white pt-4 h4 text-end '>
                            {user ? <button type="button" class="btn btn-success rounded-pill create-button" onClick={onCreateWallet}> Create Wallet</button> : null}
                        </div>
                    </div>
                    <div class='text-white px-3 h6 text-start '>
                        High-performance network for the fastest NFT trading
                    </div>
                </div>
                <div class="account-address-group">
                    <div class='text-white px-3 spacing-medium h5 text-start'>
                        <div class="font-bold-poppins"><strong>Account Address</strong></div>
                        <div class="horizontal-spliter"></div>
                        <div>Select Account Address</div>
                    </div>
                    <div class='account-address-box mx-3 d-flex'>
                        <select class="select-account-address" onChange={onAccountAddressChange}>
                            <option>Account Address</option>
                            {
                                accounts.length > 0 ? accounts.map((value, key) => {
                                    let account = web3.eth.accounts.privateKeyToAccount(value);
                                    return <option key={key} value={account.address}>{account.address}</option>
                                    })
                                : null
                            }
                        </select>
                        {/* <div class='text-white px-3 h4 text-end d-inline'>
                            {user ? <button type="button" class="btn btn-primary rounded-pill connect-button" onClick={onConnectWallet}> Connect Wallet</button> : null}
                        </div> */}
                    </div>
                </div>
                <div class="nft-address-group">
                    <div class='text-white px-3 spacing-medium h5 text-start'>
                        <div class="font-bold-poppins"><strong>NFT Minting</strong></div>
                        <div class="horizontal-spliter"></div>
                        <div>NFT Contract Address</div>
                    </div>
                    <div class='nft-address-box mx-3'>
                        <input type="text" value={contractAddress} onChange={e => SetContractAddress(e.target.value)}></input>
                        <button class="nft-address-search" onClick={onSearchABIFromAddress}>
                            <img alt="IMG" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAAqlJREFUSEu11VvI5WMUx/HPzzGHHJJyCk1JDhnTJIeEGMSFGUrhjnI1KcWFphCRJKNwoSSEcEUoFCWnK6dokENqhIwkxZXD0tr+e7fnnb3n9b4zflf/f8/zrO9zWGv9YhFV1T44HUfjcPyN7/EePknS/9tV5o1W1XG4CZdjrznzNuMhPJDkt3mxtoFU1S64bQDshl78au8aW1DDqc7CaegY3+GqJG/OAm0Fqaq98TQuGYLfg43zdllVJ+AOrMMfWJ/k4YWgCaSq+vspXIkvsDbJ54vdd49X1bV4ELv3+iTPTq+bhqwfJn6L1Ul++i+A8Zyq6rfr4L/j+CQdZ6QRpKr2x1c4EKck+XApgClQX++NeDTJNQshnUV34bEkVy8HMLXZr3EAViTp7JucpHd+Mk5K0lm0bFXVfbgeNyTZOIJU1X74pdMwyZHLjj4srKrz8BqeT3LpGLISH+GVJBftBMjBQz19nKRjj05yJt7CM0k6fXdIVdUF3DWzOclRY8gqfIDXk6zZIcK/mXoIfsCmJCeOIZ0J/SbfJFmxEyBn4w28mKQ7xyS7NnUB4ZgkXS/LVlV1KXRJbEjS3xNIN8RbcG+SLqZlqar2GIr6CByb5MtpSGdEn6AnrUzSvWvJqqoNuBPPJblsHGC6d40nfIozkvy6FEpVnY+X8SdWJflsFmTXfix0rbTrrUvSPrGoqmotnsS+3fqT3Dy9aKGfdKNsgzoVP+JWPJKkd7eNqurQYU63+ja71s9Yk6QLfKRZztjGdT+6i/Z4w17C+4O3t+cf1oFwDvZEX+11uBhXLARtz+NX43ZcgK7iWepdP467k2ypqr7yvratQHMh44hV1R5zYXdoHIS/0Ib0Lt5O0v8TzQCduyhk0Vef/VZ9oicGK3/hf4E0dzhRW/o7/wAhev8jjnsFqAAAAABJRU5ErkJggg=="></img>
                        </button>
                    </div>
                </div>
                <div class="mint-address-group w-50">
                    <div class='text-white px-3 spacing-medium h5 text-start'>
                        <div class="font-bold-poppins"><strong>Select Contract Mint Function</strong></div>
                    </div>
                    <div class='account-address-box mx-3'>
                        <select class="select-account-address w-100" onChange={e => SetMintFunction(e.target.value)}>
                            <option>Select Mint Function</option>
                            {
                                contractFunction ? contractFunction.map((value, key) => {
                                    return <option value={value.name} key={key}>{value.name}</option>
                                    })
                                : null
                            }
                        </select>
                    </div>
                    <div class="d-flex mt-20 mx-3">
                        <div class="px-2 d-inline-block w-30">
                            <div>
                                <span class="text-white p-0">Price</span>
                                <div class="d-flex bg-dark rounded-5">
                                    <input type="text" class="w-80" value={tokenPrice} onChange={onSetTokenPrice}/>
                                    <img alt="IMG" class="p-2" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAABWxJREFUSEu9lltsVEUYx/8z5+x2L2232+32BoaKAUKISDSGVEmMGInB+OCDhmgggYohBqIIAZFQT7dRCQYCQTEIbRUxNZgYTMQAD0ZQLhEKlXAplltL6PZCaffS3T1nz5kxM9tdzrYFH0ycp92ZOd/vfP/5vv8cgv9pkH/jLNZi5R5mvWLRdK3F+VOck6kEnICSbpWRdgJ6wqT0SLNWcuNhsR4IWr3ttjs67P6UgdVx8EKxkYCA80w4QoDMTy7nLcr2+o2i+u2feMMTAScErdSG548w/VuAVMugo09SSjAcZ6AAigoJOMssjLLBwUfc1LXiS823fyxsHGh56N4iI220EkJAcwhAQHoHLcyb44JDBY6dSyHopzmYCMwEChxOtWDNnnr/NjssD7ReSzwTtiInKKF5EMFL6RyJFEdLQxADQyY2fjEEhVB43LaURmGMMwSJ742tIU9rFpYDaRp3drH+uwy8SJHi3B9UIei4qeP9xaV4db4bnV0GDp9M4eipJMr9+XuzmVlgqKLFk7Zo3h67/Fha37eNc6ym4pTtECHZXRPVQRW768vkyum/UrIYvj8ygq6widJimiuS0VKByIpR/su+hsqXc6BVG2LBuCMpyOrYQ7MY0N2bxvZ1Qcye5oD4f/J8Ch43QVevhe8OxVHoJlCV8bUmzotazpqmj/1dMu479dG6BBJ7848/UwA37qSxcJ4Ha5b4cpHOXtYRiTJUBSl++i2JE+0pVJYpeYWRkZDBQ1ybdzWUbJCgt7ShZosZS0U/5AYBYgkGywK+DpWjyJtZG4oxnG5Pwe+j8HkJBiMMTQfjGEkxFHvyJRQZEaJcbG4oe1w+Xaf1dzCGGXmyEeD67TQ2vV2KF+a6EI0zhAdM3Lxj4tSFFAIlKmqqFcye7sTZy4aUsKSQgtpqQ/QXAeltDgWrZOyl9f1RAhTZVb47zFD7hAsfLPPhYqeBngFTdqaQU4DEutdNURVUMHuaE8fbkrh4LQ2vJ08X8UisJVRenAXFCFBoByVSDFOqnZgzw4Gpk1UJMa1MP526oEM3GBwqQTrNkdDFGsdwjMmM7MpwIN4SKi+Sc8s+6r/OOabaN6QMjskVDlld94YtKd+sx5wys+NtunwnXWe4GTZREVBlIYhGFvDsENJRkL6mULAyA9IGWzkzF9mTFqACJ8GHdX50dqXRejiGRyepeLHWjTOXDJy/oiNtcjz/tBvV5Sp+PpbASJLB6bCDJKqjJRScKWdXaJGVKZbcKYwnO6S32RpVVNfuH6K42mXAMoHKoIqFz7pRM0nFztYobvWYCJSM9T4GJyn4/KsG/6rMGW0cfASK1Z1nFaJ7FYK/uw0sqPVgQ12JfIc/zhk4fzWF5550odRH0XQwhjOX9HF9lL1CnFSdtVsLXM7luUTr2UctZbEw1PvGn/nV2Z3Gxjo/XponHBS4dM0AY0DbFR0//pqQFqSMsTzxHCPsz28aKufmJbBa46VDrH9QTNqvB+Fp8QRDJM7Q0liBygBF+1Ud4X4L+w/FwTiB1408rxONKlyhjHpnbtWKO8YqhXcbEq8NmZEDwv7thSEkvN1nYvoUB7avC6A7bGJz8zB6BiyUjbmTRCYWt+An3rU7QsVbs2c+wcU3uNZIpz8TLm6HieK4FU7jzYVFoAQ4cDSOioBiV1nKLCAFinPHHi3wnr0vJ7zKV2mRJTGWbCHSB0aH+EbgQHSEw6FwuF1UXhUiuu0qh4c61u/SSrfYIeOksy8u16LTLa43cs5fl+YoP0iINFkxFJGMJGQcDeBHVO7atKfRd2Ys5KGg7Oblm8KzQF2LGKwF4FYlA8neqRGA9BGC38Gwf29jsG0iwAPP6GGb/8vaPz7xWzmTz7d3AAAAAElFTkSuQmCC"/>
                                </div>
                            </div>
                        </div>
                        <div class="px-2 d-inline-block w-30">
                            <div>
                                <span class="text-white p-0">of Token</span>
                                <div class="d-flex bg-dark rounded-5">
                                    <input type="text" class="w-80" value={tokenAmount} onChange={onSetTokenAmount}/>
                                    <img alt="IMG"  class="p-2" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAABWxJREFUSEu9lltsVEUYx/8z5+x2L2232+32BoaKAUKISDSGVEmMGInB+OCDhmgggYohBqIIAZFQT7dRCQYCQTEIbRUxNZgYTMQAD0ZQLhEKlXAplltL6PZCaffS3T1nz5kxM9tdzrYFH0ycp92ZOd/vfP/5vv8cgv9pkH/jLNZi5R5mvWLRdK3F+VOck6kEnICSbpWRdgJ6wqT0SLNWcuNhsR4IWr3ttjs67P6UgdVx8EKxkYCA80w4QoDMTy7nLcr2+o2i+u2feMMTAScErdSG548w/VuAVMugo09SSjAcZ6AAigoJOMssjLLBwUfc1LXiS823fyxsHGh56N4iI220EkJAcwhAQHoHLcyb44JDBY6dSyHopzmYCMwEChxOtWDNnnr/NjssD7ReSzwTtiInKKF5EMFL6RyJFEdLQxADQyY2fjEEhVB43LaURmGMMwSJ742tIU9rFpYDaRp3drH+uwy8SJHi3B9UIei4qeP9xaV4db4bnV0GDp9M4eipJMr9+XuzmVlgqKLFk7Zo3h67/Fha37eNc6ym4pTtECHZXRPVQRW768vkyum/UrIYvj8ygq6widJimiuS0VKByIpR/su+hsqXc6BVG2LBuCMpyOrYQ7MY0N2bxvZ1Qcye5oD4f/J8Ch43QVevhe8OxVHoJlCV8bUmzotazpqmj/1dMu479dG6BBJ7848/UwA37qSxcJ4Ha5b4cpHOXtYRiTJUBSl++i2JE+0pVJYpeYWRkZDBQ1ybdzWUbJCgt7ShZosZS0U/5AYBYgkGywK+DpWjyJtZG4oxnG5Pwe+j8HkJBiMMTQfjGEkxFHvyJRQZEaJcbG4oe1w+Xaf1dzCGGXmyEeD67TQ2vV2KF+a6EI0zhAdM3Lxj4tSFFAIlKmqqFcye7sTZy4aUsKSQgtpqQ/QXAeltDgWrZOyl9f1RAhTZVb47zFD7hAsfLPPhYqeBngFTdqaQU4DEutdNURVUMHuaE8fbkrh4LQ2vJ08X8UisJVRenAXFCFBoByVSDFOqnZgzw4Gpk1UJMa1MP526oEM3GBwqQTrNkdDFGsdwjMmM7MpwIN4SKi+Sc8s+6r/OOabaN6QMjskVDlld94YtKd+sx5wys+NtunwnXWe4GTZREVBlIYhGFvDsENJRkL6mULAyA9IGWzkzF9mTFqACJ8GHdX50dqXRejiGRyepeLHWjTOXDJy/oiNtcjz/tBvV5Sp+PpbASJLB6bCDJKqjJRScKWdXaJGVKZbcKYwnO6S32RpVVNfuH6K42mXAMoHKoIqFz7pRM0nFztYobvWYCJSM9T4GJyn4/KsG/6rMGW0cfASK1Z1nFaJ7FYK/uw0sqPVgQ12JfIc/zhk4fzWF5550odRH0XQwhjOX9HF9lL1CnFSdtVsLXM7luUTr2UctZbEw1PvGn/nV2Z3Gxjo/XponHBS4dM0AY0DbFR0//pqQFqSMsTzxHCPsz28aKufmJbBa46VDrH9QTNqvB+Fp8QRDJM7Q0liBygBF+1Ud4X4L+w/FwTiB1408rxONKlyhjHpnbtWKO8YqhXcbEq8NmZEDwv7thSEkvN1nYvoUB7avC6A7bGJz8zB6BiyUjbmTRCYWt+An3rU7QsVbs2c+wcU3uNZIpz8TLm6HieK4FU7jzYVFoAQ4cDSOioBiV1nKLCAFinPHHi3wnr0vJ7zKV2mRJTGWbCHSB0aH+EbgQHSEw6FwuF1UXhUiuu0qh4c61u/SSrfYIeOksy8u16LTLa43cs5fl+YoP0iINFkxFJGMJGQcDeBHVO7atKfRd2Ys5KGg7Oblm8KzQF2LGKwF4FYlA8neqRGA9BGC38Gwf29jsG0iwAPP6GGb/8vaPz7xWzmTz7d3AAAAAElFTkSuQmCC"/>
                                </div>
                            </div>
                        </div>
                        <div class="px-2 d-inline-block w-30">
                            <div>
                                <span class="text-white p-0">Total Price</span>
                                <div class="d-flex rounded-5">
                                    <input type="text" class="w-80 black-back text-right" disabled={true} value={tokenAmount*tokenPrice} onChange={()=>{}}></input>
                                    <img alt="IMG"  class="p-2" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAABWxJREFUSEu9lltsVEUYx/8z5+x2L2232+32BoaKAUKISDSGVEmMGInB+OCDhmgggYohBqIIAZFQT7dRCQYCQTEIbRUxNZgYTMQAD0ZQLhEKlXAplltL6PZCaffS3T1nz5kxM9tdzrYFH0ycp92ZOd/vfP/5vv8cgv9pkH/jLNZi5R5mvWLRdK3F+VOck6kEnICSbpWRdgJ6wqT0SLNWcuNhsR4IWr3ttjs67P6UgdVx8EKxkYCA80w4QoDMTy7nLcr2+o2i+u2feMMTAScErdSG548w/VuAVMugo09SSjAcZ6AAigoJOMssjLLBwUfc1LXiS823fyxsHGh56N4iI220EkJAcwhAQHoHLcyb44JDBY6dSyHopzmYCMwEChxOtWDNnnr/NjssD7ReSzwTtiInKKF5EMFL6RyJFEdLQxADQyY2fjEEhVB43LaURmGMMwSJ742tIU9rFpYDaRp3drH+uwy8SJHi3B9UIei4qeP9xaV4db4bnV0GDp9M4eipJMr9+XuzmVlgqKLFk7Zo3h67/Fha37eNc6ym4pTtECHZXRPVQRW768vkyum/UrIYvj8ygq6widJimiuS0VKByIpR/su+hsqXc6BVG2LBuCMpyOrYQ7MY0N2bxvZ1Qcye5oD4f/J8Ch43QVevhe8OxVHoJlCV8bUmzotazpqmj/1dMu479dG6BBJ7848/UwA37qSxcJ4Ha5b4cpHOXtYRiTJUBSl++i2JE+0pVJYpeYWRkZDBQ1ybdzWUbJCgt7ShZosZS0U/5AYBYgkGywK+DpWjyJtZG4oxnG5Pwe+j8HkJBiMMTQfjGEkxFHvyJRQZEaJcbG4oe1w+Xaf1dzCGGXmyEeD67TQ2vV2KF+a6EI0zhAdM3Lxj4tSFFAIlKmqqFcye7sTZy4aUsKSQgtpqQ/QXAeltDgWrZOyl9f1RAhTZVb47zFD7hAsfLPPhYqeBngFTdqaQU4DEutdNURVUMHuaE8fbkrh4LQ2vJ08X8UisJVRenAXFCFBoByVSDFOqnZgzw4Gpk1UJMa1MP526oEM3GBwqQTrNkdDFGsdwjMmM7MpwIN4SKi+Sc8s+6r/OOabaN6QMjskVDlld94YtKd+sx5wys+NtunwnXWe4GTZREVBlIYhGFvDsENJRkL6mULAyA9IGWzkzF9mTFqACJ8GHdX50dqXRejiGRyepeLHWjTOXDJy/oiNtcjz/tBvV5Sp+PpbASJLB6bCDJKqjJRScKWdXaJGVKZbcKYwnO6S32RpVVNfuH6K42mXAMoHKoIqFz7pRM0nFztYobvWYCJSM9T4GJyn4/KsG/6rMGW0cfASK1Z1nFaJ7FYK/uw0sqPVgQ12JfIc/zhk4fzWF5550odRH0XQwhjOX9HF9lL1CnFSdtVsLXM7luUTr2UctZbEw1PvGn/nV2Z3Gxjo/XponHBS4dM0AY0DbFR0//pqQFqSMsTzxHCPsz28aKufmJbBa46VDrH9QTNqvB+Fp8QRDJM7Q0liBygBF+1Ud4X4L+w/FwTiB1408rxONKlyhjHpnbtWKO8YqhXcbEq8NmZEDwv7thSEkvN1nYvoUB7avC6A7bGJz8zB6BiyUjbmTRCYWt+An3rU7QsVbs2c+wcU3uNZIpz8TLm6HieK4FU7jzYVFoAQ4cDSOioBiV1nKLCAFinPHHi3wnr0vJ7zKV2mRJTGWbCHSB0aH+EbgQHSEw6FwuF1UXhUiuu0qh4c61u/SSrfYIeOksy8u16LTLa43cs5fl+YoP0iINFkxFJGMJGQcDeBHVO7atKfRd2Ys5KGg7Oblm8KzQF2LGKwF4FYlA8neqRGA9BGC38Gwf29jsG0iwAPP6GGb/8vaPz7xWzmTz7d3AAAAAElFTkSuQmCC"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex w-100">    
                    <div class="transaction-gas-group mx-3 font-bold-poppins w-50">
                        <div class="h4 text-white">Transaction and Gas Summary</div>
                        <div class="pt-20">
                            <div class="d-flex text-white gas-price-limit-padding">
                                <div class="flex-grow-1 p-2">Gas Price:</div>
                                <button type="button" class={gasPriceAuto ? "btn btn-primary rounded-pill font-bold-poppins auto-button" : "btn btn-secondary rounded-pill font-bold-poppins auto-button"} onClick={() => SetGasPriceAuto(!gasPriceAuto)}>Auto</button>
                                <div class="d-flex bg-dark rounded-3 gas-button-group">
                                    <input type="text" disabled={gasPriceAuto ? true : false} value={gasPrice} onChange={onSetGasPrice}></input>
                                    <span class="p-2">GWEI</span>
                                </div>
                            </div>
                        </div>
                        <div class="pt-30">
                            <div class="d-flex text-white gas-price-limit-padding">
                                <div class="flex-grow-1 p-2">Gas Limit:</div>
                                <button type="button" class={gasLimitAuto ? "btn btn-primary rounded-pill font-bold-poppins auto-button" : "btn btn-secondary rounded-pill font-bold-poppins auto-button"} onClick={() => SetGasLimitAuto(!gasLimitAuto)}>Auto</button>
                                <div class="d-flex bg-dark rounded-3 gas-button-group">
                                    <input type="text" disabled={gasLimitAuto ? true : false} placeholder={250000} value={gasLimit} onChange={onSetGasLimit}></input>
                                 </div>
                            </div>
                        </div>
                    </div>
                    <div class="transaction-gas-group text-white align-middle mx-5 font-bold-poppins w-50">
                        <div class="h4 text-white pb-3">Mint Time</div>
                        <div class="d-flex text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-stopwatch" viewBox="0 0 16 16">
                                <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z"/>
                                <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3z"/>
                            </svg>
                            <div class="d-flex pt-2 timer-style">
                                <input type="date" value={sendDate} onChange={e => SetSendDate(e.target.value)}></input>
                                <input type="time" value={sendTime} onChange={e => SetSendTime(e.target.value)}></input>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-50 d-flex justify-content-center">
                    <button class="btn btn-primary w-75 rounded-2 h4 font-bold-poppins buy-nft-button" onClick={onMintNFT}>MINT</button>
                </div>
            </Container>
            </div>
        </div>
    );
}

export default Home;