import { CircleDollarSign, Zap } from "lucide-react";
import { useState } from "react";
import { useCalculatorContext } from "../context/context";
import { Result } from "./result";

export const Home = () => {
  const {
    city,
    consumption,
    calcByMoney,
    setCalcByMoney,
    handleSetCity,
    handleCalculate,
    handleSetConsumption,
  } = useCalculatorContext();

  const [localCity, setLocalCity] = useState(city);
  const [localConsumption, setLocalConsumption] = useState<string>(
    consumption.toString()
  );

  const toggleUnit = () => {
    setCalcByMoney(!calcByMoney);
  };

  const handleConfirmCalculate = (e: any) => {
    e.preventDefault();
    handleSetCity(localCity);
    handleSetConsumption(localConsumption);
    handleCalculate();
  };

  return (
    <div className=" bg-gray-100 flex flex-col items-center pb-10">
      <div className=" flex flex-col mt-10">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4">Calcule Aqui</h2>
          <p className="text-gray-600 mb-6 w-1/2">
            Se informe com uma estimativa do quanto será gasto, o tempo de
            retorno de investimento e o que será necessário para a instalação da
            energia solar em sua residência.
          </p>
        </div>

        <form className="w-full max-w-lg" onSubmit={handleConfirmCalculate}>
          <div className="mb-4">
            <label htmlFor="city" className="block text-gray-700 mb-2">
              Nome da cidade
            </label>
            <input
              type="text"
              id="city"
              className="appearance-none border rounded-lg w-full py-4 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={localCity}
              onChange={(e) => setLocalCity(e.target.value)}
              placeholder="Enter your city"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="consumption" className="block text-gray-700 mb-2">
              Consumo de energia mensal em {calcByMoney ? "reais" : "kWh"}
            </label>

            <div className="flex flex-row gap-2">
              <input
                type="number"
                id="consumption"
                className="appearance-none border rounded-lg w-full py-4 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={localConsumption}
                onChange={(e) => setLocalConsumption(e.target.value)}
                placeholder={`Enter energy consumption in ${
                  calcByMoney ? "reais" : "kWh"
                }`}
              />
              <button
                type="button"
                className="p-2 bg-gray-300 rounded-full hover:bg-gray-400"
                onClick={toggleUnit}
                aria-label="Trocar unidade"
              >
                {calcByMoney ? (
                  <Zap size={24} />
                ) : (
                  <CircleDollarSign size={24} />
                )}
              </button>
            </div>
          </div>

          <button
            className="bg-yellow-500 hover:bg-yellow-600  py-2 px-4 font-bold text-gray-700 rounded-3xl w-full"
            type="submit"
          >
            Calculate Solar Panels
          </button>
        </form>
        <Result />
      </div>
    </div>
  );
};
