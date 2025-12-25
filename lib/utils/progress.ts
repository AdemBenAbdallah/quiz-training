export interface InitialProgressEntry {
  id: string;
  userId: string;
  certificateId: string;
  levelId: number;
  passed: boolean;
}

/**
 * Creates initial progress entries for a user and certificate
 * @param userId - The user's ID
 * @param certificateId - The certificate ID (slug or UUID)
 * @param totalLevels - Total number of levels for this certificate (default: 8)
 * @returns Array of initial progress objects ready for database insertion
 */
export function createInitialProgress(
  userId: string,
  certificateId: string,
  totalLevels: number = 8,
) {
  const initialProgress = [];

  for (let levelId = 1; levelId <= totalLevels; levelId++) {
    initialProgress.push({
      id: `${userId}_${certificateId}_${levelId}`,
      userId,
      certificateId,
      levelId,
      passed: false,
    });
  }

  return initialProgress;
}

/**
 * Creates initial progress for a certificate using its slug
 * This function looks up the actual certificate ID and creates progress
 * @param userId - The user's ID
 * @param certificateSlug - The certificate slug (e.g., "dvac02", "ansc01")
 * @param totalLevels - Total number of levels for this certificate (default: 8)
 * @returns Array of initial progress objects ready for database insertion
 */
export async function createInitialProgressBySlug(
  userId: string,
  certificateSlug: string,
  totalLevels: number = 8,
) {
  try {
    // Import dynamically to avoid circular dependencies
    const { getCertificateBySlug } = await import("@/lib/certificates");
    const certificate = getCertificateBySlug(certificateSlug);

    if (!certificate) {
      throw new Error(`Certificate with slug '${certificateSlug}' not found`);
    }

    return createInitialProgress(userId, certificate.id, totalLevels);
  } catch (error) {
    console.error(
      `Error creating initial progress for certificate ${certificateSlug}:`,
      error,
    );
    throw error;
  }
}

/**
 * Creates initial progress for a new user with default certificate
 * @param userId - The user's ID
 * @param totalLevels - Total number of levels (default: 8)
 * @returns Array of initial progress entries for default certificate
 */
export function createInitialProgressForNewUser(
  userId: string,
  totalLevels: number = 8,
) {
  const defaultCertificateId = "dvac02"; // AWS Certified Developer Associate
  return createInitialProgress(userId, defaultCertificateId, totalLevels);
}

/**
 * Initialize progress for a user across multiple certificates
 * @param userId - The user's ID
 * @param certificateSlugs - Array of certificate slugs to initialize
 * @returns Promise that resolves when all progress is initialized
 */
export async function initializeUserProgress(
  userId: string,
  certificateSlugs: string[] = ["dvac02"], // Default to Developer Associate
) {
  try {
    const { db } = await import("@/db");
    const { userLevelProgress } = await import("@/db/schema");

    const allInitialProgress = [];

    for (const slug of certificateSlugs) {
      try {
        const progress = await createInitialProgressBySlug(userId, slug);
        allInitialProgress.push(...progress);
      } catch (error) {
        console.error(
          `Failed to initialize progress for certificate ${slug}:`,
          error,
        );
        // Continue with other certificates even if one fails
      }
    }

    if (allInitialProgress.length > 0) {
      await db.insert(userLevelProgress).values(allInitialProgress);
      console.log(`Initialized progress for user ${userId}:`, {
        certificates: certificateSlugs,
        totalRecords: allInitialProgress.length,
      });
    }

    return allInitialProgress;
  } catch (error) {
    console.error("Error initializing user progress:", error);
    throw error;
  }
}
