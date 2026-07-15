import Purchase from "../models/Purchase";
import Course from "../models/Course";
import { AppError } from "../middleware/errorHandler";
import { PurchaseStatus, PaymentStatus } from "../types/purchase.types";

interface CreatePurchaseData {
  name: string;
  phone: string;
  courseId: string;
  courseTitle?: string;
  amount: number | string;
  email?: string;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface PurchaseResult {
  success: boolean;
  data?: {
    purchaseId: string;
    studentName: string;
    courseTitle: string;
    amount: number;
    status: string;
  };
  message?: string;
  error?: string;
}

class PurchaseService {
  /**
   * Create a new purchase/enrollment
   */
  async createPurchase(data: CreatePurchaseData): Promise<PurchaseResult> {
    try {
      // Validate phone
      if (!/^01[3-9]\d{8}$/.test(data.phone.trim())) {
        return {
          success: false,
          error: "Invalid phone number format",
        };
      }
      
      // Parse amount
      let parsedAmount: number;
      if (typeof data.amount === "number") {
        parsedAmount = data.amount;
      } else {
        const cleaned = String(data.amount).replace(/[৳$\s,]/g, "");
        parsedAmount = parseFloat(cleaned);
      }
      
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return {
          success: false,
          error: "Invalid amount",
        };
      }
      
      // Find course
      const course = await Course.findOne({
        $or: [{ _id: data.courseId }, { slug: data.courseId }],
      });
      
      if (!course) {
        return {
          success: false,
          error: "Course not found",
        };
      }
      
      // Check for duplicate
      const duplicate = await Purchase.findDuplicate(
        data.phone.trim(),
        course._id.toString()
      );
      
      if (duplicate) {
        return {
          success: false,
          error: "Duplicate enrollment detected. You have already submitted for this course.",
        };
      }
      
      // Create purchase
      const purchase = await Purchase.create({
        studentName: data.name.trim(),
        studentPhone: data.phone.trim(),
        studentEmail: data.email?.trim() || undefined,
        course: course._id,
        courseTitle: data.courseTitle || course.title.en || course.title.bn || "Course",
        courseSlug: course.slug,
        instructor: course.instructor,
        instructorName: course.instructorName,
        items: [
          {
            courseId: course._id,
            courseTitle: data.courseTitle || course.title.en || "Course",
            courseSlug: course.slug,
            amount: parsedAmount,
            originalAmount: course.originalPrice || undefined,
          },
        ],
        totalAmount: parsedAmount,
        originalTotalAmount: course.originalPrice || undefined,
        notes: data.notes?.trim() || undefined,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });
      
      return {
        success: true,
        data: {
          purchaseId: purchase.purchaseId,
          studentName: purchase.studentName,
          courseTitle: purchase.courseTitle,
          amount: purchase.totalAmount,
          status: purchase.status,
        },
        message: "Enrollment submitted successfully!",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to create purchase",
      };
    }
  }

  /**
   * Get student's purchases by phone
   */
  async getStudentPurchases(phone: string) {
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      throw new AppError("Invalid phone number format", 400);
    }
    
    const purchases = await Purchase.findByPhone(phone, 50);
    
    return purchases.map((purchase) => ({
      purchaseId: purchase.purchaseId,
      courseTitle: purchase.courseTitle,
      courseSlug: purchase.courseSlug,
      amount: purchase.totalAmount,
      status: purchase.status,
      paymentStatus: purchase.paymentStatus,
      createdAt: purchase.createdAt,
    }));
  }

  /**
   * Verify and confirm payment
   */
  async confirmPayment(
    purchaseId: string,
    paymentInfo: {
      method: string;
      transactionId?: string;
      senderNumber?: string;
    }
  ) {
    const purchase = await Purchase.findByPurchaseId(purchaseId);
    
    if (!purchase) {
      throw new AppError("Purchase not found", 404);
    }
    
    if (purchase.paymentStatus === "paid") {
      throw new AppError("Payment already confirmed", 400);
    }
    
    purchase.paymentInfo = {
      ...purchase.paymentInfo,
      ...paymentInfo,
      paidAt: new Date(),
    };
    purchase.paymentStatus = "paid";
    purchase.status = "confirmed";
    
    await purchase.save();
    
    return purchase;
  }

  /**
   * Get instructor dashboard data
   */
  async getInstructorDashboard(instructorId: string) {
    const [stats, recentPurchases] = await Promise.all([
      Purchase.getInstructorStats(instructorId),
      Purchase.find({ instructor: instructorId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("purchaseId studentName courseTitle totalAmount status createdAt"),
    ]);
    
    return {
      stats,
      recentPurchases,
    };
  }
}

export default new PurchaseService();