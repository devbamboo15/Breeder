import { useEffect, useState }  from "react";
import { useWallet }            from "use-wallet";
import { ethers }               from "ethers";
import { useRouter }            from "next/router";
import BigNumber                from "bignumber.js";
import {
    Flex,
    Spinner,
    Text,
    Image,
    NumberInput,
    NumberInputField,
    useToast
} from "@chakra-ui/core";
import {
    ChevronLeftIcon,
} from "@chakra-ui/icons";
import {
    getBalance,
    isTokenApproved,
    approveToken,
}   from "../../contracts/erc20";
import {
    getPoolInfo,
    getUserInfo,
    getPendingRewards,
    stake,
    withdraw,
    claim,
} from "../../contracts/masterchef";
import {
    getWalletAddress,
    shortenWalletAddress
} from "../../lib/wallet";
import {
    formatNumber,
    calcAPY,
    getBigNumber,
} from "../../lib/helper";
import {
    BREEDER_ADDRESSES,
    MASTERCHEF_ADDRESS,
    DKUMA_ADDRESS,
} from "../../utils/const";

  
const KumaBreeder = () => {
    const toast = useToast()
    const router = useRouter();
    const wallet = useWallet();
    const [selectedToken, setToken] = useState("");
    const [connected, setConnected] = useState(false);
    const [isstake, setIsStake] = useState(true);
    const [networkId, setNetworkId] = useState(0);
    const [balance, setBalance] = useState(0);
    const [stakeAmount, setStakeAmount] = useState('');
    const [unstakeAmount, setUnStakeAmount] = useState('');
    const [poolInfo, setPoolInfo] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [approved, setApproved] = useState(false);
    const [pending, setPending] = useState(false);
    const [prewards, setPendingRewards] = useState("0");
    const [timeupdated, setTimerUpdate] = useState(false);
    const [pendingText, setPendingText] = useState("");
    const [totalStaked, setTotalStaked] = useState("0");
    const [apy, setAPY] = useState("0");

    useEffect(() => {
        loadData();
        setInterval(() => {
            setTimerUpdate(true);
        }, 8000)
    }, []);

    useEffect(async () => {
        if (timeupdated) {
            setTimerUpdate(false);
            await updatePendingRewards();
        }
    }, [timeupdated])

    const getTokenBalance  = async (addr, walletAddr, provider) => {
        let balance = await getBalance(addr, walletAddr, provider);
        balance = ethers.utils.formatUnits(balance, "ether");
        return balance;
    }

    const loadData = async () => {
        if (wallet && wallet.ethereum) {
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const network = await provider.getNetwork();
            setNetworkId(network.chainId);
            let found = false;
            let fToken = null;
            for (const token of BREEDER_ADDRESSES[network.chainId]) {
                if (router.query.address === token.addr.toLowerCase()) {
                    found = true;
                    fToken = token; 
                    setToken(token);
                    break;
                }
            }
            if (!found) router.push("/");
            const walletAddr = await getWalletAddress(wallet);
            let balance = await getBalance(fToken.addr, walletAddr, provider);
            const approved = await isTokenApproved(fToken.addr, walletAddr, MASTERCHEF_ADDRESS[network.chainId], balance, provider);
            setApproved(approved);
            setBalance(balance);
            const pinfo = await getPoolInfo(MASTERCHEF_ADDRESS[network.chainId], fToken.poolId, provider);
            setPoolInfo({
                info: pinfo,
                masterchef: MASTERCHEF_ADDRESS[network.chainId],
                dkuma: DKUMA_ADDRESS[network.chainId]
            });
            const uinfo = await getUserInfo(MASTERCHEF_ADDRESS[network.chainId], fToken.poolId, walletAddr, provider);
            setUserInfo(uinfo);
            const reward = await getPendingRewards(MASTERCHEF_ADDRESS[network.chainId], fToken.poolId, walletAddr, provider);
            setPendingRewards(reward);
            const tStaked = await getTokenBalance(fToken.addr, MASTERCHEF_ADDRESS[network.chainId], provider);
            const apy = await calcAPY(fToken, network.chainId);
            setAPY(apy);
            setTotalStaked(tStaked);
        };
    }

    const updateUserInfo = async () => {
        if (wallet && wallet.ethereum) {
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const network = await provider.getNetwork();
            const walletAddr = await getWalletAddress(wallet);
            const uinfo = await getUserInfo(MASTERCHEF_ADDRESS[network.chainId], selectedToken.poolId, walletAddr, provider);
            setUserInfo(uinfo);
        }
    }

    const updateBalance = async () => {
        if (wallet && wallet.ethereum) {
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const walletAddr = await getWalletAddress(wallet);
            let balance = await getBalance(selectedToken.addr, walletAddr, provider);
            setBalance(balance);
        }
    }

    const updatePendingRewards = async () => {
        if (wallet && wallet.ethereum) {
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const network = await provider.getNetwork();
            const walletAddr = await getWalletAddress(wallet);
            const reward = await getPendingRewards(MASTERCHEF_ADDRESS[network.chainId], selectedToken.poolId, walletAddr, provider);
            setPendingRewards(reward);
        }
    }

    useEffect(() => {
        if (!connected && wallet && wallet.ethereum) {
            setConnected(true);
            loadData();
        }
    }, [wallet]);

    const onGoBack = () => {
        router.push("/");
    }

    const openTokenLink = (addr) => {
        if (networkId === 1) {
            window.open("https://etherscan.io/address/" + addr);
        } else if (networkId === 4) {
            window.open("https://rinkeby.etherscan.io/address/" + addr);
        }
    }

    

    const onChangeInputAmount = (value) => {
        if (isstake) {
            setStakeAmount(value);
        } else {
            setUnStakeAmount(value);
        }
    }

    const onClaim = async () => {
        if (!poolInfo || !selectedToken || pending) return;
        if (!prewards || !parseFloat(prewards)) return;
        try {
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const signer = await provider.getSigner();
            setPending(true);
            setPendingText("Claim Rewards ...");
            await claim(poolInfo.masterchef, selectedToken.poolId, signer);
            setPending(false);
            toast({
                title: "Claim Rewards",
                description: "Transaction is confirmed.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setPendingText("");
            setPendingRewards("0");
            updateBalance();
        } catch (e) {
            console.log(e);
            setPending(false);
            toast({
                title: "Claim Rewards",
                description: "Transaction is reverted.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setPendingText("");
        }

    }

    const onAction = async () => {
        if (!poolInfo || !selectedToken || pending) return;
        const provider = new ethers.providers.Web3Provider(wallet.ethereum);
        const signer = await provider.getSigner();
        try {
            if (isstake) {
                if (approved) {
                    if (!stakeAmount || !parseFloat(stakeAmount)) return;
                    setPending(true);
                    // let amount = new BigNumber(stakeAmount);
                    // let decimals = new BigNumber(10).exponentiatedBy(18);
                    // amount = amount.multipliedBy(Math.pow(10, 18));
                    // console.log(amount)
                    setPendingText(`Stake ${selectedToken.name} ...`);
                    await stake(poolInfo.masterchef, selectedToken.poolId, getBigNumber(stakeAmount), signer);
                    setPending(false);
                    setPendingText("");
                    toast({
                        title: "Stake Successed",
                        description: "Transaction is confirmed.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                    await updateUserInfo();
                    await updatePendingRewards();
                    await updateBalance();
                } else {
                    setPending(true);
                    setPendingText(`Approve ${selectedToken.name} ...`);
                    await approveToken(selectedToken.addr, poolInfo.masterchef, "115792089237316195423570985008687907853269984665640564039457584007913129639935", signer);
                    setPending(false);
                    setPendingText("");
                    setApproved(true);
                    toast({
                        title: "Approve Successed",
                        description: "Transaction is confirmed.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } else {
                if (!unstakeAmount || !parseFloat(unstakeAmount)) return;
                setPending(true);
                let amount = new BigNumber(unstakeAmount);
                let decimals = new BigNumber(10).exponentiatedBy(18);
                amount = amount.multipliedBy(decimals);
                setPendingText(`UnStake ${selectedToken.name} ...`);
                await withdraw(poolInfo.masterchef, selectedToken.poolId, getBigNumber(unstakeAmount), signer);
                setPending(false);
                setPendingText("");
                toast({
                    title: "UnStake Successed",
                    description: "Transaction is confirmed.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                await updateUserInfo();
                await updatePendingRewards();
                await updateBalance();
            }
        } catch (e) {
            console.log(e)
            setPending(false);
            setPendingText("");
            toast({
                title: "Error",
                description: "Transaction is reverted.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const checkActionButton = () => {
        if (isstake) {
            let amount = new BigNumber(stakeAmount);
            let decimals = new BigNumber(10).exponentiatedBy(18);
            amount = amount.multipliedBy(decimals);
            if (amount.gt(balance)) return true;
            if (amount.gt(poolInfo.info.limitPerWallet.toString())) return true;
            if (amount.plus(userInfo.amount.toString()).gt(poolInfo.info.limitPerWallet.toString())) return true;
        } else {
            let amount = new BigNumber(unstakeAmount);
            let decimals = new BigNumber(10).exponentiatedBy(18);
            amount = amount.multipliedBy(decimals);
            if (amount.gt(userInfo.amount.toString())) return true;
        }

        return pending || (isstake && (!stakeAmount || !parseFloat(stakeAmount))) || 
        (!isstake && (!unstakeAmount || !parseFloat(unstakeAmount)));
    }

    const onWithdrawMax = () => {
        const staked = ethers.utils.formatUnits(userInfo.amount.toString(), "ether");
        setUnStakeAmount(staked);
    }

    const renderStakePart = () => {
        if (!selectedToken || !poolInfo || !userInfo) {
            return (
                <Flex w={["calc(100% - 2rem)", "calc(100% - 2rem)", "calc(100% - 2rem)", "calc(65% - 4rem)"]} flexDirection="column">
                    <Flex
                        flexDirection="row" p="0rem"  m="0 1rem" w="100%"
                        borderTopRadius="10px" bg="#1E1A21"
                        borderBottom="10px solid #502D63"
                    >
                        <Flex m="auto 0 auto 1rem" fontSize="40px" cursor="pointer" onClick={onGoBack}>
                            <ChevronLeftIcon/>
                        </Flex>
                    </Flex>
                    <Flex
                        flexDirection="column" w="100%" m="0 1rem" p="1.5rem 2rem" 
                        borderBottomRadius="10px" boxShadow="0 6px 4px 0px rgba(180, 180, 180, 0.1)" bg="#1E1A21"
                    >
                        <Spinner m="auto"/>
                    </Flex>
                </Flex>
            )
        }
        const { image, name, addr, isLp } = selectedToken;
        const staked = ethers.utils.formatUnits(userInfo.amount.toString(), "ether");
        const reward = ethers.utils.formatUnits(prewards, "ether");
        return (
            <Flex w={["calc(100% - 2rem)", "calc(100% - 2rem)", "calc(100% - 2rem)", "calc(65% - 4rem)"]} flexDirection="column">
                <Flex
                    flexDirection="row" p="0.5rem 0"  m="0 1rem" w="100%"
                    borderTopRadius="10px" bg="#1E1A21"
                    borderBottom="10px solid #502D63"
                >
                    <Flex m="auto 0 auto 1rem" fontSize="40px" cursor="pointer" onClick={onGoBack}>
                        <ChevronLeftIcon/>
                    </Flex>
                    <Flex flexDirection="row" m="auto 0">
                        {isLp &&
                            <Flex w="3rem" borderRadius="100%" ml="" h="3rem" borderRadius="100%" bg="#fff">
                                <Image src={"/images/eth.png"} h="2.5rem" m="auto"/>
                            </Flex>
                        }
                        <Flex w="3rem" borderRadius="100%" ml="" h="3rem" borderRadius="100%" bg="#fff" ml={isLp?"-0.7rem":"0"}>
                            <Image src={"/images/" + image} h="2rem" m="auto"/>
                        </Flex>
                    </Flex>
                    <Flex m="auto 0 auto 1rem" fontSize={["24px", "28px", "34px", "40px"]} cursor="pointer" onClick={onGoBack}>
                        <Text fontWeight="bold">{name}</Text>
                    </Flex>
                </Flex>
                <Flex
                    flexDirection="column" w="100%" m="0 1rem" p="1.5rem 2rem" 
                    borderBottomRadius="10px" boxShadow="0 6px 4px 0px rgba(180, 180, 180, 0.1)" bg="#1E1A21"
                >
                    <Flex flexDirection={["column", "column", "row"]} justifyContent="space-between">
                        <Flex flexDirection="column">
                            <Text fontSize={["12px", "14px", "14px", "18px"]} color="#ccc">Staked</Text>
                            <Text fontSize="16px" color="#fff" fontWeight="bold">{formatNumber(parseFloat(staked), 3)}</Text>
                        </Flex>
                        <Flex flexDirection="column">
                            <Text fontSize={["12px", "14px", "14px", "18px"]} color="#ccc" textAlign={["left", "left", "center"]}>Your Rewards</Text>
                            <Text fontSize="16px" color="#fff" fontWeight="bold">{formatNumber(parseFloat(reward), 3)}</Text>
                        </Flex>
                        <Flex flexDirection="column">
                            <Text fontSize={["12px", "14px", "14px", "18px"]} color="#ccc"  textAlign={["left", "left", "right"]}>Pool APY</Text>
                            <Text fontSize="16px" color="#fff" fontWeight="bold">
                                {apy === "0"? "none" : formatNumber(parseFloat(apy), 3) + "%"}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex flexDirection="row" bg="#333" borderRadius="10px" p="5px" m="1.5rem 0" userSelect="none">
                        <Flex w="50%" p="1rem 0" borderRadius="10px" cursor="pointer"
                            bg={isstake?"#1E1A21":"#333"} onClick={() => setIsStake(true)}
                        >
                            <Text m="auto" fontWeight="bold" fontSize={["12px", "14px", "14px", "20px"]} color={isstake?"#fff":"#aaa"}>Stake {name}</Text>
                        </Flex>
                        <Flex w="50%" p="1rem 0" borderRadius="10px" cursor="pointer"
                            bg={!isstake?"#1E1A21":"#333"} onClick={() => setIsStake(false)}
                        >
                            <Text m="auto" fontWeight="bold" fontSize={["12px", "14px", "14px", "20px"]} color={!isstake?"#fff":"#aaa"}>UnStake {name}</Text>
                        </Flex>
                    </Flex>
                    <Text fontWeight="bold" fontSize={["20px", "20px", "24px", "30px"]}>{isstake?"Stake":"UnStake"} {name}</Text>
                    <Flex flexDirection="row" m="0.5rem 0">
                        <Flex cursor="pointer" onClick={() => openTokenLink(addr)} m="auto auto auto 0">
                            <Text as="u" fontSize={["12px", "12px", "14px"]} color="#ccc">{shortenWalletAddress(addr)}</Text>
                        </Flex>
                        {isstake?
                            <Text fontSize={["12px", "14px", "14px", "18px"]} color="#ccc" fontWeight="bold">
                                Balance {formatNumber(parseFloat(ethers.utils.formatUnits(balance, "ether")), 3)}
                            </Text>:
                            <Flex cursor="pointer" onClick={onWithdrawMax}>
                                <Text fontSize={["12px", "14px", "14px", "18px"]} color="#ccc" fontWeight="bold">Max {formatNumber(parseFloat(staked), 3)}</Text>
                            </Flex>
                        }
                    </Flex>
                    <NumberInput bg="#333" borderRadius="10px" size="lg" defaultValue={stakeAmount}
                        value={isstake?stakeAmount:unstakeAmount}
                        onChange={onChangeInputAmount}
                    >
                        <NumberInputField fontSize={["14px", "16px", "16px", "24px"]} fontWeight="bold" border="none" placeholder="0.0">
                        </NumberInputField>
                    </NumberInput>
                    <Flex cursor="pointer" p="0.8rem 1rem" bg="#502D63" borderRadius="10px" m="2rem 0 1rem 0"  transition="0.3s" onClick={onAction}
                        opacity={checkActionButton()?0.4:1} userSelect="none"
                        _hover={{opacity: checkActionButton()?0.4:0.85}}
                    >
                        <Text fontWeight="bold" fontSize={["12px", "14px", "14px", "18px"]} m="0 auto">
                            {approved?(isstake?"Stake":"UnStake"):"Approve"} {name}
                        </Text>
                    </Flex>
                    <Flex cursor="pointer" p="0.8rem 1rem" bg="#502D63" borderRadius="10px" transition="0.3s" onClick={onClaim}
                        opacity={(!reward || !parseFloat(reward) || pending)?0.4:1} userSelect="none"
                        _hover={{opacity: !reward || !parseFloat(reward) || pending?0.4:0.85}}
                    >
                        <Text fontWeight="bold" fontSize={["12px", "14px", "14px", "18px"]} m="0 auto">Claim Rewards</Text>
                    </Flex>
                </Flex>
            </Flex>
        );
    }

    const calcStakeLimit = (stakeLimit) => {
        if (stakeLimit === "115792089237316195423570985008687907853269984665640564039457584007913129639935") return "No Limit";
        const limit = ethers.utils.formatUnits(stakeLimit, "ether");
        return formatNumber(parseFloat(limit), 2);
    }

    const renderPoolInfo = () => {
        if (!selectedToken || !poolInfo) {
            return (
                <Flex
                    flexDirection="column" p="1.5rem 2rem" w={["calc(100% - 2rem)", "calc(100% - 2rem)", "calc(100% - 2rem)", "calc(35%)"]} m={["2rem 1rem", "2rem 1rem", "2rem 1rem", "0 1rem"]}
                    borderBottomRadius="10px" boxShadow="0 6px 4px 0px rgba(180, 180, 180, 0.1)" bg="#1E1A21"
                >
                    <Text fontWeight="bold" fontSize={["16px", "18px", "20px"]}>Pool Info</Text>
                    <Spinner m="auto"/>
                </Flex>
            );
        }
        const info = poolInfo.info;
        return (
            <Flex
                flexDirection="column" p="1.5rem 2rem" w={["calc(100% - 2rem)", "calc(100% - 2rem)", "calc(100% - 2rem)", "calc(35%)"]} m={["2rem 1rem", "2rem 1rem", "2rem 1rem", "0 1rem"]}
                borderBottomRadius="10px" boxShadow="0 6px 4px 0px rgba(180, 180, 180, 0.1)" bg="#1E1A21" 
            >
                <Text fontWeight="bold" fontSize={["16px", "18px", "20px"]}>Pool Info</Text>
                <Flex flexDirection="row" justifyContent="space-between" mt="0.2rem">
                    <Text fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#aaa">Total Staked</Text>
                    <Text fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#fff">{formatNumber(parseFloat(totalStaked), 3)}</Text>
                </Flex>
                <Flex flexDirection="row" justifyContent="space-between" mt="0.5rem">
                    <Text fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#aaa">Allocation Point</Text>
                    <Text fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#fff">{info.allocPoint.toString()}AP</Text>
                </Flex>
                <Flex flexDirection="row" justifyContent="space-between" mt="0.5rem">
                    <Text fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#aaa">Pool Fee</Text>
                    <Text fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#fff">{formatNumber(parseFloat(info.poolFee.toString()) / 10, 2)}%</Text>
                </Flex>
                <Flex flexDirection="row" justifyContent="space-between" mt="0.5rem">
                    <Text fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#aaa">Stake Limit</Text>
                    <Text fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#fff">{calcStakeLimit(info.limitPerWallet.toString())}</Text>
                </Flex>
                <Text fontWeight="bold" fontSize={["16px", "18px", "20px"]} mt="3rem">Contract Info</Text>
                <Flex flexDirection="row" justifyContent="space-between" mt="0.2rem">
                    <Text fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#aaa">Reward</Text>
                    <Flex cursor="pointer" onClick={() => openTokenLink(poolInfo.dkuma)}>
                        <Text as="u" fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#fff">{shortenWalletAddress(poolInfo.dkuma)}</Text>
                    </Flex>
                </Flex>
                <Flex flexDirection="row" justifyContent="space-between" mt="0.5rem">
                    <Text fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#aaa">Stake</Text>
                    <Flex cursor="pointer" onClick={() => openTokenLink(poolInfo.info.lpToken)}>
                        <Text as="u" fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#fff">{shortenWalletAddress(poolInfo.info.lpToken)}</Text>
                    </Flex>
                </Flex>
                <Flex flexDirection="row" justifyContent="space-between" mt="0.5rem">
                    <Text fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#aaa">MasterChef</Text>
                    <Flex cursor="pointer" onClick={() => openTokenLink(poolInfo.masterchef)}>
                        <Text as="u" fontSize={["12px", "14px", "14px", "14px"]} fontWeight="500" color="#fff">{shortenWalletAddress(poolInfo.masterchef)}</Text>
                    </Flex>
                </Flex>
            </Flex>
        );
    }

    return (
        <Flex maxW="70rem" w="100%" m="0 auto" mt="3rem" justifyContent="space-between"
        flexDirection={["column", "column", "column", "row"]}
        >
            {pendingText && <Flex bg="#333" p="0.5rem 1rem" position="absolute" top="6rem" right="1rem" flexDirection="row" borderRadius="10px">
                <Spinner size="sm" m="auto 0"/>
                <Text fontSize="12px" ml="0.5rem">{pendingText}</Text>
            </Flex>}
            {renderStakePart()}
            {renderPoolInfo()}
        </Flex>
    );
};

export default KumaBreeder;
