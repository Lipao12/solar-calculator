import { Divider } from "../components/divider";
import { useCalculatorContext } from "../context/context";

export const Result = () => {
  const { result } = useCalculatorContext();

  return (
    <div className="w-full max-w-lg mt-8">
      <h3 className="text-xl font-semibold mb-4">Resultados</h3>
      <Divider w="w-full" mb="mb-2" />
      {result && (
        <div>
          <p className="mb-4">
            Números de paineis solares: <strong>{result.panels}</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Custo total de paineis solares:{" "}
            <strong>R${result.cost.toFixed(2)}</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p>
            Período médio de payback:{" "}
            <strong>{result.payback.toFixed(2)} anos</strong>
          </p>
        </div>
      )}
    </div>
  );
};
