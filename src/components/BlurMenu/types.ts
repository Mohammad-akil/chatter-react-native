export type BlurMenuItem = {
  label: string;
  value: string;
};

export type BlurMenuProps = {
  defaultTab?: string;
  handleTabChange?: (tab: string) => void;
  tabs: BlurMenuItem[];
};
