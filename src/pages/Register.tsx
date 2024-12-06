// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   FaEye,
//   FaEyeSlash,
//   FaUserAlt,
//   FaEnvelope,
//   FaLock,
// } from "react-icons/fa";
// import { FaPhone } from "react-icons/fa6";
// import { register } from "../apis/auth";

// export const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     fullName: "",
//     username: "",
//     email: "",
//     password: "",
//     phone: "",
//     confirmPassword: "",
//     terms: false,
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     const newErrors = {};
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     const phoneRegex = /^(05)[0-9]{8}$/;

//     if (!phoneRegex.test(formData.phone)) {
//       newErrors.phone = "Please enter a valid Saudi phone number (05xxxxxxxx)";
//     }

//     if (!formData.fullName.trim()) newErrors.fullName = "الاسم بالكامل مطلوب";
//     if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
//       newErrors.email = "عنوان بريد غير صالح";
//     if (!passwordRegex.test(formData.password)) {
//       newErrors.password =
//         "برجاء استخدام كلمة سر اقوى تعقيدا من ذلك, فقط لأمانك";
//     }
//     if (formData.password !== formData.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match";
//     if (!formData.terms) newErrors.terms = "يجب ان توافق على الشروط والأحكام";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const firstName = formData.fullName.trim().split(" ")[0];
//       const lastName = formData.fullName.trim().split(" ").at(-1);

//       await register(
//         firstName,
//         lastName,
//         formData.username,
//         formData.email,
//         formData.phone,
//         formData.password
//       );

//       navigate("/login", {
//         state: { message: "تم انشاء الحساب بنجاح, قم بتسجيل الدخول" },
//       });
//     } catch {
//       setErrors({ submit: "للاسف فشلت العمليه , حاول من جديد" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-200 p-4">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl">
//         <div className="text-center">
//           <h2 className="text-4xl font-bold text-[#146394] mb-2">
//             انشئ حساب جديد
//           </h2>
//           <p className="text-[#146394]">انضم الي مجتمعنا </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaUserAlt className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="الاسم بالكامل"
//               className={`block w-full pl-10 pr-3 py-3 border ${
//                 errors.fullName ? "border-red-500" : "border-gray-300"
//               } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               value={formData.fullName}
//               onChange={(e) =>
//                 setFormData({ ...formData, fullName: e.target.value })
//               }
//             />
//             {errors.fullName && (
//               <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
//             )}
//           </div>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaUserAlt className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="اسم المستخدم"
//               className={`block w-full pl-10 pr-3 py-3 border border-gray-300
//                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               value={formData.username}
//               onChange={(e) =>
//                 setFormData({ ...formData, username: e.target.value })
//               }
//             />
//           </div>

//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaEnvelope className="text-gray-400" />
//             </div>
//             <input
//               type="email"
//               placeholder="البريد الالكتروني"
//               className={`block w-full pl-10 pr-3 py-3 border ${
//                 errors.email ? "border-red-500" : "border-gray-300"
//               } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//             />
//             {errors.email && (
//               <p className="mt-1 text-sm text-red-500">{errors.email}</p>
//             )}
//           </div>

//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaPhone className="text-gray-400" />
//             </div>
//             <input
//               type="tel"
//               placeholder="رقم الهاتف (05xxxxxxxx)"
//               className={`block w-full pl-10 pr-3 py-3 border ${
//                 errors.phone ? "border-red-500" : "border-gray-300"
//               } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               value={formData.phone}
//               onChange={(e) =>
//                 setFormData({ ...formData, phone: e.target.value })
//               }
//             />
//             {errors.phone && (
//               <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
//             )}
//           </div>

//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaLock className="text-gray-400" />
//             </div>
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="كلمة السر"
//               className={`block w-full pl-10 pr-10 py-3 border ${
//                 errors.password ? "border-red-500" : "border-gray-300"
//               } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({ ...formData, password: e.target.value })
//               }
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? (
//                 <FaEyeSlash className="text-gray-400" />
//               ) : (
//                 <FaEye className="text-gray-400" />
//               )}
//             </button>
//             {errors.password && (
//               <p className="mt-1 text-sm text-red-500">{errors.password}</p>
//             )}
//           </div>

//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaLock className="text-gray-400" />
//             </div>
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="تأكيد كلمة السر"
//               className={`block w-full pl-10 pr-3 py-3 border ${
//                 errors.confirmPassword ? "border-red-500" : "border-gray-300"
//               } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               value={formData.confirmPassword}
//               onChange={(e) =>
//                 setFormData({ ...formData, confirmPassword: e.target.value })
//               }
//             />
//             {errors.confirmPassword && (
//               <p className="mt-1 text-sm text-red-500">
//                 {errors.confirmPassword}
//               </p>
//             )}
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               checked={formData.terms}
//               onChange={(e) =>
//                 setFormData({ ...formData, terms: e.target.checked })
//               }
//             />
//             <label className="mr-2 block text-sm text-gray-900">
//               انا اوفق علي الشروط والاحكام
//             </label>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <svg
//                 className="animate-spin h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//             ) : (
//               "انشئ حساب"
//             )}
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-600">
//           لديك حساب بالفعل ؟
//           <Link
//             to="/login"
//             className="font-medium text-blue-600 hover:text-blue-500 mr-2"
//           >
//             سجل دخول
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUserAlt,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { register } from "../apis/auth";

interface FormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  confirmPassword: string;
  terms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  terms?: string;
  submit?: string;
}

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    // const passwordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // const phoneRegex = /^(05)[0-9]{8}$/;

    // if (!phoneRegex.test(formData.phone)) {
    //   newErrors.phone = "Please enter a valid Saudi phone number (05xxxxxxxx)";
    // }

    if (!formData.fullName.trim()) newErrors.fullName = "الاسم بالكامل مطلوب";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "عنوان بريد غير صالح";
    // if (!passwordRegex.test(formData.password)) {
    //   newErrors.password =
    //     "برجاء استخدام كلمة سر اقوى تعقيدا من ذلك, فقط لأمانك";
    // }
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "كلمة سر غير مطابقه";
    if (!formData.terms) newErrors.terms = "يجب ان توافق على الشروط والأحكام";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const firstName = formData.fullName.trim().split(" ")[0];
      const lastName =
        formData.fullName.trim().split(" ").length > 1
          ? formData.fullName.trim().split(" ")[
              formData.fullName.trim().split(" ").length - 1
            ]
          : "";
      await register(
        firstName,
        lastName,
        formData.username,
        formData.email,
        formData.phone,
        formData.password
      );

      navigate("/login", {
        state: { message: "تم انشاء الحساب بنجاح, قم بتسجيل الدخول" },
      });
    } catch {
      setErrors({ submit: "للاسف فشلت العمليه , حاول من جديد" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#146394] mb-2">
            انشئ حساب جديد
          </h2>
          <p className="text-[#146394]">انضم الي مجتمعنا </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserAlt className="text-gray-400" />
            </div>
            <input
              type="text"
              name="fullName"
              placeholder="الاسم بالكامل"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.fullName}
              onChange={handleInputChange}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserAlt className="text-gray-400" />
            </div>
            <input
              type="text"
              name="username"
              placeholder="اسم المستخدم"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="البريد الالكتروني"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone className="text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="رقم الهاتف (05xxxxxxxx)"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="كلمة السر"
              className={`block w-full pl-10 pr-10 py-3 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="تأكيد كلمة السر"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="terms"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.terms}
              onChange={handleInputChange}
            />
            <label className="mr-2 block text-sm text-gray-900">
              انا اوفق علي الشروط والاحكام
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "انشئ حساب"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          لديك حساب بالفعل ؟
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 mr-2"
          >
            سجل دخول
          </Link>
        </p>
      </div>
    </div>
  );
};
