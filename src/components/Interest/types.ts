export type InterestProps = {
  text: string;
  id: string;
  isSelected?: boolean;
  onClick?: (id: string) => void;
  onSelectByName?: (name: string) => void;
};
