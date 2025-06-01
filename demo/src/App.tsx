import { SidebarControls } from "./components/SideControl"
import "./App.css"
import { Simulator } from "./runner/Simulator";

type AppProps = {
  sim: Simulator;
};

export const App = ({
  sim
}: AppProps) => {

  return (
    <div className="app-root">
      <SidebarControls
        sim={sim}
      />
    </div>
  )
}