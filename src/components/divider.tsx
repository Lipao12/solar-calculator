interface DividerProps {
  w: string;
  h?: string;
  mb?: string;
  mt?: string;
}

export const Divider = ({
  w,
  h = "h-[1px]",
  mb = "mb-0",
  mt = "mt-0",
}: DividerProps) => {
  const style = `${h} ${w} ${mb} ${mt} border`;
  return <div className={style}></div>;
};
