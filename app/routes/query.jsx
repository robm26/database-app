import {
    useLoaderData, Link, Form, useFetcher, useActionData
}  from "@remix-run/react";



import React from 'react';

import {Menu} from "~/components/menu";
import {SqlGrid} from "~/components/SqlGrid";
import { runSql} from "../components/database.mjs";
import { runPartiQL } from "../components/database.mjs";


export async function action({ params, request }) {

    const body = await request.formData();
    const _action = body.get("_action");

    const sqlInput = (body.get('sqlInput'));

    let result;

    if(_action === 'mysql') {
        result = await runSql(sqlInput);

    }

    if(_action === 'dynamodb') {
        result = await runPartiQL(sqlInput);

    }

    return({result: result.result, operation: result.operation, latency: result.latency});
}

export const loader = async ({ params, request }) => {
    return {
        params: params
    };
};


export default function QueryIndex() {
//     const data = useLoaderData();
    const actionData = useActionData();
    let result = actionData?.result;
    let affectedRows = result?.affectedRows;

    let operation = actionData?.operation;

    let stmt = '';

    const [sql, setSql] = React.useState(stmt);

    const clearSql = () => {
        setSql('');
        return null;
    };

    const handleSqlUpdate = (val) => {
        setSql(val.target.value);
    };

    let rowCount = 0;
    let Items = [];

    if(result && !result?.error ) {

        if(operation === 'select') {
            Items = result?.Items;

            if(Array.isArray(Items)) {
                rowCount = Items.length;
            }
        } else {
            rowCount = affectedRows;
        }

    }

    let defaultSql = "select \n  *\n";
    defaultSql += "from\n  users"
    // defaultSql += "\nwhere\n  user_id = '1000' ";

    // defaultSql = "update users set credit_rating = 444 where user_id = '1000' ";


    const chartPanel = (<div className='chartPanel'>
        &lt; Latency chart, MySQL vs DynamoDB &gt;
    </div>);

    const sqlForm = (<Form id="jobForm" method="post"  >
        <div className='sqlTableDiv'>
        <table className='sqlTableForm'>
            <thead></thead>
            <tbody><tr><td>
                <label>
                    <textarea name="sqlInput" className="sqlInput"
                                defaultValue={defaultSql}>
                    </textarea>
                </label>
                <br/>
                <button type='submit' name='_action' value='mysql'>
                    MySQL
                </button>

                <button type='submit' name='_action' value='dynamodb'>
                    DynamoDB PartiQL
                </button>

                &nbsp;&nbsp;
                <Link to={'.'} >
                    <button type='submit' onClick={()=>{ clearSql() }} >CLEAR</button>
                </Link>
                &nbsp; &nbsp; &nbsp;
                {actionData?.latency ? actionData?.latency + ' ms' : ''}
                &nbsp; &nbsp;
                {rowCount !== undefined ? (<span>rows: {rowCount}</span>) : null}
                <br/>

            </td></tr></tbody>
        </table>
        </div>
    </Form>);

    return (
        <div className="rootContainer">
            <Menu page='query' />

            <div className='sqlContainer'>
                {sqlForm}

                {actionData?.latency ? chartPanel : null}
                <br/>
                {result?.error && result.error.name !== 'ConditionalCheckFailedException' ?
                    (<div className='errorPanel'>
                        {result.error.code}<br/>{result.error?.message}
                    </div>)
                    : (
                        <>
                            { Array.isArray(Items) ?
                                <SqlGrid data={Items} /> :
                                <p>{operation}</p>
                            }
                        </>

                    )
                }

            </div>

        </div>
    );
}
