import { ethers } from "ethers";
import abi from './masterchef.abi.json';
import { isTransactionMined } from "../lib/helper";

export async function getPoolInfo(masterchef, poolId, signer) {
  try {
    const contract = new ethers.Contract(masterchef, abi, signer);
    const pool = await contract.poolInfo(poolId);
    return pool;    
  } catch (e) {
    return {};
  }
}

export async function getUserInfo(masterchef, poolId, wallerAddr, signer) {
  try {
    const contract = new ethers.Contract(masterchef, abi, signer);
    const pool = await contract.userInfo(poolId, wallerAddr);
    return pool;    
  } catch (e) {
    return {};
  }
}

export async function getPendingRewards(masterchef, poolId, wallerAddr, signer) {
  try {
    const contract = new ethers.Contract(masterchef, abi, signer);
    const reward = await contract.pendingSushi(poolId, wallerAddr);
    return reward.toString();    
  } catch (e) {
    return "0";
  }
}

export async function getRewardsPerBlock(masterchef, signer) {
  try {
    const contract = new ethers.Contract(masterchef, abi, signer);
    const reward = await contract.sushiPerBlock();
    return reward.toString();
  } catch (e) {
    return "0";
  }
}

export async function getTotalAllocPoint(masterchef, signer) {
  const contract = new ethers.Contract(masterchef, abi, signer);
  const totalAlloc = await contract.totalAllocPoint();
  return totalAlloc.toString();
}


export async function stake(masterchef, poolId, amount, signer) {
    const contract = new ethers.Contract(masterchef, abi, signer);
    const { hash } = await contract.deposit(poolId, amount);
    try {
      while (true) {
        let mined = await isTransactionMined(hash);
        if (mined) break;
      }
    } catch (e) {
      console.error(e);
      return "";
    }
    return hash;
}

export async function claim(masterchef, poolId, signer) {
    const contract = new ethers.Contract(masterchef, abi, signer);
    const { hash } = await contract.deposit(poolId, "0");
    try {
      while (true) {
        let mined = await isTransactionMined(hash);
        if (mined) break;
      }
    } catch (e) {
      console.error(e);
      return "";
    }
    return hash;
}

export async function withdraw(masterchef, poolId, amount, signer) {
    const contract = new ethers.Contract(masterchef, abi, signer);
    const { hash } = await contract.withdraw(poolId, amount);
    try {
      while (true) {
        let mined = await isTransactionMined(hash);
        if (mined) break;
      }
    } catch (e) {
      console.error(e);
      return "";
    }
    return hash;
}
