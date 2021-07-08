import { useWallet } from "use-wallet";
import {
    Flex,
    Box,
    Image,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    IconButton,
    Link,
    Checkbox
} from "@chakra-ui/core";
import {
    CloseIcon,
} from "@chakra-ui/icons";
import { ethers }              from "ethers";
import { getWalletAddress, shortenWalletAddress } from "../../lib/wallet";

const AccountModal = (props) => {
    const wallet = useWallet();

    const viewOnEtherscan = async () => {
        const walletAddress = getWalletAddress(wallet);
        const provider = new ethers.providers.Web3Provider(wallet.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId === 1) {
            window.open("https://etherscan.io/address/" + walletAddress);
        } else {
            window.open("https://rinkeby.etherscan.io/address/" + walletAddress);
        }

    }

    const onDisconnect = () => {
        window.localStorage.setItem("KUMA", "disable");
        wallet.reset();
    }

    const getMyWalletAddress = () => {
        const walletAddress = getWalletAddress(wallet);
        return walletAddress?shortenWalletAddress(walletAddress).toUpperCase():'';
    }

    return (
        <Modal size="sm" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay/>
            <ModalContent borderRadius="18px" bg="#1b1333">
                <IconButton
                    color="white"
                    icon={<CloseIcon/>}
                    position="absolute"
                    top="1rem"
                    right="0.5rem"
                    onClick={props.onClose}
                    bg="none"
                    fontSize="0.6rem"
                    _active={{}}
                    _focus={{}}
                    _hover={{}}
                />
                <Box ml="1.5rem" mt="1.5rem" bg="#1b1333" borderTopRadius="18px">
                    <Text color="#fff" fontSize="20px" fontWeight="bold">Account</Text>
                </Box>
                <Flex flexDirection="column" p="1.5rem">
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Box bg="#1b1333" borderTopRadius="18px">
                            <Text color="#fff" fontSize="16px" fontWeight="bold">{getMyWalletAddress()}</Text>
                        </Box>
                        <Flex flexDirection="row">
                            <Box as="button" display="flex" w="40px" h="40px" bg="#343261" borderRadius="12px" justifyContent="center" onClick={viewOnEtherscan}>
                                <Image src="/images/view_ether.png" alignSelf="center"></Image>
                            </Box>
                            <Box as="button" display="flex" w="40px" h="40px" bg="#343261" borderRadius="12px" justifyContent="center" ml="0.5rem">
                                <Image src="/images/copy.png" alignSelf="center"></Image>
                            </Box>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex flexDirection="column" p="0 1.5rem">
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Box as="button" w="45%" h="50px" display="flex" bg="#343261" borderRadius="12px" justifyContent="center" alignItems="center">
                            <Flex justifyContent="space-around">
                                <Image src="/images/switch.png" alignSelf="center"></Image>
                                <Text fontSize="12px" fontWeight="700" color="#fff" ml="0.5rem">Switch Wallet</Text>
                            </Flex>
                        </Box>
                        <Box as="button" w="45%" h="50px" display="flex" bg="linear-gradient(278.76deg, #309AFF 1.92%, #38EFC3 111.91%)" borderRadius="12px" justifyContent="center" alignItems="center" ml="0.5rem" onClick={onDisconnect}>
                            <Text fontSize="14px" fontWeight="700" color="#fff">Disconnect Wallet</Text>
                        </Box>
                    </Flex>
                </Flex>
                <Flex flexDirection="column" p="1.5rem">
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Box bg="#1b1333" borderTopRadius="18px">
                            <Text color="#fff" fontSize="14px" fontWeight="700">Recent Transactions</Text>
                        </Box>
                        <Flex flexDirection="row">
                            <Box as="button" fontSize="12px" fontWeight="700" color="#13B0E5">
                                Clear All
                            </Box>
                        </Flex>
                    </Flex>
                </Flex>
                {/* <Flex flexDirection="column" p="0 1.5rem 1.5rem 1.5rem">
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Flex flexDirection="row">
                            <Text color="#fff" fontSize="16px" fontWeight="400">Stake</Text>
                            <Image src="/images/ico_up.png" alignSelf="center" ml="1rem"></Image>
                        </Flex>
                        <Image src="/images/ico_check.png" alignSelf="center"></Image>
                    </Flex>
                </Flex>
                <Flex flexDirection="column" p="0 1.5rem 1.5rem 1.5rem">
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Flex flexDirection="row">
                            <Text color="#fff" fontSize="16px" fontWeight="400">Approve DEXDLP</Text>
                            <Image src="/images/ico_up.png" alignSelf="center" ml="1rem"></Image>
                        </Flex>
                        <Image src="/images/ico_check.png" alignSelf="center"></Image>
                    </Flex>
                </Flex>
                <Flex flexDirection="column" p="0 1.5rem 1.5rem 1.5rem">
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Flex flexDirection="row">
                            <Text color="#fff" fontSize="16px" fontWeight="400">ADD Liquidity</Text>
                            <Image src="/images/ico_up.png" alignSelf="center" ml="1rem"></Image>
                        </Flex>
                        <Image src="/images/ico_check.png" alignSelf="center"></Image>
                    </Flex>
                    <Flex flexDirection="column" mt="0.5rem">
                        <Flex flexDirection="row" alignItems="center">
                            <Text color="#8B8CA7" fontSize="12px" fontWeight="400">7.4812029</Text>
                            <Text color="#8B8CA7" fontSize="12px" fontWeight="400" ml="0.5rem">DEX</Text>
                        </Flex>
                        <Flex flexDirection="row" alignItems="center">
                            <Text color="#8B8CA7" fontSize="12px" fontWeight="400">5812.291025829</Text>
                            <Text color="#8B8CA7" fontSize="12px" fontWeight="400" ml="0.5rem">MTV</Text>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex flexDirection="column" p="0 1.5rem 1.5rem 1.5rem">
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Flex flexDirection="row">
                            <Text color="#fff" fontSize="16px" fontWeight="400">Approve DEX</Text>
                            <Image src="/images/ico_up.png" alignSelf="center" ml="1rem"></Image>
                        </Flex>
                        <Image src="/images/ico_check.png" alignSelf="center"></Image>
                    </Flex>
                </Flex>
                <Flex flexDirection="column" p="0 1.5rem 1.5rem 1.5rem">
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Flex flexDirection="row">
                            <Text color="#fff" fontSize="16px" fontWeight="400">Approve MTV</Text>
                            <Image src="/images/ico_up.png" alignSelf="center" ml="1rem"></Image>
                        </Flex>
                        <Image src="/images/ico_check.png" alignSelf="center"></Image>
                    </Flex>
                </Flex>
                <Flex flexDirection="column" p="0 1.5rem 1.5rem 1.5rem">
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Flex flexDirection="row">
                            <Text color="#fff" fontSize="16px" fontWeight="400">Swap</Text>
                            <Image src="/images/ico_up.png" alignSelf="center" ml="1rem"></Image>
                        </Flex>
                        <Image src="/images/ico_close.png" alignSelf="center"></Image>
                    </Flex>
                    <Flex flexDirection="column" mt="0.5rem">
                        <Flex flexDirection="row" alignItems="center">
                            <Text color="#8B8CA7" fontSize="12px" fontWeight="400">0.045125</Text>
                            <Text color="#8B8CA7" fontSize="12px" fontWeight="400" ml="0.5rem">BNB to</Text>
                            <Text color="#8B8CA7" fontSize="12px" fontWeight="400" ml="0.5rem">2132.51853983</Text>
                            <Text color="#8B8CA7" fontSize="12px" fontWeight="400" ml="0.5rem">MTV</Text>
                        </Flex>
                    </Flex>
                </Flex> */}
            </ModalContent>
        </Modal>
    )
}

export default AccountModal;
