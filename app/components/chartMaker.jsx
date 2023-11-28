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

    const debug = (<textarea rows={300} cols={100}>
        {JSON.stringify(params, null, 2)}
    </textarea>);

    let xAxisMax = 0;
    let compareValues = Array.from(new Set(params.fileDataObj.map((line) => line['test'])));
    const annotations = {};
    let statsRows = [];

    const dataSets = compareValues.map((val, index) => {
        let myDataSet = params.fileDataObj.filter((row) => {
            return row['test'] === val;
        });

        xAxisMax = myDataSet[myDataSet.length-1][params.xAxis] > xAxisMax ? myDataSet[myDataSet.length-1][params.xAxis] : xAxisMax;

        let setStats =  summarize(myDataSet.map((row) => parseInt(row[params.measure])));

        let statsRow = {
            name: val,
            targetTable: myDataSet[0].targetTable,
            avg: setStats.avg
        };
        statsRows.push(statsRow);

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
            y: {ticks: {callback: (label) => label + ' ms',}}
        }
    };

    const resultsData = {
        labels,
        datasets: dataSets
    };

    return (
        (<div>
            <Line
            options={options}
            data={resultsData} />
            <br/>
            <table className='experimentResultSummaryTable'><thead>
                <tr><th>name</th><th>table</th><th>avg latency (ms)</th></tr>
            </thead>
            <tbody>
                {statsRows.map((row, index) => {
                    return (<tr key={index} >

                        <td>{row.name}</td>
                        <td>{row.targetTable}</td>
                        <td>{parseInt(row.avg)}</td>
                    </tr>);
                })}
            </tbody></table>
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
