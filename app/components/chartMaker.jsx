import React from "react";
import annotationPlugin from 'chartjs-plugin-annotation';


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
    Legend,
    annotationPlugin
);


export function ChartMaker(parms) {

    const params = parms.params;
    let xAxisMax = 0;
    let yAxisUnits = params.measure === 'latency' ? ' ms' : null;
    let xAxisLabel;
    let yAxisLabel;

    const annotations = {};
    let latencyStatsRows = [];
    let velocityStatsRows = [];

    // split dataset into sections by the (Experiment.test) test value
    let compareValues = Array.from(new Set(params.fileDataObj.map((line) => line['test'])));

    const dataSets = compareValues.map((val, index) => {
        let myDataSet = params.fileDataObj.filter((row) => {
            let subFilter = true;
            if(params['yAgg'] === 'actual') {
                if(params['measure'] === 'latency') {
                    yAxisLabel = 'client latency';
                    xAxisLabel = 'request number';
                }
                return row['test'] === val;
            }

            if(params['measure'] === 'velocity') {
                yAxisLabel = 'requests per second';
                xAxisLabel = 'second';
            }

            return row['test'] === val && row[params['measure']]; // skip any that don't have the measure (like final velocity)
        });

        xAxisMax = myDataSet[myDataSet.length-1][params.xAxis] > xAxisMax ? myDataSet[myDataSet.length-1][params.xAxis] : xAxisMax;

        let setStats =  summarize(myDataSet.map((row) => parseInt(row[params.measure])));

        let statsRow = {
            name: val,
            targetTable: myDataSet[0].targetTable,
            avg: setStats.avg
        };
        latencyStatsRows.push(statsRow);

        let annotation = {
            type: 'line',
            borderColor: getBrushColor(index, val),
            borderDash: [6, 6],
            borderDashOffset: 0,
            borderWidth: 3,

            label: {
                display: true,
                padding: 4,
                content:  val + ' avg ' + parseInt(setStats.avg) + ' ms',
                position: 'end',
                backgroundColor: getBrushColor(index, val),

                xAdjust: 150 * index * -1,
                yAdjust: 0,
                z:1
            },
            scaleID: 'y',
            value: setStats.avg
        };
        // annotations[annotation.type + '-' + index] = annotation;

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
        // stepped: 'middle',
        plugins: {
            legend: {position: 'top'},
            title: {display: true, text: params.measure + ' vs ' + params.xAxis},
            annotation: {annotations: annotations}
        },
        scales: {
            y: {
                ticks: {callback: (label) => label + yAxisUnits},
                title: {display: true, text: yAxisLabel}
            },
            x: {title: {display: true, text: xAxisLabel}}
        }
    };

    const resultsData = {
        labels,
        datasets: dataSets
    };

    let latencySummaryTable = (
        <table className='experimentResultSummaryTable'><thead>
        <tr><th>name</th><th>table</th><th>avg latency (ms)</th></tr>
        </thead>
            <tbody>
            {latencyStatsRows.map((row, index) => {
                return (<tr key={index} >

                    <td>{row.name}</td>
                    <td>{row.targetTable}</td>
                    <td>{parseInt(row.avg)}</td>
                </tr>);
            })}
            </tbody></table>
    );

    let velocitySummaryTable = (
        <table className='experimentResultSummaryTable'><thead>
        <tr><th>name</th><th>table</th><th>avg latency (ms)</th></tr>
        </thead>
            <tbody>
            {latencyStatsRows.map((row, index) => {
                return (<tr key={index} >
                    <td>{row.name}</td>
                    <td>{row.targetTable}</td>
                    <td>{parseInt(row.avg)}</td>
                </tr>);
            })}
            </tbody></table>
    );

    return (
        (<div>
            <Line
            options={options}
            data={resultsData} />
            <br/>
            {params['measure'] === 'latency' ? latencySummaryTable : null}
        </div>)
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

function summarize(arr) {
    const sum = arr.reduce((total, item) => total + item);
    const avg = sum / arr.length;

    const stats = {
        sum: sum,
        avg: avg
    }
    return stats;

}
