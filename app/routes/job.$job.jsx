
import {Menu} from "~/components/menu";
import React from "react";

export default function Job(params) {


    return(
        <div className="rootContainer">
            <Menu page='jobs' />

            <h2>JOB</h2>
            {JSON.stringify(params)}
        </div>
    );

}

