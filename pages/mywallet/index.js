import { useEffect, useState }  from "react";
import { useWallet }            from "use-wallet";
import { ethers }               from "ethers";
import { useRouter }            from "next/router";
import {
  Flex,
  Box,
  Text,
  Image,
} from "@chakra-ui/core";
import Avatar           from '@material-ui/core/Avatar';
import AllocationChart  from "../../components/AllocationChart";
import PieChartIcon     from '@material-ui/icons/PieChart';
import { getBalance }   from "../../contracts/erc20";
import {
  DKUMA_ADDRESS,
  SUPPORT_TOKEN_ADDRESSES,
} from "../../utils/const";
import {
  getWalletAddress
} from "../../lib/wallet";
import {
  formatNumber,
  getTokenPrice,
} from "../../lib/helper";

const MyWallet = () => {
  // define hooks
  const router = useRouter();
  const wallet = useWallet();
  const [kumaBalance, setKumaBalance] = useState(0);
  const [connected, setConnected] = useState(false);
  const [assets, setAssets] = useState([]);
  const [usdValue, setUsdValue] = useState(0);

  useEffect(() => {
    loadBalances();
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
  }

  useEffect(() => {
    if (!connected && wallet && wallet.ethereum) {
      setConnected(true);
      loadBalances();
    }
  }, [wallet]);

  const onKumaBreeder = () => {
    router.push("/kumabreeder")
  }

  return (
    <Flex flexDirection="column">
      <Text fontSize={["24px", "28px", "34px", "40px"]} fontFamily="Fugaz One" mb="3rem" textAlign="center" mt="2rem">My Wallet</Text>
      <Flex maxW="70rem" w="100%" flexDirection={["column", "column", "column", "row"]} justifyContent="space-between" m="0 auto">
        <Flex
          flexDirection="column" p="1rem 2rem" w={["calc(100% - 2rem)", "calc(100% - 2rem)", "calc(100% - 2rem)", "calc(65% - 4rem)"]} ml="1rem"
          borderRadius="10px" boxShadow="0 6px 4px 0px rgba(180, 180, 180, 0.1)" bg="#1E1A21"
        >
          <Flex flexDirection="row" justifyContent="space-between">
              <Flex flexDirection="column">
                  <Text fontSize={["12px", "14px", "14x", "16px"]} fontWeight="600" color="#6b778c">USD Valuation</Text>
                  <Text fontSize={["18px", "28px", "28px", "36px"]} fontWeight="600" color="#fff">$ {formatNumber(usdValue, 4)}</Text>
              </Flex>
              <Avatar style={{color: "#fff", backgroundColor: "#502D63", width: "3.5rem", height: "3.5rem", margin: "auto 0"}}>
                  <PieChartIcon style={{fontSize: "30px"}}/>
              </Avatar>
          </Flex>
          <Box w="100%" h="1px" bg="#505050" m="0.5rem 0 2rem 0"></Box>
          <AllocationChart assets={assets} totalUSD={usdValue}/>
        </Flex>
        <Flex
          w={["calc(100% - 2rem)", "calc(100% - 2rem)", "calc(100% - 2rem)%", "35%"]} flexDirection="column" p="2rem" m={["2rem 1rem", "2rem 1rem", "2rem 1rem", "0 1rem"]}
          borderRadius="10px" boxShadow="0 6px 4px 0px rgba(180, 180, 180, 0.1)" bg="#1E1A21"
        >
          <Text fontSize={["20px", "20px", "24px", "30px"]} fontWeight="bold">Balance</Text>
          <Flex flexDirection="row" mt="1rem">
            <Box border="1px solid #502D63" borderRadius="10px">
              <Image src="/images/logo.png" w="5rem" minW="5rem"/>
            </Box>
            <Flex flexDirection="column" justifyContent="center" ml="1rem">
              <Text fontSize={["12px", "14px", "14px", "18px"]} fontWeight="500">{kumaBalance}</Text>
              <Text fontSize={["14px", "18px", "18px", "24px"]} fontWeight="500" color="#ccc">dKuma</Text>
            </Flex>
          </Flex>
          <Text fontSize={["20px", "20px", "24px", "30px"]} fontWeight="bold" mt="2rem">Rewards</Text>
          <Flex flexDirection="row" mt="1rem">
            <Box border="1px solid #502D63" borderRadius="10px">
              <Image src="/images/logo.png" w="5rem" minW="5rem"/>
            </Box>
            <Flex flexDirection="column" justifyContent="center" ml="1rem">
              <Text fontSize={["12px", "14px", "14px", "18px"]} fontWeight="500">0</Text>
              <Text fontSize={["14px", "18px", "18px", "24px"]} fontWeight="500" color="#ccc">dKuma</Text>
            </Flex>
          </Flex>
          <Flex cursor="pointer" p="0.8rem 1rem" bg="#502D63" borderRadius="10px" mt={["2rem", "2rem", "2rem", "auto"]}
            _hover={{opacity: 0.9}} transition="0.3s" onClick={onKumaBreeder}>
            <Text fontWeight="700" fontSize={["12px", "14px", "14px", "18px"]} m="0 auto">Kuma Breeder</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MyWallet;
