import React from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js/auto';

import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


export function ChartMaker(parms) {

    const params = parms.params;

    const debug = (<textarea rows={300} cols={100}>
        {JSON.stringify(params, null, 2)}
    </textarea>);

    let xAxisMax = 0;
    let compareValues = Array.from(new Set(params.fileDataObj.map((line) => line[params.compare])));

    const dataSets = compareValues.map((val, index) => {
        let myDataSet = params.fileDataObj.filter((row) => {
            return row[params.compare] === val;
        });

        xAxisMax = myDataSet[myDataSet.length-1][params.xAxis] > xAxisMax ? myDataSet[myDataSet.length-1][params.xAxis] : xAxisMax;

        return {
            label: val,
            data: myDataSet.map((row) => row[params.measure]),
            borderColor: getBrushColor(index, val),
            backgroundColor: getBrushColor(index, val)
        };
    });
    const labels = Array.from({length: xAxisMax}, (_, i) => i + 1);

    const options = {
        responsive: true,
        plugins: {
            legend: {position: 'top'},
            title: {display: true, text: params.measure + ' vs ' + params.xAxis},
        },

        scales: {
            y: {
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: (label) => label + ' ms',
                }
            }
        }
    };

    const resultsData = {
        labels,
        datasets: dataSets
    };

    return (
        (<Line
            options={options}
            data={resultsData} />)
    );

}

function getBrushColor(index, val) {

    if(val === 'mysql') {
        return 'goldenrod';
    }
    if(val === 'dynamodb') {
        return 'dodgerblue';
    }

    const colorList = ['purple', 'hotpink', 'orange', 'green'];
    return colorList[index];

}
