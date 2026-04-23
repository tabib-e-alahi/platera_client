export type TCategory = {
  id: string; name: string; slug: string; imageURL: string;
  displayOrder: number; isActive: boolean; createdAt: string;
  _count?: { meals: number };
};

export const EMPTY_FORM = { name: "", slug: "", imageURL: "", displayOrder: 0 };