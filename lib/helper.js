import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import {
    WETH_ADDRESS,
    MASTERCHEF_ADDRESS,
    DKUMA_LP_ADDRESS,
    DKUMA_ADDRESS,
} from "../utils/const";
import {
    getBalance,
    getTotalSupply,
} from "../contracts/erc20";
import {
    getRewardsPerBlock,
    getTotalAllocPoint,
    getPoolInfo,
} from "../contracts/masterchef";

export const formatNumber = (x, decimals) => {
    const parts = x.toFixed(decimals + 1).split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts[0] + "." + parts[1]?.slice(0, decimals);
}

export const isTransactionMined = async (transactionHash) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const txReceipt = await provider.getTransactionReceipt(transactionHash);
    if (txReceipt && txReceipt.blockNumber) {
      return true;
    }
    return false;
}

const getBalanceDecimal  = async (addr, walletAddr, provider) => {
    let balance = await getBalance(addr, walletAddr, provider);
    balance = ethers.utils.formatUnits(balance, "ether");
    return balance;
}

const getTPrice = async (token, pair, chainId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const wethBalance = await getBalanceDecimal(WETH_ADDRESS[chainId], pair, provider);
    const tokenBalance = await getBalanceDecimal(token, pair, provider);
    const wp = new BigNumber(wethBalance);
    const tp = new BigNumber(tokenBalance);
    if (!tp.toString() || !parseFloat(tp.toString())) return "0";
    const price = wp.multipliedBy(4000).dividedBy(tp);
    return price.toString();
}

export const getTokenPrice = async (token, pair, walletAddr, chainId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const price = await getTPrice(token, pair, chainId);
    const balance = await getBalanceDecimal(token, walletAddr, provider);
    const tb = new BigNumber(balance);
    const usdValue = tb.multipliedBy(price);
    return usdValue.toString();
}

export const getLPTokenPrice = async (token, pair, walletAddr, chainId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tPrice = await getTPrice(token, pair, chainId);
    const tBalance = await getBalanceDecimal(token, pair, provider);
    const lpBalance = await getBalanceDecimal(pair, walletAddr, provider);
    let total = await getTotalSupply(pair, provider);
    total = ethers.utils.formatUnits(total, "ether");
    const big_tPrice = new BigNumber(tPrice);
    const big_tBalance = new BigNumber(tBalance);
    const big_lpBalance = new BigNumber(lpBalance);
    const big_total = new BigNumber(total);
    let price = big_tPrice.multipliedBy(big_tBalance);
    price = price.multipliedBy(big_lpBalance).multipliedBy(2);
    if (!big_total.toString() || !parseFloat(big_total.toString())) return "0";
    price = price.dividedBy(big_total);
    return price.toString();
}

export const calcAPY = async (token, chainId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let rewardPerBlock = await getRewardsPerBlock(MASTERCHEF_ADDRESS[chainId], provider);
    rewardPerBlock = ethers.utils.formatUnits(rewardPerBlock, "ether");
    const totalAlloc = await getTotalAllocPoint(MASTERCHEF_ADDRESS[chainId], provider);
    const dKumaPrice = await getTPrice(DKUMA_ADDRESS[chainId], DKUMA_LP_ADDRESS[chainId], chainId);
    const totalStakedPoolPrice = token.isLp?
        await getLPTokenPrice(token.extraAddr, token.addr, MASTERCHEF_ADDRESS[chainId], chainId):
        await getTokenPrice(token.addr, token.extraAddr, MASTERCHEF_ADDRESS[chainId], chainId);
    const poolInfo = await getPoolInfo(MASTERCHEF_ADDRESS[chainId], token.poolId, provider);
    const alloc = poolInfo.allocPoint.toString();
    let apy = new BigNumber(rewardPerBlock);
    if (!totalAlloc.toString() || !parseFloat(totalAlloc.toString())) return "0";
    if (!totalStakedPoolPrice.toString() || !parseFloat(totalStakedPoolPrice.toString())) return "0";
    apy = apy.multipliedBy(alloc).dividedBy(totalAlloc).multipliedBy(dKumaPrice).dividedBy(totalStakedPoolPrice).multipliedBy(2372500).multipliedBy(100);
    return apy.toString();
}

export const getBigNumber = (source) => {
    const parts = source.split(".");
    console.log(parts)
    let decimals = 18;
    if (parts[1] && parts[1].length) decimals -= parts[1].length;
    let zero = "0";
    if (decimals < 0) return parts[0] + parts[1].slice(0, 18);
    return parts[0] + (parts[1]?parts[1]:"") + (zero.repeat(decimals));
}