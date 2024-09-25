import { Divider } from "./divider";

interface CardOpenProps {
  title: string;
  showHidden: boolean;
  handleToggleDetalhes: any;
  infos: {
    text: string;
    result: any;
  }[];
}

export const CardOpen = ({
  title,
  showHidden,
  handleToggleDetalhes,
  infos,
}: CardOpenProps) => {
  return (
    <div
      className={`px-2 py-4 border rounded-md gap-8 items-center 
             `}
    >
      <div
        className="flex cursor-pointer gap-6 items-center"
        onClick={handleToggleDetalhes}
      >
        <span className="text-2xl">{title}</span>{" "}
        <span
          className={`transform transition-transform duration-300 ${
            showHidden ? "rotate-180" : "rotate-0"
          }`}
        >
          ▲
        </span>
      </div>
      {showHidden && (
        <div className="mt-2 p-4 border rounded-md transition-all duration-300">
          {infos.map((info, index) => {
            return (
              <div key={index}>
                <p className="mb-4">
                  {info.text} <strong>{info.result}</strong>
                </p>
                {index < infos.length - 1 && <Divider w="w-full" mb="mb-2" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
