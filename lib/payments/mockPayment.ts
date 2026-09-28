export interface ProcessPaymentInput {
  bookingId: string;
  amount: number;
  paymentType: 'ADVANCE' | 'FULL' | 'REMAINING';
  paymentMethod: 'MOCK_CARD' | 'UPI' | 'RAZORPAY_SIMULATION';
  cardNumber?: string;
  cardName?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  message: string;
  error?: string;
}

export async function processPayment(input: ProcessPaymentInput): Promise<PaymentResult> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate a realistic transaction reference
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const transactionId = `TXN-CIN-${Date.now().toString().slice(-4)}${randomSuffix}`;

  return {
    success: true,
    transactionId,
    amount: input.amount,
    message: 'Payment authorized and processed successfully.',
  };
}

/**
 * Interface structure for future Razorpay integration
 */
export interface RazorpayOrderConfig {
  amount: number; // in paise (INR)
  currency: string;
  receipt: string;
}

export function createRazorpayOrderPayload(bookingNumber: string, amountInRupees: number): RazorpayOrderConfig {
  return {
    amount: Math.round(amountInRupees * 100),
    currency: 'INR',
    receipt: `receipt_${bookingNumber}`,
  };
}
