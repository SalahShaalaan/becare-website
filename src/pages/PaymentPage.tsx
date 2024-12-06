import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { PaymentSchema } from "../redux/slices/paymentSlice";
import {
  updateFormField,
  setSubmitting,
  resetForm,
} from "../redux/slices/paymentSlice";
import { PolicyDetails } from "../components/payment/PolicyDetails";
import { PaymentMethods } from "../components/payment/PaymentMethods";
import { PaymentForm } from "../components/payment/PaymentForm";
import { PaymentSummary } from "../components/payment/PaymentSummary";
import { PaymentService } from "../services/PaymentService";
import type { PaymentFormData } from "../types/payment";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { formData, isSubmitting, policyDetails, summaryDetails } = useSelector(
    (state: RootState) => state.payment
  );

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(PaymentSchema),
    mode: "onBlur",
    defaultValues: formData,
  });

  const handleSubmit = async (data: PaymentFormData) => {
    dispatch(setSubmitting(true));
    try {
      // Simulate API call
      await PaymentService.processPayment(data);
      dispatch(updateFormField(data));
      dispatch(resetForm());
    } catch (error) {
      console.error("Payment submission error:", error);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <PolicyDetails policyDetails={policyDetails} />
            <PaymentMethods />
            <PaymentForm
              form={form}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>
          <div className="lg:sticky lg:top-40 h-fit">
            <PaymentSummary summaryDetails={summaryDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
