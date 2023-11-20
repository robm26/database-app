import React from "react";
import {
    useLoaderData, Link, Outlet, useLocation, Form, useFetcher, useActionData
}  from "@remix-run/react";

import * as fs from 'node:fs/promises';
import { ClientOnly } from 'remix-utils';

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

import {csv} from 'csvtojson';

const experimentResultsPublicFolder = 'experiments';
const experimentResultsRoot = 'public/' + experimentResultsPublicFolder;

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const loader = async ({ params, request }) => {
    const fileData = await fs.readFile( experimentResultsRoot + '/' +  params.experiment + '/data.csv', 'utf-8');
    const fileDataObj = await csv().fromString(fileData);

    const engines  = Array.from(new Set(fileDataObj.map((line) => line?.dbEngine)));
    const tests  = new Set(fileDataObj.map((line) => line?.test));
    const jobFiles  = new Set(fileDataObj.map((line) => line?.jobFile));
    const targetTable  = new Set(fileDataObj.map((line) => line?.targetTable));

    let setSize = 0;
    const dataSets = engines.map((engine, index) => {

        let myDataSet = fileDataObj.filter((row) => {
            return row?.dbEngine === engine;
        });

        setSize = myDataSet.length > setSize ? myDataSet.length : setSize;

        return {
            label: engine,
            data: myDataSet.map((row) => row?.latency),
            borderColor: getBrushColor({dbEngine:engine}),
            backgroundColor: getBrushColor({dbEngine:engine})
        };
    });

    const setSizeArray = Array.from({length: setSize}, (_, i) => i + 1);
    const labels = setSizeArray;

    const options = {
        responsive: true,
        plugins: {
            legend: {position: 'top'},
            title: {display: true, text: 'Latency (ms) vs DB engine for ' + setSize + ' iterations'},
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

    return {
        fileData:fileData,
        options:options,
        resultsData:resultsData,
        params: params
    };
};

export async function action({ params, request }) {

    return {};
}

export default function Experiment() {
    const data = useLoaderData();
    const actionData = useActionData();
    const experiment = data.params.experiment;

    const dataPreviewRaw = data.fileData.slice(0, 1000);
    const dataPreview = dataPreviewRaw.slice(0, dataPreviewRaw.lastIndexOf('\n'));

    const myChart = (

        <ClientOnly fallback={<Fallback />}>
            {() => <Line options={data.options} data={data.resultsData} />}
        </ClientOnly>

    );


    const experimentForm = (
        <Form id="experimentForm" method="post"  >
            <div className='jobFormTableDiv'>
                <br/>
                <div className='chartDiv' >
                    {myChart}
                </div>

                <br/>
                <br/>
                <div>

                    <div className={'downloadDiv'}>
                        <b>data.csv :</b>
                        &nbsp;&nbsp;
                        <a href={'/' + experimentResultsPublicFolder + '/' + experiment + '/data.csv'}
                           download={experiment + '-data.csv'}>
                            {'download CSV'}</a>
                        &nbsp;&nbsp;
                        <a href={'ms-excel:ofe|u|http://localhost:3000/' + experimentResultsPublicFolder + '/' + experiment + '/data.csv'}
                           download={experiment + '-data.csv'}>
                            {'open in Excel'}</a>
                    </div>
                    <br/>
                    <details>
                        <summary>Preview Data</summary>
                        <textarea rows='10' cols='80' className='viewCodeTextarea' defaultValue={dataPreview} ></textarea>
                    </details>

                </div>

            </div>
        </Form>
    );

    return(
        <div>
            <div >{experimentForm}</div>

        </div>
    );
}

function Fallback() {
    return <div>Generating Chart</div>;
}
function getBrushColor(params) {
    let color = 'pink';

    if(params?.dbEngine === 'mysql') {
        color = 'goldenrod';
    }
    if(params?.dbEngine === 'dynamodb') {
        color = 'dodgerblue';
    }
    return color;
}