import { ReactLenis } from '@studio-freight/react-lenis'
import { Homepage } from "./pages/Homepage/Homepage";
import { MouseIndicator } from './components/MouseIndicator/MouseIndicator';
import { MouseGL } from './components/MouseGL/MouseGL';
import "./assets/styles/global.css";

export const App = () => {
  return (
    <>
      <ReactLenis root>
        <Homepage />
        <MouseGL />
        <MouseIndicator />
      </ReactLenis>
    </>
  );
};
