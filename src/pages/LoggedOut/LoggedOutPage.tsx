import { Link } from "@tanstack/react-router";

import ScrollToTop from "../../components/ScrollToTop";

const LoggedOutPage = () => {
  return (
    <>
      <ScrollToTop />
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Logged Out</h1>
        </div>
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <div className="my-2 py-4">
            Please&nbsp;<Link className="font-medium text-teal-700">login</Link>
            &nbsp;to use the application.
          </div>
        </div>
      </div>
    </>
  );
};

export default LoggedOutPage;
