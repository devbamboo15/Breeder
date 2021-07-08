import { useEffect, useState }  from "react";
import { useWallet }            from "use-wallet";
import { ethers }               from "ethers";
import { useRouter }            from "next/router";
import { Grid } from '@material-ui/core';
import styles from '../styles/styles.module.css';
import {
  Flex,
  Text,
  Image,
  Spinner,
  Badge,
  Icon,
  Link,
  Box,
} from "@chakra-ui/core";
import {
  RiTelegramLine,
  RiMediumLine,
  RiTwitterLine,
  RiRedditLine,
} from "react-icons/ri";
import { IoEarthSharp } from "react-icons/io5";
import { GiHorseHead } from "react-icons/gi";
import { getBalance }   from "../contracts/erc20";
import {
  getWalletAddress
} from "../lib/wallet";
import {
  formatNumber,
  getTokenPrice,
  getLPTokenPrice,
  calcAPY,
} from "../lib/helper";
import {
  BREEDER_ADDRESSES,
  MASTERCHEF_ADDRESS,
} from "../utils/const";
import {
  getPendingRewards
} from "../contracts/masterchef";
import BigNumber from "bignumber.js";
import SwitchModal from "../components/SwitchModal";
  
const KumaBreeder = () => {
  const wallet = useWallet();
  const router = useRouter();
  const [pairs, setPairs] = useState([]);
  const [connected, setConnected] = useState(false);
  const [tvl, setTVL] = useState(-1);
  const [totalRewards, setTotalRewards] = useState(-1);
  const [timeupdated, setTimerUpdate] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadBalances();
    setInterval(() => {
      setTimerUpdate(true);
    }, 8000)
  }, []);

  useEffect(async () => {
      if (timeupdated) {
          setTimerUpdate(false);
          await getTotalRewards();
      }
  }, [timeupdated])

  const onClose = () => {
    setIsOpen(false);
  }

  const getTokenBalance  = async (addr, walletAddr, provider) => {
    let balance = await getBalance(addr, walletAddr, provider);
    balance = ethers.utils.formatUnits(balance, "ether");
    return balance;
  }

  const getTokenDetail  = async (token, provider, networkId) => {
    let usdbalance = 0;
    if (token.isLp)
      usdbalance = await getLPTokenPrice(token.extraAddr, token.addr, MASTERCHEF_ADDRESS[networkId], networkId);
    else
      usdbalance = await getTokenPrice(token.addr, token.extraAddr, MASTERCHEF_ADDRESS[networkId], networkId);
    const tStaked = await getTokenBalance(token.addr, MASTERCHEF_ADDRESS[networkId], provider);
    const apy = await calcAPY(token, networkId);
    return {
      poolId: token.poolId,
      name: token.name,
      image: token.image,
      addr: token.addr,
      isLp: token.isLp?true:false,
      usdbalance: usdbalance,
      total: tStaked,
      apy,
    };
  }

  const getTotalRewards = async () => {
    try {
      let provider;
      if (wallet && wallet.ethereum)
        provider = new ethers.providers.Web3Provider(wallet.ethereum);
      else
        provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.alchemyapi.io/v2/cVQWBBi-SmHIeEpek2OmH5xgevUvElob");
      const network = await provider.getNetwork();
      if (parseInt(network.chainId) !== 1) {
        setIsOpen(true);
        return;
      }
      const walletAddr = await getWalletAddress(wallet);
      const arrPromise = [];
      for (const token of BREEDER_ADDRESSES[network.chainId]) {
        const promise = getPendingRewards(MASTERCHEF_ADDRESS[network.chainId], token.poolId, walletAddr, provider);
        arrPromise.push(promise);
      }
      const resolvedPromises = await Promise.all(arrPromise);
      let sum = new BigNumber("0");
      for(const reward of resolvedPromises) {
        const r = ethers.utils.formatUnits(reward, "ether");
        sum = sum.plus(r);
      }
      setTotalRewards(sum);
    } catch (e) {

    }
  }

  const loadBalances = async () => {
    try {
      let provider;
      if (wallet && wallet.ethereum)
        provider = new ethers.providers.Web3Provider(wallet.ethereum);
      else
        provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.alchemyapi.io/v2/cVQWBBi-SmHIeEpek2OmH5xgevUvElob");
      const network = await provider.getNetwork();
      console.log(network);
      if (parseInt(network.chainId) !== 1) {
        setIsOpen(true);
        return;
      }
      const arrPromise = [];
      for (const token of BREEDER_ADDRESSES[network.chainId]) {
        const promise = getTokenDetail(token, provider, network.chainId);
        arrPromise.push(promise);
      }
      const resolvedPromises = await Promise.all(arrPromise);
      let sum = 0;
      for(const token of resolvedPromises) {
        sum = sum + parseFloat(token.usdbalance);
      }
      setTVL(sum);
      setPairs(resolvedPromises);
      getTotalRewards();
      setLoaded(true);
    } catch (e) {
      
    }
  }

  useEffect(() => {
    if (!connected) {
      setConnected(true);
      loadBalances();
    }
  }, [wallet]);

  const onStake = (addr) => {
    router.push("/kumabreeder?address=" + addr.toLowerCase())
  }

  const renderrTVL = () => {
    //if (!connected) return (<Text color="#fff" fontSize="26px" fontWeight="bold">---</Text>);
    if (tvl === -1) return (<Spinner m="auto 0"/>);
        return (<Text color="white" fontSize="32px" align="center">{formatNumber(tvl, 3)} USD</Text>);
}

const renderReward = () => {
    if (!connected) return (<Text className={styles.gradientText} fontSize="40px" align="center">---</Text>);
    if (totalRewards === -1) return (<Spinner m="0.5rem auto"/>);
        return (<Text className={styles.gradientText} fontSize="40px" align="center">{formatNumber(totalRewards, 3)} $dk</Text>);
}

return (
    <Box p={10} className="wallet-wrapper" maxW="100rem" m="auto">
        <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
                <div className={styles.card_summary}>
                    <Grid container>
                        <Grid item xs={8}>
                            <p className={styles.summary_title}>Deposit your Meme and LP tokens, earn passive rewards $dKUMA</p>
                            <Text className={styles.summary_text} mb="40px">
                                Lock your funds to Kuma Breeder and generate rewards for your contribution.
                                Kuma Breeder may be a profitable business as long as you know the risks.
                                Please use at your own risk.
                            </Text>
                        </Grid>
                        <Grid item xs={4}>
                            <Box display="flex" justifyContent="center">
                                <Image className={styles.imageSize} w={"50%", "150%"} src="/images/logo_summary.png" alt="summary logo" />
                            </Box>
                        </Grid>
                    </Grid>
                </div>
                <Box pt={5}>
                    <table className={styles.breedTable}>
                        <Text my={5} mt="0.5rem" fontWeight="500" fontSize="24px" mb="0.5rem">Kuma Breeder</Text>
                        <tr>
                            <th>Pair</th>
                            <th>Token</th>
                            <th>APY</th>
                            <th>Total</th>
                        </tr>
                        {pairs.map((item, index) =>
                            <tr onClick={() => onStake(item.addr)} className={styles.tableRow}>
                                <td>
                                    <Flex w="50%" flexDirection="row">
                                        {item.isLp &&
                                        <Flex w="2rem" borderRadius="100%" ml="" h="2rem" p="3px" borderRadius="100%" bg="#fff">
                                            <Image src={"/images/eth.png"} m="auto"/>
                                        </Flex>
                                        }
                                        <Flex w="2rem" borderRadius="100%" ml="" h="2rem" p="3px" borderRadius="100%" bg="#fff" ml={item.isLp?"-0.7rem":"0"}>
                                          <Image src={"/images/" + item.image} m="auto"/>
                                        </Flex>
                                    </Flex>
                                </td>
                                <td>{item.name}</td>
                                <td>{item.apy === "0"? "none" : formatNumber(parseFloat(item.apy), 3) + "%"}</td>
                                <td>{formatNumber(parseFloat(item.total), 3)}</td>
                            </tr>
                        )}
                        
                    </table>
                </Box>
            </Grid>
            <Grid item xs={12} md={4} >
                <Box bg="#21173c" w="100%" h="100%" borderRadius="10px" p={5}>
                    <Box p={5}>
                        <Text color="#B1AFCD" fontSize="12px" align="center">TOTAL VALUE LOCKED</Text>
                    </Box>

                    <Box display="flex" justifyContent="center" p={5}>
                        {renderrTVL()}
                    </Box>

                    {/* <Flex justifyContent="center">
                        <Flex as="button" 
                            bg="linear-gradient(268.95deg, rgba(41, 164, 217, 0.536345) 4.06%, rgba(91, 216, 255, 0.866791) 42.35%, rgba(66, 170, 192, 0.50218) 99.53%)" 
                            width="247px" 
                            height="61px"
                            borderRadius="8px"
                            fontSize="12px"
                            fontWeight="500"
                            alignItems="center"
                            justifyContent="center"
                            >
                            <Box display="flex" p={1} mr={3} bg="#181634" w="36px" h="36px" borderRadius="13px" justifyContent="center">
                                <Image src="/images/ico_kuma.png" alignSelf="center"></Image>
                            </Box>
                            10x Bonus Period
                        </Flex>
                    </Flex> */}

                    <Box display="flex" flexDirection="column" justifyContent="center" m={10} mt={100}>
                        <Image src="/images/logo_box.png" width="250px" height="250px" alignSelf="center"></Image>
                        <Box display="flex" alignSelf="center" mt={5}>
                            <Text fontSize="14px" color="#6968A6">Yield $dKuma</Text>
                        </Box>
                        <Box display="flex" justifyContent="center" p={5}>
                            {renderReward()}
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    </Box>
    
  );
};

export default KumaBreeder;
