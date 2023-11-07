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

                if(x === 'about') {
                    return (<li key={99}>
                        <Link to={"https://github.com/robm26/database-app"}
                              target="_blank" className={menuLinkClass}>
                            {x}
                        </Link>
                    </li>);
                }
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

