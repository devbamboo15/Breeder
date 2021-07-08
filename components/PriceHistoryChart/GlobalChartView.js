import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import dynamic from 'next/dynamic'

import DarkOptionButton from './Buttons/DarkOptionButton'
import TextOptionButton from './Buttons/TextOptionButton'
import { getPriceData } from '../../pages/api/hello'

const PriceChart = dynamic(() => import('./PriceChart'), {
    ssr: false
});

const req = {
    id: 'kuma-inu',
    from: new Date().getTime() / 1000 - 60*60*24*61,
    to: new Date().getTime() / 1000,
};

const GlobalChartView = (props) => {
    const { assets, totalUSD } = props;
    const [ chartCoin, setChartCoin ] = useState('$KUMA');
    const [ chartPeriod, setChartPeriod ] = useState('24H');
    const [ priceData, setPriceData ] = useState(null);

    const coinChanged = (coin) => {
        setChartCoin(coin);
    };

    const goHome = () => {
        window.location.href="https://kumatoken.com";
    }
    
    const timeChanged = (period) => {
        setChartPeriod(period);
    };

    useEffect(async () => {
        const prices = await getPriceData(req);
        setPriceData(prices);
    }, [chartCoin, chartPeriod]);

    return (
        <div className={styles.globalChartView}>
            <div className={styles.chart__detail_select}>
                <div className={styles.chart__coin_select}>
                    <DarkOptionButton img="/images/dot_dKUMA1.png" onClick={coinChanged} selected={chartCoin === '$KUMA'}>$KUMA</DarkOptionButton>
                    <DarkOptionButton img="/images/dot_dKUMA2.png" href="https://kumatoken.com" onClick={goHome} selected={chartCoin === '$dKUMA'}>$dKUMA</DarkOptionButton>
                </div>
                <div className={styles.chart__period_select}>
                    <TextOptionButton onClick={timeChanged} selected={chartPeriod === '24H'}>24H</TextOptionButton>
                    <div style={{ height: '25px', width: '2px', backgroundColor: '#393357' }}/>
                    <TextOptionButton onClick={timeChanged} selected={chartPeriod === '1W'}>1W</TextOptionButton>
                    <div style={{ height: '25px', width: '2px', backgroundColor: '#393357' }}/>
                    <TextOptionButton onClick={timeChanged} selected={chartPeriod === '1M'}>1M</TextOptionButton>
                </div>
            </div>
            {/* <div className={styles.chart__overview}>
                <p className={styles.chart__overview_price}>+{totalUSD} USDC</p>
                <p className={styles.chart__overview_period}>Past {chartPeriod === '24H'?'24 hours' : chartPeriod==='1W'?'a week':'a month'}</p>
            </div> */}
            <PriceChart chartCoin={chartCoin} chartPeriod={chartPeriod} priceData={priceData} />
        </div>
    );
};

export default GlobalChartView;