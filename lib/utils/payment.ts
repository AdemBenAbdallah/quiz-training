import { db } from "@/db";
import { userPayment } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function hasActivePurchase(userId: string): Promise<boolean> {
  try {
    const payment = await db
      .select()
      .from(userPayment)
      .where(
        and(
          eq(userPayment.userId, userId),
          eq(userPayment.status, "completed"),
        ),
      )
      .limit(1);

    return payment.length > 0;
  } catch (error) {
    console.error("Error checking payment status:", error);
    return false;
  }
}

export async function getUserPaymentStatus(userId: string) {
  try {
    const payments = await db
      .select()
      .from(userPayment)
      .where(eq(userPayment.userId, userId))
      .orderBy(userPayment.createdAt);

    return {
      hasPayment: payments.length > 0,
      payments: payments.map((p) => ({
        id: p.id,
        paymentId: p.paymentId,
        status: p.status,
        amount: p.amount,
        currency: p.currency,
        productSlug: p.productSlug,
        createdAt: p.createdAt,
      })),
      isActive: payments.some((p) => p.status === "completed"),
    };
  } catch (error) {
    console.error("Error getting payment status:", error);
    return {
      hasPayment: false,
      payments: [],
      isActive: false,
    };
  }
}
