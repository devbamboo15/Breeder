import React,{ useEffect, useState }  from 'react'
import GlobalChartView from '../../components/PriceHistoryChart/GlobalChartView.js'
import styles from '../../styles/styles.module.css'
import { useWallet }            from "use-wallet";
import { ethers }               from "ethers";
import { useRouter }            from "next/router";
import {
    Box,
    Text,
    Flex,
    Button,
    Image,
    Grid,
    GridItem,
    Spinner,
  } from "@chakra-ui/core";
import { getBalance }   from "../../contracts/erc20";
import {
    BREEDER_ADDRESSES,
    DKUMA_ADDRESS,
    MASTERCHEF_ADDRESS,
    SUPPORT_TOKEN_ADDRESSES,
    } from "../../utils/const";
import {
    getWalletAddress
    } from "../../lib/wallet";
import {
    formatNumber,
    getTokenPrice,
    } from "../../lib/helper";
import BigNumber        from "bignumber.js";
import { getMarketCap } from '../api/hello.js';
import { getPendingRewards } from '../../contracts/masterchef.js';

const Wallet = () => {
    const router = useRouter();
    const wallet = useWallet();
    const [kumaBalance, setKumaBalance] = useState(0);
    const [connected, setConnected] = useState(false);
    const [assets, setAssets] = useState([]);
    const [usdValue, setUsdValue] = useState(0);
    const [marketData, setMarketData] = useState(null);
    const [timeupdated, setTimerUpdate] = useState(false);
    const [totalRewards, setTotalRewards] = useState(-1);

    const logoArr = [
        "/images/shib.png",
        "/images/elon.jpeg",
        "/images/leash.png",
        "/images/akita.png"
    ];

    useEffect(() => {
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

    useEffect(async () => {
        loadBalances();
        const marketData = await getMarketCap();
        setMarketData(marketData);
    }, []);

    const getTokenBalance = async (token, walletAddr, chainId) => {
        const usdvalue = await getTokenPrice(token.addr, token.pair, walletAddr, chainId);
        return {
        name: token.name,
        usdvalue: usdvalue.toString(),
        }
    }

    const loadBalances = async () => {
        if (wallet && wallet.ethereum) {
        const provider = new ethers.providers.Web3Provider(wallet.ethereum);
        const network = await provider.getNetwork();
        const walletAddr = getWalletAddress(wallet);
        const dKumaAddr = DKUMA_ADDRESS[network.chainId];
        let balance = await getBalance(dKumaAddr, walletAddr, provider);
        balance = parseFloat(ethers.utils.formatUnits(balance, "ether"));
        setKumaBalance(formatNumber(balance, 3));

        const arrPromise = [];
        for (const token of SUPPORT_TOKEN_ADDRESSES[network.chainId]) {
            const promise = getTokenBalance(token, walletAddr, network.chainId);
            arrPromise.push(promise);
        }
        const resolvedPromises = await Promise.all(arrPromise);
        setAssets(resolvedPromises);
        let sum = 0;
        for(const token of resolvedPromises) {
            sum = sum + parseFloat(token.usdvalue);
        }
            setUsdValue(sum);
        };
        getTotalRewards();
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
          console.log({sum});
          setTotalRewards(sum);
        } catch (e) {
    
        }
      }

    useEffect(() => {
        if (!connected && wallet && wallet.ethereum) {
        setConnected(true);
            loadBalances();
        }
    }, [wallet]);

    const renderRewardsEarned = () => {
        return (
            <Text fontSize="14px" color="#50E3C2" ml={2}>{formatNumber(totalRewards, 3)}</Text>
        );
    }

    const renderKuma = () => {
        const total = new BigNumber(usdValue);
        const balance = new BigNumber(kumaBalance);
        let percent = total.eq("0")?0:balance.dividedBy(total);
        if (percent !== 0)
            percent = parseFloat(percent.toString()) * 100;
        return (
            <Box mx={3}>
                <Flex flexDirection="row" alignItems="center">
                    <Text fontSize='17px' mr="3">{kumaBalance}</Text>
                    <Text fontSize="12px" fontWeight="700" color="rgba(255,255,255,0.2)">$Kuma</Text>
                </Flex>
                <Flex flexDirection="row">
                    <Image src={percent >= 0 ? "/images/img_graph_up.png":"images/img_graph_down.png"} width="40px" alignSelf="center" />
                    <Image src={percent >= 0 ? "/images/ico_rise.png":"/images/ico_down.png"} width="6px" alignSelf="center" />
                    <Text alignSelf="center" ml={2} fontSize="11px" color={percent >= 0 ? "#50E2C2":"#E3507A"}>{percent.toFixed(2)}%</Text>
                </Flex>
            </Box>
        );
    }

    const renderMarketData = () => {
        const currentDate = new Date().getMonth() + '/' + new Date().getDate() + '/' + new Date().getFullYear();
        console.log({marketData});
        const percentage = marketData ? parseFloat(marketData.percentage.toString()) : 0;
        return (
            <Box className={styles.card_status} mt={["-20px", "-20px", "-45px", "-30px", "-30px"]} ml={["0px", "0px", "0px", "50px", "40px"]}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src="/images/status_logo.png" alt="icon kuma" width={30} height={30} />
                    <Text fontSize="14px" ml="5px" color={percentage >= 0 ? '#50E3C2' : '#E3507A'}>{percentage.toFixed(1)}%</Text>
                </div>
                <p style={{ color: '#6F6EA4', fontSize: 14 }}>{currentDate}</p>
            </Box>
        )
    }

    return (
        <Box p={10} className="wallet-wrapper" maxW={["80rem","80rem", "80rem", "80rem", "100rem"]} m="auto">
            <Grid templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(3, 1fr)"]} gap={12}>
                <GridItem colSpan={["1", "1", "1", "1", "2"]}>
                    <div className={styles.card_summary}>
                        <Grid templateColumns="repeat(4, 1flr)">
                            <Grid colSpan={3}>
                                <Box w={["50%", "60%", "80%", "80%", "80%"]}>
                                    <p className={styles.summary_title}>Deposit your Meme and LP tokens, earn passive rewards $dKUMA</p>
                                    <p className={styles.summary_text}>Lock your funds to Kuma Breeder and generate rewards for your contribution.</p>
                                    <p className={styles.summary_text}>Kuma Breeder may be a profitable business as long as you know the risks.</p>
                                    &nbsp;
                                    <Text mb="40px" className={styles.summary_text}>Please use at your own risk.</Text>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box className={styles.logoWrapper} top={["35px", "25px", "25px", "-40px", "-35px"]} right={["-90px", "-90px", "-90px", "-20px", "-40px"]}>
                            <Image className={styles.imageSize} w={["calc(50%)", "calc(50%)", "calc(50%)", "calc(80%)", "calc(80%)"]} src="/images/logo_summary.png" alt="summary logo" />
                            {renderMarketData()}
                        </Box>
                    </div>
                    <GlobalChartView totalUSD={usdValue}/>
                </GridItem>
                <GridItem colSpan={1}>
                    <Box bg="#21173c" minW="415px" w="100%" h="100%" borderRadius="10px" p={5}>
                        <Box p={5}>
                            <Text color="#B1AFCD" fontSize="12px" align="center">MY WALLETS $DKUMA</Text>
                        </Box>
                        <Grid templateColumns="repeat(2, 1fr)" gap={5}>
                            <GridItem colSpan={2}>
                                <Box display="flex" flexDirection="row" p={5} alignItems="center" justifyContent="space-between" borderWidth="1px" borderRadius="10px" borderStyle="dashed" borderColor="#B1AFCD80">
                                    <Box display="flex" flexDirection="row">
                                        <Box display="flex" bg="#181634" w="54px" h="54px" borderRadius="13px" justifyContent="center">
                                            <Image src="/images/ico_kuma.png" alignSelf="center"></Image>
                                        </Box>
                                        {renderKuma()}
                                    </Box>
                                    <Box>
                                        <Box as="button" 
                                            bg="linear-gradient(278.76deg, #309AFF 1.92%, #38EFC3 111.91%)" 
                                            width="78px" 
                                            height="40px"
                                            borderRadius="8px"
                                            fontSize="12px"
                                            fontWeight="500">
                                            Buy
                                        </Box>
                                    </Box>
                                </Box>
                            </GridItem>

                            {assets.map((item, index) => {
                                const total = new BigNumber(usdValue);
                                const balance = new BigNumber(item.usdvalue);
                                let percent = total.eq("0")?0:balance.dividedBy(total);
                                if (percent !== 0)
                                    percent = parseFloat(percent.toString()) * 100;
                                return index > 1 && (
                                    <GridItem colSpan={1}>
                                        <Box display="flex" flexDirection="row" h="85px" justifyContent="space-around" p={3} minW="165px" borderWidth="1px" borderRadius="10px" borderStyle="solid" borderColor="#B1AFCD80">
                                            <Image src={logoArr[index - 2]} w="2rem" h="2rem" alignSelf="center"></Image>
                                            <Box mx={3}>
                                                <Flex flexDirection="row" alignItems="center">
                                                    <Text fontSize='17px' mr="2">{item.usdvalue}</Text>
                                                    <Text fontSize="12px" fontWeight="700" color="rgba(255,255,255,0.2)">{item.name}</Text>
                                                </Flex>
                                                <Flex flexDirection="row">
                                                    <Image src={percent >= 0 ? "/images/img_graph_up.png":"images/img_graph_down.png"} width="40px" alignSelf="center" />
                                                    <Image src={percent >= 0 ? "/images/ico_rise.png":"/images/ico_down.png"} width="6px" alignSelf="center" />
                                                    <Text alignSelf="center" ml={2} fontSize="11px" color={percent >= 0 ? "#50E2C2":"#E3507A"}>{percent.toFixed(2)}%</Text>
                                                </Flex>
                                            </Box>
                                        </Box>
                                    </GridItem>
                                );
                            })}
                            <GridItem colSpan={1}>
                                <Box display="flex" flexDirection="row" p={3} h="85px" borderWidth="1px" borderRadius="10px" borderStyle="dashed" borderColor="#B1AFCD80" alignItems="center" justifyContent="center">
                                    <Text fontSize="13px">+ Add Currency</Text>
                                </Box>
                            </GridItem>
                        </Grid>

                        <Box display="flex" flexDirection="column" justifyContent="center" m={10}>
                            <Image src="/images/logo_box.png" width="250px" height="250px" alignSelf="center"></Image>
                            <Box display="flex" alignSelf="center" mt={5}>
                                <Text fontSize="14px" color="#6968A6">You just earn</Text>
                                {renderRewardsEarned()}
                                <Text fontSize="14px" color="#6968A6" ml={2}>$DKUMA</Text>
                            </Box>
                            <Box as="button" 
                                height="40px" 
                                width="150px" 
                                borderRadius="8px" 
                                bg="#343261"
                                fontSize="16px"
                                color="#9796CF"
                                alignSelf="center"
                                mt={5}
                            >
                                See history    
                            </Box>
                        </Box>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
        
    );
}

export default Wallet;