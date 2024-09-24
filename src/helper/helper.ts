import { Inverter, SolarPanel } from "../types/types";

  // Função para definir a placa solar baseado na potencia necessária e no ID da placa escolhida
  export const DefineSolarPanel = (
    WpNeeded: number,
    areaAlvo: number,
    idModuloEscolhido: number,
    solarPanels:SolarPanel[]
  ) => {
    let cont: number = 0;
    let precoTotal: number;

    // Percorre os módulos até o idModuloEscolhido
    while (cont < idModuloEscolhido) {
      cont++;
    }
    let modulo = solarPanels[cont];

    // Se a ÁreaAlvo for -1, calcular a quantidade de módulos com base na potência necessária (WpNeeded)
    if (areaAlvo === -1) {
      modulo.qtd = Math.floor(WpNeeded / modulo.potencia);
      if (modulo.qtd === 0) {
        modulo.qtd = 1; // Ao menos 1 módulo
      }
    } else {
      // Caso contrário, calcular a quantidade de módulos com base na área alvo disponível
      modulo.qtd = Math.floor(areaAlvo / modulo.area);
    }

    // Calcula o custo total dos módulos
    precoTotal = modulo.qtd * modulo.preco;
    modulo.custoTotal = precoTotal;

    return modulo;
  };

  // Função para definir o inversor baseado nos dados da placa e no ID do inversor escolhido
  export const DefineInvertor = (
    placaEscolhida: any,
    idInversorEscolhido: number,
    inverters: Inverter[]
  ): any => {
    let cheaperInvertor = inverters[0];
    let currentInvertor = cheaperInvertor;
    let currentCost, cheaperCost, WpGenerated;
    let numberInvertors,
      cont = 0;
    // Calcular a quantidade total de Wp gerada pelos painéis solares
    WpGenerated = placaEscolhida.qtd * placaEscolhida.potencia;

    // Inicializar o primeiro inversor como o mais barato
    numberInvertors = Math.ceil((0.8 * WpGenerated) / cheaperInvertor.Potencia);
    cheaperCost = numberInvertors * cheaperInvertor.Preco;
    cheaperInvertor.QuantosInversores = numberInvertors;
    cheaperInvertor.PrecoTotal = cheaperCost;

    // Verifica se o usuário escolheu o primeiro inversor
    if (idInversorEscolhido === cont) {
      return cheaperInvertor;
    }

    // Percorrer a lista de inversores
    for (let i = 1; i < inverters.length; i++) {
      cont++; // Contador para escolher um inversor específico
      currentInvertor = inverters[i];

      numberInvertors = Math.ceil(
        (0.8 * WpGenerated) / currentInvertor.Potencia
      );
      currentCost = numberInvertors * currentInvertor.Preco;
      currentInvertor.QuantosInversores = numberInvertors;
      currentInvertor.PrecoTotal = currentCost;

      // Se o usuário escolheu o inversor atual, retorná-lo
      if (idInversorEscolhido === cont) {
        return currentInvertor;
      }

      // Verifica se o inversor atual é mais barato que o mais barato até então
      if (currentCost < cheaperCost) {
        cheaperCost = currentCost;
        cheaperInvertor = currentInvertor;
      }
    }

    // Retorna o inversor mais barato
    return cheaperInvertor;
  };