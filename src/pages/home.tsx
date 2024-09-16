import { useState } from "react";

export const Home = () => {
  const [city, setCity] = useState("");
  const [consumption, setConsumption] = useState("");
  const [result, setResult] = useState<{
    panels: number;
    cost: number;
    payback: number;
  } | null>(null);

  const handleCalculate = () => {
    //so para fazer
    const panels = Math.ceil(Number(consumption) / 400);
    const cost = panels * 500;
    const payback = cost / (Number(consumption) * 0.3);

    setResult({ panels, cost, payback });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pb-10">
      <div className=" flex flex-col mt-10">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4">Calcule Aqui</h2>
          <p className="text-gray-600 mb-6 w-1/2">
            Se informe com uma estimativa do quanto será gasto, o tempo de
            retorno de investimento e o que será necessário para a instalação da
            energia solar em sua residência.
          </p>
        </div>

        <div className="w-full max-w-lg">
          <div className="mb-4">
            <label htmlFor="city" className="block text-gray-700 mb-2">
              Nome da cidade
            </label>
            <input
              type="text"
              id="city"
              className="appearance-none border rounded-lg w-full py-4 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="consumption" className="block text-gray-700 mb-2">
              Consumo de energia mensal em kWh
            </label>
            <input
              type="number"
              id="consumption"
              className="appearance-none border rounded-lg w-full py-4 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
              placeholder="Enter energy consumption"
            />
          </div>

          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-3xl w-full"
            onClick={handleCalculate}
          >
            Calculate Solar Panels
          </button>
        </div>

        {result && (
          <div className="w-full max-w-lg mt-8">
            <h3 className="text-xl font-semibold mb-4">Resultados</h3>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <p className="mb-4">
                Números de paineis solares: <strong>{result.panels}</strong>
              </p>
              <p className="mb-4">
                Custo total de paineis solares:{" "}
                <strong>R${result.cost.toFixed(2)}</strong>
              </p>
              <p>
                Período médio de payback:{" "}
                <strong>{result.payback.toFixed(2)} anos</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
