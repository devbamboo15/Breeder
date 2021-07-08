// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const baseURL = 'https://api.coingecko.com';

export default (req, res) => {
  res.status(200).json({ name: 'John Doe' })
}

export const getPriceData = async (req) => {
  const url = `${baseURL}/api/v3/coins`;
  const response = await fetch(`${url}/${req.id}/market_chart/range?vs_currency=usd&from=${req.from}&to=${req.to}`);
  const priceData = await response.json();
  // Create the order
  return priceData;
};

export const getMarketCap = async () => {
  const url = `${baseURL}/api/v3/coins`;
  const response = await fetch(`${url}/markets?vs_currency=usd&ids=kuma-inu&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
  const marketData = await response.json();
  console.log({marketData});
  console.log("price and percent ===>", marketData[0].current_price, marketData[0].market_cap_change_percentage_24h);
  return {
    price: marketData[0].current_price,
    percentage: marketData[0].market_cap_change_percentage_24h
  };
}