import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from '@chakra-ui/core';
const styles = {
  global: props => ({
    body: {
      color: mode('gray.100', 'black')(props),
      bg: mode(
        'radial-gradient(circle, rgba(19,10,2,1) 0%, rgba(19,10,0,1) 12%, rgba(30,26,33,1) 100%)',
        'radial-gradient(circle, rgba(19,10,2,1) 0%, rgba(19,10,0,1) 12%, rgba(30,26,33,1) 100%)',
      )(props),
    },
  }),
};
const colors = {
}
const components = {
};

const theme = extendTheme({
  components,
  styles,
  colors
});

export default theme;