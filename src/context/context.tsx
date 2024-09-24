import React, { createContext, ReactNode, useContext, useState } from "react";
import { inverters } from "../assets/banco_inversor";
import { solarPanels } from "../assets/banco_paineis";
import { DefineInvertor, DefineSolarPanel } from "../helper/helper";
import { Inverter, SolarPanel } from "../types/types";

interface CalculatorContextProps {
  calcByMoney: boolean;
  city: string;
  consumption: number;
  showModal: boolean;
  result: {
    panels: SolarPanel;
    inverter: Inverter;
    totalCost: number;
    partialCost: number;
    payback: number;
    potenciaNecessaria: number;
    geracaoAnual: number;
    tempoRetorno: number;
    economiaAnual: number;
    valorEconomiaTotal: number;
    lucro: number;
    consumo: number;
    area: number;
  } | null;
  handleSetCity: (newCity: string) => void;
  handleSetConsumption: (newConsumption: string) => void;
  handleCalculate: () => void;
  setCalcByMoney: (val: boolean) => void;
}

const CalculatorContext = createContext<CalculatorContextProps | undefined>(
  undefined
);

const CalculatorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [choosenSolarPanel, setSolarPanel] = useState<SolarPanel | null>(null);
  const [choosenInvertor, setInvertor] = useState<Inverter | null>(null);
  const [calcByMoney, setCalcByMoney] = useState<boolean>(false);
  const [city, setCity] = useState<string>("");
  const [idModuloEscolhido, setIdModuloEscolhido] = useState(-1);
  const [idInversorEscolhido, setIdInversorEscolhido] = useState(-1);
  const [area, setArea] = useState(0);
  const [custoParcial, setCustoParcial] = useState(0);
  const [custoTotal, setCustoTotal] = useState(0);
  const [geracaoAnual, setGeracaoAnual] = useState(0);
  const [lucro, setLucro] = useState(0);
  const [potenciaInstalada, setPotenciaInstalada] = useState<number>(0);
  const [potenciaNecessaria, setPotenciaNecessaria] = useState<number>(0);
  const [consumption, setConsumption] = useState<number>(0);
  const [consumptionkWh, setConsumptionkWh] = useState<number>(0);
  const [consumptionReais, setConsumptionReais] = useState<number>(0);
  const [economiaAnual, setEconomiaAnual] = useState<number>(0);
  const [valorEconomiaTotal, setValorEconomiaTotal] = useState<number>(0);
  const [payback, setPayback] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [result, setResult] = useState<{
    panels: SolarPanel;
    inverter: Inverter;
    totalCost: number;
    partialCost: number;
    payback: number;
    potenciaNecessaria: number; // Wh
    geracaoAnual: number;
    tempoRetorno: number;
    economiaAnual: number;
    valorEconomiaTotal: number;
    lucro: number;
    consumo: number;
    area: number;
  } | null>(null);

  const custoDisponibilidade = 50.0; // vitoria ES

  const TAXES = {
    ICMS: 0.25, //É o valor usado pela maioria dos estados
    PIS: 0.012,
    COFINS: 0.0553,
    CIPMAX: 50, // 50 reias
  };
  const LOSS_DIRT = 0.01; //Perda de geração devido a sujeira
  const TD = 0.8;

  const iCOSTS_PARCIAL = 0;
  const iCOSTS_TOTAL = 1;

  const horasDeSolPlenoCidade = 4.85; // kWh/m^2dia

  // Função para calcular a potência instalada
  const calculatePotenciaInstalada = (
    nPaineis: number,
    potenciaPainel: number
  ) => {
    return nPaineis * potenciaPainel;
  };

  // Função para calcular o tempo de retorno
  const calculateTempoRetorno = (custoTotal: number, economiaAnual: number) => {
    return custoTotal / economiaAnual; // Tempo de retorno (em anos)
  };

  /*
  ============================
  ============================
        FUNCAO PRINCIPAL
  ============================
  ============================
  */
  const handleCalculate = () => {
    let consumokWh = 0;
    let consumoReais = 0;
    let potNecessaria = 0;
    let modulo: SolarPanel;
    let inversor: Inverter;
    try {
      if (calcByMoney) {
        const valWithoutTaxes = ValueWithoutTaxes(consumption); // consumo em reais
        consumokWh = ConvertToKWh(valWithoutTaxes, 0.674); // procurar certo qual é a tariafa mensal
        consumoReais = consumption;
      } else {
        consumokWh = consumption;
        consumoReais = ValueWithTaxes(consumption * 0.674); // procurar certo qual é a tariafa mensal
      }
      potNecessaria = FindTargetCapacity(
        consumokWh,
        horasDeSolPlenoCidade //horasDeSolPleno
      );

      console.log(potNecessaria);

      modulo = DefineSolarPanel(potNecessaria, -1, 8, solarPanels);
      inversor = DefineInvertor(modulo, 0, inverters);

      let area1 = DefineArea(modulo);

      const costs = DefineCosts(modulo, inversor);

      const anualGeneration = EstimateAnualGeneration(modulo, inversor);

      const economy = GetEconomicInformation(costs, anualGeneration);

      const returnTime = calculateTempoRetorno(
        costs[iCOSTS_TOTAL],
        economy.anualEconomy
      );

      console.log(modulo, inversor, area1, costs, economy);

      setResult({
        panels: modulo,
        inverter: inversor,
        totalCost: costs[iCOSTS_TOTAL],
        partialCost: costs[iCOSTS_PARCIAL],
        potenciaNecessaria: potNecessaria,
        consumo: consumption,
        area: area1,
        valorEconomiaTotal: economy.totalEconomy,
        economiaAnual: economy.anualEconomy,
        geracaoAnual: anualGeneration,
        payback: economy.payback,
        lucro: lucro,
        tempoRetorno: returnTime,
      });
    } catch (error) {
      console.error("Erro no cálculo:", error);
    }
  };

  const GetEconomicInformation = (costs: number[], geracaoAnual: number) => {
    const tarifaEnergia = 0.75; // Tarifa média de energia (R$/kWh)
    const inflacaoEnergetica = 0.05; // Taxa de aumento anual da tarifa de energia (ex: 5%)
    const duracaoSistema = 25; // Vida útil estimada do sistema solar (em anos)
    const custoInicial = costs[iCOSTS_TOTAL]; // Custo inicial do sistema solar

    // Estimar economia anual com base na tarifa de energia e geração anual
    let economiaAnual = geracaoAnual * tarifaEnergia;

    // Estimar o retorno ao longo dos anos (considerando inflação energética)
    let valorEconomiaTotal = 0;
    for (let ano = 1; ano <= duracaoSistema; ano++) {
      valorEconomiaTotal += economiaAnual;
      economiaAnual *= 1 + inflacaoEnergetica; // Ajusta para a inflação energética anual
    }

    // Estimar tempo de retorno do investimento (payback)
    const payback = custoInicial / (geracaoAnual * tarifaEnergia);

    //
    const anualEconomy = geracaoAnual * tarifaEnergia;
    const totalEconomy = valorEconomiaTotal;

    return {
      anualEconomy: anualEconomy,
      totalEconomy: totalEconomy,
      payback: payback,
    };
    // Armazenar os valores calculados para exibir ou utilizar em relatórios
    setEconomiaAnual(geracaoAnual * tarifaEnergia);
    setValorEconomiaTotal(valorEconomiaTotal);
    setPayback(payback);
  };

  /*
  ==============================
  ==============================
  HELPER FUNCTIONS
  ==============================
  ==============================
  */

  const ValueWithoutTaxes = (costReais: number) => {
    //Considera o menor entre 5% do valor total da conta de luz e um valor máximo de 50 reais
    const contribuicaoIlumPublica = Math.min(costReais * 0.05, TAXES.CIPMAX);
    return (
      (costReais - contribuicaoIlumPublica) *
      (1 - TAXES.ICMS) *
      (1 - TAXES.PIS - TAXES.COFINS)
    );
  };

  const ValueWithTaxes = (valorSemImpostos: number) => {
    const valorSemCIP =
      valorSemImpostos / ((1 - TAXES.ICMS) * (1 - TAXES.PIS - TAXES.COFINS));
    //Considera o menor entre 5% do valor total da conta de luz e um valor máximo de 50 reais
    const contribuicaoIlumPublica = Math.min(
      (valorSemCIP * 0.05) / 0.95,
      TAXES.CIPMAX
    );
    return valorSemCIP + contribuicaoIlumPublica;
  };

  const ConvertToKWh = (costReais: number, tarifaMensal: number) => {
    return costReais / tarifaMensal;
  };

  const FindTargetCapacity = (energyConsumed: number, solarHour: number) => {
    energyConsumed -= custoDisponibilidade; //O Custo de disponibilidade é o mínimo que alguém pode pagar
    // Ou seja, se a pessoa consumir 400KWh, e produzir 375KWh, ela irá pagar 50KWh à concessionária, se esse for o custo de disponibilidade.
    if (energyConsumed < 0.0) {
      //Verifica se o consumo é menor que o custo de disponibilidade
      return 0;
    }
    energyConsumed = (energyConsumed * 1000) / 30.0; //Energia consumida por dia
    energyConsumed = energyConsumed / (TD * 3.23); //solarHour); //TD é a constante de segurança
    return energyConsumed;
  };

  // Função para definir os custos do sistema dimensionado
  const DefineCosts = (solarPanel: any, invertor: any): number[] => {
    let costs = [0.0, 0.0]; // Vetor para armazenar o custo parcial e o custo total
    let porcentagemCustosIntegrador: number;

    // Definindo o custo parcial (soma do custo do inversor e dos módulos solares)
    //console.log(inverters);
    costs[iCOSTS_PARCIAL] = invertor.PrecoTotal + solarPanel.custoTotal;

    // Definindo o custo total com base no estudo estratégico da Greener de 2020
    if (potenciaInstalada < 1000) {
      porcentagemCustosIntegrador = 1.65 - 0.032 * 1;
    } else if (potenciaInstalada > 8000) {
      porcentagemCustosIntegrador = 1.65 - 0.032 * 8;
    } else {
      porcentagemCustosIntegrador = 1.65 - 0.032 * (potenciaInstalada / 1000); // Convertendo a potência para kWp
    }

    // Calculando o custo total
    costs[iCOSTS_TOTAL] = costs[iCOSTS_PARCIAL] * porcentagemCustosIntegrador;

    return costs;
  };

  // Função para definir a área total dos módulos solares
  const DefineArea = (solarPanel: any): number => {
    return solarPanel.qtd * solarPanel.area;
  };

  // Função para estimar a geração anual de energia
  const EstimateAnualGeneration = (
    solarPanel: SolarPanel, // Placa solar selecionada
    inverter: Inverter // Placa solar selecionada
  ): number => {
    const horasDeSolPlenoPorAno = 4.85 * 365; // Total de horas de sol pleno por ano
    const areaTotalPainel = DefineArea(solarPanel); // Área total dos painéis solares em m²
    const rendimentoPainel = solarPanel.coefTempPot; // Coeficiente de rendimento do painel
    const rendimentoInversor = inverter.RendimentoMaximo; // Rendimento do inversor

    console.log(
      "Teste: ",
      horasDeSolPlenoPorAno,
      areaTotalPainel,
      rendimentoPainel,
      rendimentoInversor
    );

    // Fator de perdas (exemplo de sujeira, temperatura, etc.)
    const perdaSujeira = LOSS_DIRT;

    // Cálculo da geração anual em kWh
    const geracaoAnual =
      areaTotalPainel *
      horasDeSolPlenoPorAno *
      -rendimentoPainel *
      rendimentoInversor *
      (1 - perdaSujeira);

    return geracaoAnual;
  };

  // Função para atualizar a cidade selecionada
  const handleSetCity = (newCity: string) => {
    // Atualiza o estado da cidade com a nova cidade fornecida
    setCity(newCity);
  };

  // Função para retornar o número de dias de um mês específico
  const GetNumberOfDays = (month: number): number => {
    // Verifica o mês e retorna o número correspondente de dias
    switch (month) {
      case 1: // Janeiro
      case 3: // Março
      case 5: // Maio
      case 7: // Julho
      case 8: // Agosto
      case 10: // Outubro
      case 12: // Dezembro
        return 31;
      case 2: // Fevereiro (não estamos considerando anos bissextos aqui)
        return 28;
      case 4: // Abril
      case 6: // Junho
      case 9: // Setembro
      case 11: // Novembro
        return 30;
      default:
        return 0; // Retorna 0 caso o mês seja inválido
    }
  };

  // Função para atualizar o consumo com um novo valor
  const handleSetConsumption = (newConsumption: string) => {
    const numericValue = parseFloat(newConsumption);

    // Atualiza o estado com o valor numérico
    setConsumption(numericValue);
  };

  return (
    <CalculatorContext.Provider
      value={{
        calcByMoney,
        city,
        consumption,
        showModal,
        result,
        handleSetCity,
        handleSetConsumption,
        handleCalculate,
        setCalcByMoney,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

// Hook para usar o contexto
const useCalculatorContext = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error(
      "useCalculatorContext must be used within a CalculatorProvider"
    );
  }
  return context;
};

export { CalculatorProvider, useCalculatorContext };
