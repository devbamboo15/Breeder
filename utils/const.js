export const DKUMA_ADDRESS = {
    1: "0x3f5dd1a1538a4f9f82e543098f01f22480b0a3a8",
    4: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110",
};
export const DKUMA_LP_ADDRESS = {
    1: "0xb4edfec7aa5588786901c63a8338e4b37611b2af",
    4: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3",
};
export const WETH_ADDRESS = {
    1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    4: "0xc778417e063141139fce010982780140aa0cd5ab",
};

export const SUPPORT_TOKEN_ADDRESSES = {
    1: [
        {name: "dKUMA", addr: "0x3f5dd1a1538a4f9f82e543098f01f22480b0a3a8", pair: "0xb4edfec7aa5588786901c63a8338e4b37611b2af", image: "dkuma.png"},
        {name: "KUMA", addr: "0xb525ecee288b99216cd481c56b6efbdbe9bf90b5", pair: "0x27fd2f5942049bcd601428c7bcede364180b4b3f", image: "logo.png"},
        {name: "SHIB", addr: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce", pair: "0x811beed0119b4afce20d2583eb608c6f7af1954f", image: "shib.png"},
        {name: "ELON", addr: "0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3", pair: "0x7b73644935b8e68019ac6356c40661e1bc315860", image: "elon.jpeg"},
        {name: "LEASH", addr: "0x27c70cd1946795b66be9d954418546998b546634", pair: "0x874376be8231dad99aabf9ef0767b3cc054c60ee", image: "leash.png"},
        {name: "AKITA", addr: "0x3301ee63fb29f863f2333bd4466acb46cd8323e6", pair: "0xda3a20aad0c34fa742bd9813d45bbf67c787ae0b", image: "akita.png"},
    ],
    4: [
        {name: "KUMA", addr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110", pair: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3", image: "logo.png"},
        {name: "SHIB", addr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110", pair: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3", image: "shib.png"},
        {name: "ELON", addr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110", pair: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3", image: "elon.jpeg"},
        {name: "LEASH", addr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110", pair: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3", image: "leash.png"},
        {name: "AKITA", addr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110", pair: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3", image: "akita.png"},
    ]
};

export const BREEDER_ADDRESSES = {
    1: [
        {poolId: 7, name: "ETH-KUMA", addr: "0x27Fd2F5942049BCD601428c7bceDE364180B4B3F", image: "logo.png", isLp: true, extraAddr: "0xb525ecee288b99216cd481c56b6efbdbe9bf90b5"},
        {poolId: 6, name: "ETH-dKUMA", addr: "0xb4edfec7aa5588786901c63a8338e4b37611b2af", image: "dkuma.png", isLp: true, extraAddr: "0x3f5dd1a1538a4f9f82e543098f01f22480b0a3a8"},
        {poolId: 8, name: "ETH-SHIB", addr: "0x811beEd0119b4AfCE20D2583EB608C6F7AF1954f", image: "shib.png", isLp: true, extraAddr: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"},
        {poolId: 9, name: "ETH-LEASH", addr: "0x874376Be8231DAd99AABF9EF0767b3cc054c60eE", image: "leash.png", isLp: true, extraAddr: "0x27c70cd1946795b66be9d954418546998b546634"},
        {poolId: 10, name: "ETH-AKITA", addr: "0xDA3A20aaD0C34fA742BD9813d45Bbf67c787aE0b", image: "akita.png", isLp: true, extraAddr: "0x3301ee63fb29f863f2333bd4466acb46cd8323e6"},
        {poolId: 11, name: "ETH-ELON", addr: "0x7B73644935b8e68019aC6356c40661E1bc315860", image: "elon.jpeg", isLp: true, extraAddr: "0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3"},
        //{poolId: 0, name: "dKUMA", addr: "0x3f5dd1a1538a4f9f82e543098f01f22480b0a3a8", image: "dkuma.png", extraAddr: "0xb4edfec7aa5588786901c63a8338e4b37611b2af"},
        {poolId: 1, name: "KUMA", addr: "0xb525ecee288b99216cd481c56b6efbdbe9bf90b5", image: "logo.png", extraAddr: "0x27fd2f5942049bcd601428c7bcede364180b4b3f"},
        {poolId: 2, name: "SHIB", addr: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce", image: "shib.png", extraAddr: "0x811beed0119b4afce20d2583eb608c6f7af1954f"},
        {poolId: 3, name: "LEASH", addr: "0x27c70cd1946795b66be9d954418546998b546634", image: "leash.png", extraAddr: "0x874376be8231dad99aabf9ef0767b3cc054c60ee"},
        {poolId: 4, name: "AKITA", addr: "0x3301ee63fb29f863f2333bd4466acb46cd8323e6", image: "akita.png", extraAddr: "0xda3a20aad0c34fa742bd9813d45bbf67c787ae0b"},
        {poolId: 5, name: "ELON", addr: "0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3", image: "elon.jpeg", extraAddr: "0x7b73644935b8e68019ac6356c40661e1bc315860"},
    ],
    4: [
        {poolId: 1, name: "KUMA", addr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110", image: "logo.png", extraAddr: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3"},
        // {poolId: 1, name: "SHIB", addr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110", image: "shib.png", extraAddr: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3"},
        // {poolId: 1, name: "ELON", addr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110", image: "elon.jpeg", extraAddr: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3"},
        // {poolId: 1, name: "LEASH", addr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110", image: "leash.png", extraAddr: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3"},
        // {poolId: 1, name: "AKITA", addr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110", image: "akita.png", extraAddr: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3"},
        {poolId: 0, name: "ETH-KUMA", addr: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3", image: "logo.png", isLp: true, extraAddr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110"},
        // {poolId: 0, name: "ETH-SHIB", addr: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3", image: "shib.png", isLp: true, extraAddr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110"},
        // {poolId: 0, name: "ETH-ELON", addr: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3", image: "elon.jpeg", isLp: true, extraAddr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110"},
        // {poolId: 0, name: "ETH-LEASH", addr: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3", image: "leash.png", isLp: true, extraAddr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110"},
        // {poolId: 0, name: "ETH-AKITA", addr: "0x0F2f2d1188f5095E6d0C06b2d448cC033f283CE3", image: "akita.png", isLp: true, extraAddr: "0x1BFc4D6B40591B8c8E1Ef8A36e4f15d54D760110"},
    ]
};

export const MASTERCHEF_ADDRESS = {
    1: "0xa206D322829e04fb5acD36F289eD5367AC3E73e4",
    4: "0x150ff6d4A1A12f8A75cc3514616cC9eeb1ca4eBd"
}