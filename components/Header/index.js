import { useEffect, useState } from "react";
import { ethers }              from "ethers";
import { useWallet }           from "use-wallet";
import Link                    from 'next/link';
import {
    Flex,
    Link as CustomLink,
    Text,
    Image,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from "@chakra-ui/core";
import {
    HamburgerIcon
} from "@chakra-ui/icons";
import {
    shortenWalletAddress,
    isWalletConnected,
    getWalletAddress,
} from "../../lib/wallet";
import ConnectModal from "../ConnectModal";
import AccountModal from "../AccountModal";
import styles from '../styles.module.css'
import { useRouter } from "next/router";

const Header = () => {
    const wallet = useWallet();
    const [isOpen, setIsOpen] = useState(false);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(0);
    const router = useRouter();

    const openModal = () => {
        if (!(window.ethereum && wallet && wallet.ethereum)) {
            setIsOpen(true);
            setIsAccountModalOpen(false);
        }
    }

    const openAccountModal = () => {
        setIsOpen(false);
        setIsAccountModalOpen(true);
    }

    const cloesModal = () => {
        setIsOpen(false);
        setIsAccountModalOpen(false);
    }
    
    useEffect(() => {
        if (window.ethereum && wallet && wallet.ethereum) {
            setIsOpen(false);
        }
        var currentRoutes = window.location.pathname;
        console.log({currentRoutes});
    }, [wallet]);

    const getMyWalletAddress = () => {
        const walletAddress = getWalletAddress(wallet);
        return shortenWalletAddress(walletAddress);
    }

    const renderWalletConnection = () => {
        if (!isWalletConnected(wallet))
            return (
                <button className={styles['gradient_but'] + ' ' + styles['connect_but']} onClick={openModal}>Connect Wallet</button>
            )
        return (
            <Flex as="button" cursor="pointer" p="0.5rem 1rem" bg="#502D63" borderRadius="30px" m="auto 0" _hover={{opacity: 0.7}} transition="0.3s" onClick={openAccountModal}>
                <Text fontWeight="bold" fontSize="14px">{getMyWalletAddress()}</Text>
            </Flex>
        )
    }

    const onClose = () => {
        setIsMenuOpen(false);
    }

    useEffect(() => {
        const currentRoute = router.pathname;
        if (currentRoute === '/' || currentRoute ==='/kumabreeder') {
            setSelectedMenu(0);
        } else if (currentRoute === '/wallet') {
            setSelectedMenu(1);
        }
    }, [router])

    return (
        <Flex
            p="0.7rem 2rem"
            w="100%"
            flexDirection="row"
            bg="#20163B"
            position="sticky"
            zIndex={10}
            top="0"
            justifyContent="space-between"
        >
            <Image src="/images/top_logo.png" w="3rem" h="3rem" mr="1rem"/>
            <Image src="/images/logo_text.png" style={{ alignSelf: 'center' }} h="1rem" mr={["2rem", "2rem", "2rem", "6rem"]}/>
            <Flex flexDirection="row" w="90%" display={["none", "none", "flex"]} justifyContent="space-between">
                <Flex flexDirection="row" w={["70%", "60%", "60%", "65%", "45%"]} fontSize={["12px", "12px", "14px", "16px"]} justifyContent="space-between">
                    <Flex>
                        <Image src="/images/ico_home.png" className={styles.ico_menu} mr="1rem"/>
                        <CustomLink m="auto 0" _hover={{opacity: 0.8}} transition="0.3s" _active={{}} _focus={{}} href="https://kumatoken.com" isExternal>
                            <Text fontWeight="bold" color="#6F6C99">Home</Text>
                        </CustomLink>
                    </Flex>

                    <Flex>
                        <Image src={selectedMenu == 1 ? "/images/ico_wallet_selected.png" : "/images/ico_wallet.png"}
                             className={styles.ico_menu} mr="1rem"/>
                        <Link href="/wallet">
                            <CustomLink m="auto 0" _hover={{opacity: 0.8}} transition="0.3s" _active={{}} _focus={{}}>
                                <Text fontWeight="bold" color={selectedMenu == 1 ? "#53B9EA" : "#6F6C99"} _focus={{}}>Wallet</Text>
                            </CustomLink>
                        </Link>
                    </Flex>

                    <Flex>
                        <Image src={selectedMenu == 0 ? "images/ico_share_selected.png" : "/images/ico_share.png"}
                            className={styles.ico_menu} mr="1rem"/>
                        <Link href="/">
                            <CustomLink m="auto 0" _hover={{opacity: 0.8}} transition="0.3s" _active={{}} _focus={{}}
                            >
                                <Text fontWeight="bold" color={selectedMenu == 0 ? "#53B9EA" : "#6F6C99"}>Kuma Breeder</Text>
                            </CustomLink>
                        </Link>
                    </Flex>

                    <Flex>
                        <Image src="/images/ico_dexTool.png" className={styles.ico_menu} mr="1rem"/>
                        <CustomLink m="auto 0" _hover={{opacity: 0.8}} transition="0.3s" _active={{}} _focus={{}}
                        href="https://www.dextools.io/app/uniswap/pair-explorer/0xb4edfec7aa5588786901c63a8338e4b37611b2af" isExternal
                        >
                            <Text fontWeight="bold" color="#6F6C99">Dextools</Text>
                        </CustomLink>
                    </Flex>
                </Flex>
                {renderWalletConnection()}
            </Flex>
            <Flex ml="auto" cursor="pointer" userSelect="none" display={["flex", "flex", "none"]}
                onClick={() => {
                    setIsMenuOpen(true);
                }}
            >
                <HamburgerIcon fontSize="24px" m="auto 0"/>
            </Flex>
            <ConnectModal isOpen={!isWalletConnected(wallet) && isOpen} onClose={cloesModal}/>
            <AccountModal isOpen={isWalletConnected(wallet) && isAccountModalOpen} onClose={cloesModal}/>
            <Drawer
                isOpen={isMenuOpen}
                placement="left"
                onClose={onClose}
            >
                <DrawerOverlay>
                <DrawerContent bg="#1E1A21" color="#fff">
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>
                    <DrawerBody>
                        <Flex flexDirection="column" w="100%" display={["flex", "flex", "none"]}>
                            {renderWalletConnection()}
                            <Link href="/">
                                <CustomLink m="1.5rem 0 0.5rem 0" _hover={{opacity: 0.8}} transition="0.3s" _active={{}} _focus={{}} href="https://kumatoken.com" isExternal>
                                    <Text fontWeight="bold" fontSize="18px">Home</Text>
                                </CustomLink>
                            </Link>
                            <Link href="/wallet">
                                <CustomLink m="0.5rem 0" _hover={{opacity: 0.8}} transition="0.3s" _active={{}} _focus={{}}>
                                    <Text fontWeight="bold" fontSize="18px">Wallet</Text>
                                </CustomLink>
                            </Link>
                            <Link href="/">
                                <CustomLink m="0.5rem 0" _hover={{opacity: 0.8}} transition="0.3s" _active={{}} _focus={{}}
                                >
                                    <Text fontWeight="bold" fontSize="18px">Kuma Breeder</Text>
                                </CustomLink>
                            </Link>
                            <CustomLink m="0.5rem 0" _hover={{opacity: 0.8}} transition="0.3s" _active={{}} _focus={{}}
                                href="https://www.dextools.io/app/uniswap/pair-explorer/0x88362B5Fd4679DB9bc238F3582E1e400284cf08e" isExternal
                            >
                                <Text fontWeight="bold" fontSize="18px">Dextools</Text>
                            </CustomLink>
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </Flex>
    );
};

export default Header;