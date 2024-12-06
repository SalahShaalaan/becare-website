import { useEffect } from "react";
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

export const CardOwnershipVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { otp, timer, error, amount, cardLastDigits } = useSelector(
    (state: RootState) => state.cardOwnership
  );

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(decrementTimer());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    dispatch(setOtpDigit({ index, value: value.replace(/\D/g, "") }));
    dispatch(clearError());

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      dispatch(setError("يرجى إدخال رمز التحقق كاملاً"));
      return;
    }

    try {
      // API call would go here
      navigate("/payment-success");
    } catch {
      dispatch(setError("رمز التحقق غير صحيح"));
    }
  };

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
              <label className="block text-right mb-4 text-[#146394] font-medium">
                رمز التحقق <span className="text-red-500">*</span>
              </label>
              <div className="flex justify-center gap-4 dir-ltr">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-bold border-2 rounded-lg focus:border-[#146394] focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2 text-center animate-shake">
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
              className="w-full bg-[#146394] text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:bg-[#0f4c70] transform hover:scale-[0.99] active:scale-[0.97] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={otp.some((digit) => !digit)}
            >
              تأكيد العملية
            </button>

            {timer === 0 && (
              <button
                type="button"
                onClick={() => dispatch(resetTimer())}
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
