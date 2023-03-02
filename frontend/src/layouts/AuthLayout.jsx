import { Fragment } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <Fragment>
      <main className="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center">
        <div className="md:w-2/3 lg:w-2/5">
          <Outlet />
        </div>
      </main>
    </Fragment>
  );
};

export default AuthLayout;
