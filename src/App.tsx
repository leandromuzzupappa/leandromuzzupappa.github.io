import { ReactLenis } from '@studio-freight/react-lenis'
import { Homepage } from "./pages/Homepage/Homepage";
import "./assets/styles/global.css";

export const App = () => {
  return (
    <>
      <ReactLenis root>
        <Homepage />
      </ReactLenis>
    </>
  );
};
