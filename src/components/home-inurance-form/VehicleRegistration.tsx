import React from "react";
import { motion } from "framer-motion";
import { InsuranceFormData } from "../../types/insurance";

interface Props {
  formData: InsuranceFormData;
  setFormData: React.Dispatch<React.SetStateAction<InsuranceFormData>>;
  errors: Partial<Record<keyof InsuranceFormData, string>>;
  disabled?: boolean;
}

const VehicleRegistration: React.FC<Props> = ({
  formData,
  setFormData,
  errors,
  disabled,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
    >
      <h3 className="text-2xl font-bold text-[#146394] mb-6 pb-3 border-b-2 border-[#146394]">
        نوع تسجيل المركبة
      </h3>

      <div className="space-y-6">
        <div className="flex gap-4 mb-4">
          {[
            { value: "registration", label: "استمارة" },
            { value: "customs", label: "بطاقة جمركية" },
          ].map((option) => (
            <label key={option.value} className="flex-1">
              <input
                type="radio"
                name="vehicleType"
                value={option.value}
                checked={formData.vehicleType === option.value}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    vehicleType: e.target.value as "registration" | "customs",
                  }));
                }}
                disabled={disabled && option.value === "customs"}
                className="hidden"
              />
              <span
                className={`block text-center py-3 rounded-lg transition-all duration-200 cursor-pointer
                  ${
                    formData.vehicleType === option.value
                      ? "bg-[#146394] text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-[#146394] hover:bg-gray-200"
                  }
                  ${
                    disabled && option.value === "customs"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>

        {/* Dynamic Fields Based on Vehicle Type */}
        <div className="space-y-4">
          {formData.vehicleType === "registration" ? (
            <>
              <div>
                <label className="block text-[#146394] font-bold mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أدخل رقم الهاتف"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[#146394] font-bold mb-2">
                  الرقم التسلسلي للمركبة
                </label>
                <input
                  type="text"
                  value={formData.vehicleSerialNumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vehicleSerialNumber: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.vehicleSerialNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="أدخل الرقم التسلسلي للمركبة"
                />
                {errors.vehicleSerialNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.vehicleSerialNumber}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[#146394] font-bold mb-2">
                  رقم صنع المركبة
                </label>
                <input
                  type="text"
                  value={formData.vehicleManufactureNumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vehicleManufactureNumber: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.vehicleManufactureNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="أدخل رقم صنع المركبة"
                />
                {errors.vehicleManufactureNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.vehicleManufactureNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[#146394] font-bold mb-2">
                  رقم البطاقة الجمركية
                </label>
                <input
                  type="text"
                  value={formData.customsCardNumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customsCardNumber: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.customsCardNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="أدخل رقم البطاقة الجمركية"
                />
                {errors.customsCardNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.customsCardNumber}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleRegistration;
