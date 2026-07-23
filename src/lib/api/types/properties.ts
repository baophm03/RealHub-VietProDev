export interface GetPropertiesResponse {
  success: boolean;
  data: Property[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface Property {
  id: string;
  propertyCode: string;
  title: string;
  slug: string;
  transactionType: string;
  sellingMode: string;
  price: string;
  priceUnit: string;
  area: number;
  areaUnit: string;
  publicationStatus: string;
  businessStatus: string;
  createdAt: string;
  updatedAt: string;
  propertyType: {
    id: string;
    name: string;
    code: string;
    group: string;
  };
  province: null;
  district: null;
  ward: null;
  address?: string;
}