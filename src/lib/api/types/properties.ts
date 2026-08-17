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

export interface GetPropertyItemResponse {
  success: boolean;
  data: Property;
  timestamp: string;
}

export interface Property {
  id: string;
  propertyCode: string;
  title: string;
  description: string;
  slug: string;
  transactionType: string;
  sellingMode: string;
  price: string;
  priceUnit: string;
  area: number;
  areaUnit: string;
  publicationStatus: string;
  businessStatus: string;
  verificationStatus?: string;
  createdAt: string;
  updatedAt: string;
  propertyType: {
    id: string;
    name: string;
    code: string;
    group: string;
  };
  province: {
    id: string;
    name: string;
    code: string;
  };
  district: {
    id: string;
    name: string;
    code: string;
  };
  ward: {
    id: string;
    name: string;
    code: string;
  };
  address?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
}