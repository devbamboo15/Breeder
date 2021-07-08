import React, { useEffect } from 'react'
import Chart from 'react-apexcharts'

const chartData = {
 
    series: [{
        data: []
    }],
    options: {
        chart: {
            id: 'area-datetime',
            type: 'area',
            height: 400,
            zoom: {
                autoScaleYaxis: true
            },
            toolbar: {
                show: false,
            }
        },
        annotations: {
            yaxis: [{
                y: 30,
                borderColor: '#999',
                label: {
                    show: true,
                    text: 'Support',
                    style: {
                        color: "#fff",
                        background: '#00E396'
                    }
                }
            }],
            xaxis: [{
                x: new Date('14 Nov 2012').getTime(),
                borderColor: '#999',
                yAxisIndex: 0,
                label: {
                    show: true,
                    text: 'Rally',
                    style: {
                        color: "#fff",
                        background: '#775DD0'
                    }
                }
            }]
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
            style: 'hollow',
        },
        xaxis: {
            type: 'datetime',
            min: new Date('01 Mar 2012').getTime(),
            tickAmount: 6,
            labels: {
                style: {
                    colors: ['#6b689c'],
                }
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: ['#6b689c'],
                },
            },
            forceNiceScale: true,
            decimalsInFloat: 9,
        },
        tooltip: {
            enabled: false,
            x: {
                format: 'dd MMM yyyy'
            },
            theme: 'dark',
        },
        fill: {
            type: 'gradient',
            colors: ['#B93185'],
            gradient: {
                shade: 'light',
                shadeIntensity: 0,
                opacityFrom: 0.6,
                opacityTo: 0,
            }
        },
        colors: ['#8b3977'],
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        grid: {
            show: true,
            xaxis: {
                lines: {
                    show: true,
                }
            },
            yaxis: {
                lines: {
                    show: true,
                }
            },
            borderColor: '#1f183a',
        }
    },

    selection: 'one_year',
};

const PriceChart = ({ chartCoin, chartPeriod, priceData }) => {

    useEffect(() => {
        if (priceData)
            ApexCharts.exec('area-datetime', 'updateSeries', [{data: priceData.prices}]);
        switch(chartPeriod) {
            case '24H':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date().getTime() - 1000*60*60*24,
                    new Date().getTime()
                );
                break;
            case '1W':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date().getTime() - 1000*60*60*24*7,
                    new Date().getTime()
                );
                break;
            case '1M':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date().getTime() - 1000*60*60*24*31,
                    new Date().getTime()
                );
                break;
            default:
        }
    }, [chartPeriod, priceData && priceData.length > 0]);

	return  (
        <Chart options={chartData.options} series={chartData.series} type="area"/>
	);
};

export default PriceChart;