import { useState } from "react";
import { CardOpen } from "../components/card-open";
import { Divider } from "../components/divider";
import { useCalculatorContext } from "../context/context";

export const Result = () => {
  const { result } = useCalculatorContext();
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [mostrarInstalacao, setMostrarInstalacao] = useState(false);
  const [mostrarInfos, setMostrarInfos] = useState(false);
  const [mostrarIndices, setMostrarIndices] = useState(false);

  const handleToggleDetalhes = () => {
    setMostrarDetalhes(!mostrarDetalhes);
  };
  const handleToggleInstalacao = () => {
    setMostrarInstalacao(!mostrarInstalacao);
  };
  const handleToggleInfos = () => {
    setMostrarInfos(!mostrarInfos);
  };
  const handleToggleIndices = () => {
    setMostrarIndices(!mostrarIndices);
  };

  return (
    <div className="w-full max-w-lg mt-8">
      <h3 className="text-xl font-semibold mb-4">Resultados</h3>
      <Divider w="w-full" mb="mb-2" />
      {result ? (
        <div className="space-y-3">
          <CardOpen
            title={"Detalhes"}
            showHidden={mostrarDetalhes}
            handleToggleDetalhes={handleToggleDetalhes}
            infos={[
              {
                text: "Consumo de energia (em reais):",
                result: result.consumoReais,
              },
              {
                text: "Consumo mensal de energia:",
                result: result.consumo,
              },
            ]}
          />
          <CardOpen
            title={"Instalação"}
            showHidden={mostrarInstalacao}
            handleToggleDetalhes={handleToggleInstalacao}
            infos={[
              {
                text: "Potência necessária:",
                result: `${(result.potenciaNecessaria / 1000).toFixed(2)} kWp`,
              },
              {
                text: "Sistema de painéis escolhido:",
                result: `${result.panels.qtd} do ${result.panels.nome}`,
              },
              {
                text: "Área necessária para instalação:",
                result: `${result.area.toFixed(2)} m²`,
              },
              {
                text: "Sistema de inversores escolhido:",
                result: `${result.inverter.QuantosInversores} do ${result.inverter.Nome}`,
              },
            ]}
          />
          <CardOpen
            title={"Custos Infos"}
            showHidden={mostrarInfos}
            handleToggleDetalhes={handleToggleInfos}
            infos={[
              {
                text: "Custo parcial do projeto, somente placa, inversor e fios:",
                result: `R$ ${result.partialCost.toFixed(2)}`,
              },
              {
                text: "Custo total do projeto, somando o valor do instalador:",
                result: `R$ ${result.totalCost.toFixed(2)}`,
              },
              {
                text: "Geração anual esperada",
                result: `${result.geracaoAnual.toFixed(2)} kWh`,
              },
            ]}
          />
          <CardOpen
            title={"Índices econômicos"}
            showHidden={mostrarIndices}
            handleToggleDetalhes={handleToggleIndices}
            infos={[
              {
                text: "Período médio de payback:",
                result: `${result.payback.toFixed(2)} anos`,
              },
              {
                text: "Tempo estimado de retorno do investimento:",
                result: `${result.tempoRetorno.toFixed(2)} anos`,
              },
              {
                text: "Economia anual:",
                result: `R$ ${result.economiaAnual.toFixed(2)}`,
              },
              {
                text: "Consumo em Reais:",
                result: `R$ ${result.consumoReais.toFixed(2)}`,
              },
            ]}
          />
        </div>
      ) : (
        <p>
          Nenhum resultado disponível. Realize o cálculo para ver os resultados.
        </p>
      )}
    </div>
  );
};
