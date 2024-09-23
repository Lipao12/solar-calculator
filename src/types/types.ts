export type Inverter = {
    indice: number; 
    preco: number; 
    qtd: number | null;
    potencia: number; 
    precoTotal: number; 
    rendimentoMaximoInversor: number; 
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