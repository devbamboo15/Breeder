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

const ConnectModal = (props) => {
    const wallet = useWallet();
    const onMetamask = (connector) => {
        wallet.connect(connector);
        window.localStorage.setItem("KUMA", "auto")
    }
    const onWalletConnect = (connector) => {
        wallet.connect(connector).then(res => {
            if (res)
                window.localStorage.setItem("KUMA", "auto")
        })
        .catch(e => {

        });
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
                    <Text color="#fff" fontSize="20px" fontWeight="bold">Connect Wallet</Text>
                </Box>
                <Box
                    p="1.5rem"
                    bg="gray.300"
                    borderBottomRadius="10px"
                    bg="#1b1333"
                >
                    <Flex
                        flexDirection="row"
                        p="1rem"
                        transition="0.3s"
                        borderRadius="16px"
                        bg="#343261"
                        alignItems="flex-start"
                    >
                        <Checkbox isDisabled mt="0.25rem" iconColor="#fff"/>
                        <Box ml="0.5rem" fontSize="16px" fontWeight="500" color="#fff">I have read, understand, and agree to the <Text as="u" cursor="pointer" color="#13B0E5" href="#">Terms of Service.</Text></Box>
                    </Flex> 
                    <Flex
                        flexDirection="row"
                        cursor="pointer"
                        onClick={() => onMetamask("metamask")}
                        p="1rem"
                        transition="0.3s"
                        _hover={{
                            bg: "#ccc",
                            transition: "0.3s"
                        }}
                        borderRadius="16px"
                        bg="#343261"
                        mt="1rem"
                        maxH="4rem"
                    >
                        <Image src="/images/meta-mask.png" w="2rem" m="auto 0"/>
                        <Flex flexDirection="column" m="auto 0 auto 2rem">
                            <Text fontSize="16px" fontWeight="500" color="#9796CF">MetaMask</Text>
                        </Flex>
                    </Flex>
                    <Flex
                        flexDirection="row"
                        cursor="pointer"
                        onClick={() => onWalletConnect("walletconnect")}
                        p="1rem"
                        transition="0.3s"
                        _hover={{
                            bg: "#ccc",
                            transition: "0.3s"
                        }}
                        borderRadius="16px"
                        bg="#343261"
                        mt="1rem"
                        maxH="4rem"
                    >
                        <Image src="/images/binance.png" w="2rem" m="auto 0"/>
                        <Flex flexDirection="column" m="auto 0 auto 2rem">
                            <Text fontSize="16px" fontWeight="500" color="#9796CF">Binance Chain Wallet</Text>
                        </Flex>
                    </Flex>
                    <Flex
                        flexDirection="row"
                        cursor="pointer"
                        onClick={() => onWalletConnect("walletconnect")}
                        p="1rem"
                        transition="0.3s"
                        _hover={{
                            bg: "#ccc",
                            transition: "0.3s"
                        }}
                        borderRadius="16px"
                        bg="#343261"
                        mt="1rem"
                        maxH="4rem"
                    >
                        <Image src="/images/wallet.png" w="2rem" m="auto 0"/>
                        <Flex flexDirection="column" m="auto 0 auto 2rem">
                            <Text fontSize="16px" fontWeight="500" color="#9796CF">WalletConnect</Text>
                        </Flex>
                    </Flex>
                    <Flex
                        flexDirection="row"
                        cursor="pointer"
                        onClick={() => onWalletConnect("walletconnect")}
                        p="1rem"
                        transition="0.3s"
                        _hover={{
                            bg: "#ccc",
                            transition: "0.3s"
                        }}
                        borderRadius="16px"
                        bg="#343261"
                        mt="1rem"
                        maxH="4rem"
                    >
                        <Image src="/images/portis.png" w="1.5rem" m="auto 0"/>
                        <Flex flexDirection="column" m="auto 0 auto 2rem">
                            <Text fontSize="16px" fontWeight="500" color="#9796CF">Portis</Text>
                        </Flex>
                    </Flex>
                </Box>
            </ModalContent>
        </Modal>
    )
}

export default ConnectModal;
