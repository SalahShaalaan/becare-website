import { useState } from "react";
import { get, useForm } from "react-hook-form";
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
import { motion, AnimatePresence } from "framer-motion";
import { convertToTimestamp, createOrder } from "../apis/orders";

const AdPopup = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-2xl max-w-lg w-full overflow-hidden"
    >
      <img
        src="/ad-popup.jpg"
        alt="Special Offer"
        className="w-full h-auto object-cover"
      />
      <div className="p-6 text-center">
        <button
          onClick={onClose}
          className="bg-[#146394] text-white px-8 py-3 rounded-lg font-semibold transition-all hover:bg-[#0f4c70] transform hover:scale-[0.98] active:scale-[0.97]"
        >
          متابعة
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const PaymentPage = () => {
  const [showAd, setShowAd] = useState(true);
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
      await PaymentService.processPayment(data);
      dispatch(updateFormField(data));
      dispatch(resetForm());
    } catch (error) {
      console.error("فشل الدفع", error);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  return (
    <>
      <AnimatePresence>
        {showAd && <AdPopup onClose={() => setShowAd(false)} />}
      </AnimatePresence>

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
    </>
  );
};

export default PaymentPage;
