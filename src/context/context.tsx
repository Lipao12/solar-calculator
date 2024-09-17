import React, { createContext, ReactNode, useContext, useState } from "react";

interface CalculatorContextProps {
  searchTerm: string;
  city: string;
  consumption: string;
  showModal: boolean;
  result: {
    panels: number;
    cost: number;
    payback: number;
  } | null;
  handleSetCity: (newCity: string) => void;
  handleSetConsumption: (newComsumption: string) => void;
  handleCalculate: () => void;
  setSearchTerm: (term: string) => void;
}

const CalculatorContext = createContext<CalculatorContextProps | undefined>(
  undefined
);

const CalculatorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [consumption, setConsumption] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [result, setResult] = useState<{
    panels: number;
    cost: number;
    payback: number;
  } | null>(null);

  const handleSetCity = (newCity: string) => {
    setCity(newCity);
  };

  const handleSetConsumption = (newComsumption: string) => {
    setConsumption(newComsumption);
  };

  const handleCalculate = () => {
    //so para fazer
    const panels = Math.ceil(Number(consumption) / 400);
    const cost = panels * 500;
    const payback = cost / (Number(consumption) * 0.3);

    setResult({ panels, cost, payback });
  };

  return (
    <CalculatorContext.Provider
      value={{
        searchTerm,
        city,
        consumption,
        showModal,
        result,
        handleSetCity,
        handleSetConsumption,
        handleCalculate,
        setSearchTerm,
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
