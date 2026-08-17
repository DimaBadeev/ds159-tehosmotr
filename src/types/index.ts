export type PublicPrice = {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  isExtra: boolean;
};

export type SlotOption = {
  time: string;
  available: boolean;
};
