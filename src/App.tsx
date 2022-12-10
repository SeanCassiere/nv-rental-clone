import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes/Router";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
