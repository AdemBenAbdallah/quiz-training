import { Certificate } from "@/types/certificate";

// Bundle configuration - client-safe constants
export const BUNDLE_CONFIGS = {
  individual: {
    bundleType: "individual" as const,
    price: 9.99,
    certificateCount: 1,
    description: "1 certification",
  },
  professional: {
    bundleType: "professional" as const,
    price: 24.99,
    certificateCount: 3,
    description: "3 certifications",
  },
  complete: {
    bundleType: "complete" as const,
    price: 49.99,
    certificateCount: 11,
    description: "All 11 certifications",
  },
} as const;

export type BundleType = keyof typeof BUNDLE_CONFIGS;

// Client-side bundle information (for display only)
export interface ClientBundleInfo {
  hasPayment: boolean;
  bundleType: BundleType | null;
  certificateCount: number;
  purchasedCertificates: string[];
}

// Client-side payment status (for display only)
export interface ClientPaymentStatus {
  hasPayment: boolean;
  bundleType: BundleType | null;
  certificateCount: number;
  purchasedCertificates: string[];
  payments: any[];
  isActive: boolean;
  canAccessCertificate?: boolean;
}

// Get bundle information for display - client-side version
export function getBundleDisplayInfo(bundleType: BundleType | null) {
  if (!bundleType || !BUNDLE_CONFIGS[bundleType as BundleType]) {
    return {
      name: "Free",
      price: 0,
      description: "Limited access",
    };
  }

  const config = BUNDLE_CONFIGS[bundleType as BundleType];
  return {
    name: bundleType.charAt(0).toUpperCase() + bundleType.slice(1),
    price: config.price,
    description: config.description,
  };
}

// Validate certificate selection - client-side validation only
export function validateCertificateSelection(
  planType: BundleType,
  selectedCertificates: string[],
  availableCertificates: Certificate[],
): { isValid: boolean; error?: string } {
  const config = BUNDLE_CONFIGS[planType];
  if (!config) {
    return { isValid: false, error: "Invalid plan type" };
  }

  if (selectedCertificates.length !== config.certificateCount) {
    return {
      isValid: false,
      error: `Please select exactly ${config.certificateCount} certification(s)`,
    };
  }

  // Check if selected certificates exist in available list
  const availableIds = availableCertificates.map((cert) => cert.id);
  const invalidCerts = selectedCertificates.filter(
    (id) => !availableIds.includes(id),
  );

  if (invalidCerts.length > 0) {
    return {
      isValid: false,
      error: "One or more selected certifications are not available",
    };
  }

  return { isValid: true };
}

// Get plan configuration by type
export function getPlanConfig(
  planType: string,
): (typeof BUNDLE_CONFIGS)[BundleType] | null {
  return BUNDLE_CONFIGS[planType as BundleType] || null;
}

// Get all plan types for UI
export function getPlanTypes(): BundleType[] {
  return Object.keys(BUNDLE_CONFIGS) as BundleType[];
}

// Calculate total price for multiple items of same plan
export function calculateTotalPrice(
  planType: BundleType,
  quantity: number = 1,
): number {
  const config = BUNDLE_CONFIGS[planType];
  return config.price * quantity;
}

// Format price for display
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// Get plan badge color based on type
export function getPlanBadgeColor(planType: BundleType | null): string {
  switch (planType) {
    case "individual":
      return "bg-blue-500";
    case "professional":
      return "bg-orange-500";
    case "complete":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
}

// Check if user can upgrade from current plan to target plan
export function canUpgradePlan(
  currentPlan: BundleType | null,
  targetPlan: BundleType,
): boolean {
  const planHierarchy = { individual: 1, professional: 2, complete: 3 };

  if (!currentPlan) return true;

  return planHierarchy[targetPlan] > planHierarchy[currentPlan];
}

// Get upgrade suggestion based on current plan
export function getUpgradeSuggestion(
  currentPlan: BundleType | null,
): BundleType | null {
  if (!currentPlan) return "individual";
  if (currentPlan === "individual") return "professional";
  if (currentPlan === "professional") return "complete";
  return null;
}

// Client-side certificate selection helper
export function createCertificateSelector(
  availableCertificates: Certificate[],
  maxSelections: number,
) {
  const selectedCertificates: string[] = [];

  return {
    selected: selectedCertificates,
    toggle: (certificateId: string) => {
      const index = selectedCertificates.indexOf(certificateId);
      if (index >= 0) {
        selectedCertificates.splice(index, 1);
      } else if (selectedCertificates.length < maxSelections) {
        selectedCertificates.push(certificateId);
      }
      return [...selectedCertificates];
    },
    canSelect: (certificateId: string) => {
      return (
        selectedCertificates.length < maxSelections ||
        selectedCertificates.includes(certificateId)
      );
    },
    clear: () => {
      selectedCertificates.length = 0;
      return [...selectedCertificates];
    },
  };
}

// Generate product slug for payment processing
export function generateProductSlug(
  planType: BundleType,
  selectedCertificates: string[] = [],
): string {
  const baseSlug = `${planType}-plan`;

  if (planType === "individual" && selectedCertificates.length > 0) {
    return `${baseSlug}-${selectedCertificates[0]}`;
  }

  if (planType === "professional" && selectedCertificates.length > 0) {
    return `${baseSlug}-${selectedCertificates.sort().join("-")}`;
  }

  return baseSlug;
}

// Parse metadata from checkout (client-side helper)
export function parseCheckoutMetadata(metadata: Record<string, any>): {
  planType?: string;
  selectedCertificates?: string[];
  certificateId?: string;
} {
  return {
    planType: metadata?.planType,
    selectedCertificates: metadata?.selectedCertificates
      ? typeof metadata.selectedCertificates === "string"
        ? JSON.parse(metadata.selectedCertificates)
        : metadata.selectedCertificates
      : [],
    certificateId: metadata?.certificateId,
  };
}
