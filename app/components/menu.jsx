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
    let menuItemList = config().menuitems;

    const topLinks = (
        <ul className="menuList">
            <li key="0"  >
                <Link to="/" className='titleLink'>database-app</Link>
            </li>
            {menuItemList.map((x,i) => {
                const menuLinkClass = params?.page === x ? 'menuLinkSelected' : 'menuLink';

                if(x === 'about') {
                    return (<li key={i+1}>
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

