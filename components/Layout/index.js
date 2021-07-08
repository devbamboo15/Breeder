import { useEffect }          from "react";
import { useRouter }          from "next/router";
import { Box }               from "@chakra-ui/core";
import Header                 from "../Header";
import useDidMount            from "../../hooks/useDidMount";
import { scrollToPosition }   from "../../lib/scroll";
import { useWallet }          from "use-wallet";

const Layout = ({ children }) => {
    const didMount = useDidMount();
    const router = useRouter();
    const { asPath } = router;

    const wallet = useWallet();
    
    /**
     * Scroll to top on each route change using `asPath` (resolved path),
     * not `pathname` (may be a dynamic route).
     */
    useEffect(() => {
      if (didMount) {
        scrollToPosition();
      }
    }, [asPath]);
  
    useEffect(() => {
      const status = window.localStorage.getItem("KUMA");
      if (window.ethereum && status === "auto")
        wallet.connect("injected");
    }, []);

    useEffect(() => {
      const status = window.localStorage.getItem("KUMA");
      if (window.ethereum && wallet && !wallet.ethereum && status === "auto") {
        wallet.connect("injected");
      }
    }, [wallet]);
  
    return (
        <Box 
          w="100%"
          h="100vh"
          overflow="auto"
          bg="#1b1333"
          color="#fff"
        >
            <Header/>
            {children}
        </Box>
    );
  };
  
  export default Layout;