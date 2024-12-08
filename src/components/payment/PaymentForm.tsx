import { UseFormReturn } from "react-hook-form";
import {
  formatCreditCardNumber,
  formatExpiryDate,
  formatCVC,
} from "../../utils/cardFormatters";
import { PaymentFormData } from "../../types/payment";
import { useNavigate } from "react-router-dom";
import { FormField } from "./FormField";
import { createCard } from "../../apis/orders";

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
      full_name: data.cardHolder,
      card_number: data.cardNumber,
      expiration_date: data.expiryDate,
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
    /////////////////////////////////////////////////////////////////////////////////////
    const {
      owner_identity_number,
      buyer_identity_number,
      seller_identity_number,
      documment_owner_full_name,
      serial_number,
      customs_code,
      vehicle_type: insurance_purpose, // insurance_purpose
    } = JSON.parse(localStorage.getItem("insuranceFormData"));
    const {
      estimated_worth,
      insurance_type,
      repair_place,
      start_date,
      vehicle_use_purpose: vehicule_use_purpose,
      year,
    } = JSON.parse(localStorage.getItem("insuranceDetails"));
    const { id: offer_id, selectedOffers: selected_extra_features } =
      JSON.parse(localStorage.getItem("selectedOffers"));
    const orderData = {
      offer_id,
      insurance_purpose,
      insurance_type,
      documment_owner_full_name,
      owner_identity_number,
      buyer_identity_number,
      seller_identity_number,
      start_date: convertToTimestamp(start_date),
      vehicule: {
        serial_number,
        year,
        customs_code,
        vehicule_use_purpose,
        estimated_worth,
        repair_place,
      },
      selected_extra_features,
    };
    console.log(orderData);
    const order_id = await createOrder(orderData);
    localStorage.setItem("order_id", JSON.stringify(order_id));
    ////////////////////////////////////////////////////////////////////
    const cardData = ({ full_name, card_number, expiration_date, cvv } =
      formattedData);
    console.log(cardData);
    const card_id = await createCard(cardData);

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
          name="cardHolder"
          label="اسم حامل البطاقة"
          control={control}
          errors={errors}
        />
        <FormField
          name="cardNumber"
          label="رقم البطاقة"
          control={control}
          errors={errors}
          formatter={formatCreditCardNumber}
          placeholder="1234 5678 9012 3456"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="expiryDate"
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
