import {
    useLoaderData, Link, Form, useFetcher, useActionData
}  from "@remix-run/react";

import React from 'react';

import {Menu} from "~/components/menu";
import {SqlGrid} from "~/components/SqlGrid";
import {runPartiQL, runSql} from "../components/database.mjs";

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

    return({result: result.result, latency: result.latency});
}

export const loader = async ({ params, request }) => {
    return {
        params: params
    };
};


export default function JobIndex() {
    const data = useLoaderData();
    const actionData = useActionData();

    let stmt = '';

    const [sql, setSql] = React.useState(stmt);

    const clearSql = () => {
        setSql('');
        return null;
    };

    const handleSqlUpdate = (val) => {
        setSql(val.target.value);
    };

    let rowCount;

    if(actionData?.result && !actionData?.result?.error) {
        let dataset = actionData?.result;
        rowCount = dataset.length;

    }

    let defaultSql = "select *\n";
    defaultSql += "from\n  users \nwhere\n  user_id = '1000' ";

    const chartPanel = (<div className='chartPanel'>
        &lt; Latency chart, MySQL vs DynamoDB &gt;
    </div>);

    const sqlForm = (<Form id="jobForm" method="post"  >
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
                {rowCount >= 0 ? (<span>rows: {rowCount}</span>) : null}
                <br/>

            </td></tr></tbody>
        </table>
    </Form>);

    return (
        <div className="rootContainer">
            <Menu  />

            <div className='sqlContainer'>
                {sqlForm}
                {actionData?.latency ? chartPanel : null}
                <br/>
                {actionData?.result?.error ?
                    (<div className='errorPanel'>{actionData.result.error?.code}<br/>{actionData.result.error?.sqlMessage}</div>)
                    : (
                        <>
                            <SqlGrid data={actionData?.result} />
                        </>

                    )
                }

            </div>

        </div>
    );
}
