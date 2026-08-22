import carBrandsJson from "@/data/car-brands.json";

export const CAR_BRANDS: string[] = [...carBrandsJson];
export const OTHER_CAR_BRAND = "Другое";
export const CAR_BRAND_OPTIONS = [...CAR_BRANDS, OTHER_CAR_BRAND];
