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

export interface PropertyMedia {
  id: string;
  type: string;
  caption?: string | null;
  sortOrder?: number;
  file?: {
    id: string;
    url: string;
    mimeType?: string;
    originalName?: string;
  };
}

export interface Property {
  id: string;
  propertyCode: string;
  title: string;
  description: string;
  slug: string;
  transactionType: string;
  sellingMode: string;
  visibilityScope: string;
  price: string;
  priceUnit: string;
  area: number;
  areaUnit: string;
  verificationStatus: string;
  publicationStatus: string;
  businessStatus: string;
  dynamicValuesJson: Record<string, unknown> | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  metadata: Record<string, unknown> | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  propertyType: {
    id: string;
    name: string;
    code: string;
    group: string;
  };
  owner: { id: string; fullName: string; email: string; phone: string } | null;
  source: {
    id: string;
    sourceType: string;
    organizationName: string | null;
    contactName: string | null;
    contactPhone: string | null;
  } | null;
  province: { id: string; name: string; code: string } | null;
  district: { id: string; name: string; code: string } | null;
  ward: { id: string; name: string; code: string } | null;
  street: { id: string; name: string; code: string } | null;
  zone: { id: string; name: string; code: string } | null;
  project: { id: string; name: string; code: string; developer: string | null } | null;
  address?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  media?: PropertyMedia[];
}