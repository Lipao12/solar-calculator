import { CalculatorProvider } from "./context/context";
import { Home } from "./pages/home";

function App() {
  return (
    <div>
      <CalculatorProvider>
        <Home />
      </CalculatorProvider>
    </div>
  );
}

export default App;
