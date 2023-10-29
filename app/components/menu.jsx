import {
    Link,
    useLoaderData
} from "@remix-run/react";

import { useState } from "react";

// import React, { useState } from 'react';

import {config} from "~/configuration";

export function Menu(params) {
    const data = useLoaderData();
    // const transition = useTransition();
    let engineList = config().engines;


    const topLinks = (
        <ul className="menuList">
            <li key="0"  >
                <Link to="/" className='titleLink'>database-app</Link>
            </li>
            {engineList.map((x,i) => {
                const menuLinkClass = data?.params?.job === x ? 'menuLinkSelected' : 'menuLink';
                return (<li key={i+1}>
                    <Link to={"/" + x}  className={menuLinkClass}>
                        {x}
                    </Link>
                </li>);
            })}

        </ul>
    );

    return (
        <div id="menuContainer">
            {topLinks}
            <br/>

        </div>
    );
}

