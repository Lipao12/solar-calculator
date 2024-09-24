export type Inverter = {
  Nome: string;
  Marca: string;
  Potencia: number;
  Preco: number;
  RendimentoMaximo: number;
  QuantosInversores: number;
  PrecoTotal: number;
  ID: number;
  };

export type SolarPanel = {
    nome: string;
    potencia: number;
    
    preco: number;
    area: number;
    qtd: number | null;
    custoTotal: number | null;
    coefTempPot: number;
    noct: number;
  };