import stylesShared from "./styles/shared.css";

import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";

import favicon from "./components/favicon.ico";

export const links = () => {
    return [
        {rel: "stylesheet", href:stylesShared},
        {key: 1, rel: 'icon', type: 'image/png', sizes: '32x32', href: favicon},
        {key: 2, rel: 'icon', type: 'image/x-icon', href: favicon}
    ];
};

export default function App() {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <Meta />
            <Links />
        </head>
        <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        </body>
        </html>
    );
}
