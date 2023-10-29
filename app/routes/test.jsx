import {
     useActionData, useFetcher
}  from "@remix-run/react";

export const action = async ({request,}) => {
    const formData = await request.formData();
    console.log('***** ' + JSON.stringify(formData));
    return ({fd:formData});

    // const project = await createProject(formData);
    // return redirect(`/projects/${project.id}`);
};

export default function TestIndex() {

    const actionData = useActionData();
    const fetch = useFetcher();

    if (fetch.formData) {
        for (const data of fetch.formData.entries()) {
            console.log(JSON.stringify(data));
        }
    }

    return (
        <div>
            <fetch.Form method="post" action="/test">
                <p>
                    <label>
                        Name: <input name="name" type="text" defaultValue="wake"/>
                    </label>
                </p>
                <p>
                    <label>
                        Description:
                        <br />
                        <textarea name="description" />
                    </label>
                </p>
                <p>
                    <button type="submit">POST</button>
                    {/*<button onClick={()=> {*/}
                    {/*    fetcher.submit(item, {*/}
                    {/*        method: "post",*/}
                    {/*        action: "/test"*/}
                    {/*    })*/}
                    {/*}}*/}
                    {/*>Fetch</button>*/}
                </p>
            </fetch.Form>
            <br/>
            <div>
                {actionData?.fd}
            </div>
        </div>
    );



}