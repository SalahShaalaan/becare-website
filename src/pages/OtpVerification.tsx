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
} from "../redux/slices/otpVerificationSlice";

export const OtpVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { otp, timer, error, phoneNumber } = useSelector(
    (state: RootState) => state.otpVerification
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

    dispatch(setOtpDigit({ index, value }));
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
      // API call here to verify OTP
      navigate("/verify-card");
    } catch {
      dispatch(setError("رمز التحقق غير صحيح"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 md:py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 backdrop-blur-lg bg-opacity-90 transform transition-all duration-300 hover:shadow-2xl">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#146394]">
              استكمال بيانات الطلب
            </h1>
            <h2 className="text-xl font-semibold text-[#146394]">
              تحقيق رقم الجوال
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                تم ارسال رسالة نصية إلى جوالك لربط الوثيقة على رقم الهاتف الخاص
                بك!
              </p>
              <p className="text-gray-600">
                يرجى ادخال رمز التحقق المرسل إلى جوالك رقم
              </p>
              <p className="font-bold text-lg text-[#146394] dir-ltr">
                {phoneNumber}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center gap-3 md:gap-4 dir-ltr">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(index, e.target.value.replace(/\D/g, ""))
                    }
                    className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-bold border-2 rounded-lg focus:border-[#146394] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    autoComplete="off"
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center animate-pulse">
                  {error}
                </p>
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-gray-600">
                سيتم إرسال رسالة كود التحقق في خلال
              </p>
              <p className="font-bold text-[#146394]">
                {formatTime(timer)} دقيقة
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#146394] text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:bg-[#0f4c70] hover:scale-[0.99] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={otp.some((digit) => !digit)}
            >
              تأكيد
            </button>

            {timer === 0 && (
              <button
                type="button"
                onClick={() => dispatch(resetTimer())}
                className="w-full text-[#146394] py-2 font-semibold hover:text-[#0f4c70] transition-colors"
              >
                إعادة إرسال الرمز
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
