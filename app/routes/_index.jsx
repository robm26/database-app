import { Outlet } from "@remix-run/react";
import { Menu } from "~/components/menu";


export const meta = () => {
  return [
    { title: "Tables" },
    { name: "description", content: "Database Application" },
  ];
};

export default function Index() {
  return (
    <div className="rootContainer">

      <Menu />
      <Outlet/>

        <div className="intro">
            Send read and write calls to your database.
        </div>
    </div>
  );
}

