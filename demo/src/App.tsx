import { SidebarControls } from "./components/SideControl"
import "./App.css"

export const App = () => {
  return (
    <div className="app-root">
      <SidebarControls
        onSelectScene={() => { }}
        onPause={undefined}
        onRefresh={undefined}
        onBomb={undefined}
        onAddBody={undefined}>
      </SidebarControls>
    </div>
  )
}