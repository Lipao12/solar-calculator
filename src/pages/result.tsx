import { Divider } from "../components/divider";
import { useCalculatorContext } from "../context/context";

export const Result = () => {
  const { result } = useCalculatorContext();

  console.log("resultado: ", result);

  return (
    <div className="w-full max-w-lg mt-8">
      <h3 className="text-xl font-semibold mb-4">Resultados</h3>
      <Divider w="w-full" mb="mb-2" />
      {result ? (
        <div>
          <p className="mb-4">
            Nome dos painéis solares: <strong>{result.panels.nome}</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Número de painéis solares: <strong>{result.panels.qtd}</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Nome do inversor: <strong>{result.inverter.Nome}</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Número de painéis solares:{" "}
            <strong>{result.inverter.QuantosInversores}</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Custo parcial do projeto, somente placa, inversor e fios:{" "}
            <strong>R${result.partialCost.toFixed(2)}</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Custo total do projeto, somando o valor do instalador:{" "}
            <strong>R${result.totalCost.toFixed(2)}</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Area necessária: <strong>{result.area.toFixed(2)} m²</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Período médio de payback:{" "}
            <strong>{result.payback.toFixed(2)} anos</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Potência Necessaria:{" "}
            <strong>{result.potenciaNecessaria.toFixed(2)} W</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Tempo estimado de retorno do investimento:{" "}
            <strong>{result.tempoRetorno.toFixed(2)} anos</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Geração anual esperada:{" "}
            <strong>{result.geracaoAnual.toFixed(2)} kWh</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Lucro estimado: <strong>R${result.lucro.toFixed(2)}</strong>
          </p>
          <Divider w="w-full" mb="mb-2" />
          <p className="mb-4">
            Economia anual: <strong>R${result.economiaAnual.toFixed(2)}</strong>
          </p>
        </div>
      ) : (
        <p>
          Nenhum resultado disponível. Realize o cálculo para ver os resultados.
        </p>
      )}
    </div>
  );
};
