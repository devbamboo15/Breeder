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
    Link
} from "@chakra-ui/core";
import {
    CloseIcon,
} from "@chakra-ui/icons";

const ConnectModal = (props) => {
    const switchNetwork = async () => {
        // const params = [{ chainId: '0x1' }]
        // await window.ethereum.request({
        //   method: 'wallet_switchEthereumChain',
        //   params: params
        // })
        props.onClose();
    }
    return (
        <Modal size="md" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay/>
            <ModalContent borderRadius="5px">
                <IconButton
                    color="white"
                    icon={<CloseIcon/>}
                    position="absolute"
                    top="0.5rem"
                    right="0.5rem"
                    onClick={props.onClose}
                    bg="none"
                    _active={{}}
                    _focus={{}}
                    _hover={{}}
                />
                <Box p="1rem" bg="#502D63" borderTopRadius="10px">
                    <Text color="#fff" fontSize="16px" fontWeight="bold" textAlign="center">Switch Network</Text>
                </Box>
                <Box
                    p="1rem"
                    bg="gray.300"
                    borderBottomRadius="10px"
                >
                    <Text>Please switch to Ethereum Mainnet</Text>
                    <Flex cursor="pointer" p="0.5rem 1rem" bg="#502D63" borderRadius="30px" m="1rem 0" _hover={{opacity: 0.9}} transition="0.3s"  onClick={switchNetwork}>
                        <Text fontWeight="bold" fontSize="14px" color="#fff" m="auto">Switch</Text>
                    </Flex>
                </Box>
            </ModalContent>
        </Modal>
    )
}

export default ConnectModal;
