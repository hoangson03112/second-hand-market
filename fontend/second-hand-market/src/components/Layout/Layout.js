import * as React from "react";
import Header from "./Header";
import { Footer } from "./Footer";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="bg-body-secondary pt-5">{children}</div>
    </div>
  );
};
export default Layout;
