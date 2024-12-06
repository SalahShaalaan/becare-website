import { motion } from "framer-motion";
import { InsuranceFormData } from "../../types/insurance";

interface Props {
  formData: InsuranceFormData;
  setFormData: React.Dispatch<React.SetStateAction<InsuranceFormData>>;
  errors: Partial<Record<keyof InsuranceFormData, string>>;
}

const InsurancePurpose: React.FC<Props> = ({
  formData,
  setFormData,
  errors,
}) => {
  // When purpose changes, reset related fields
  const handlePurposeChange = (newPurpose: "new" | "transfer") => {
    setFormData((prev) => ({
      ...prev,
      purpose: newPurpose,
      // Reset fields when switching purpose
      nationalId: "",
      buyerNationalId: "",
      sellerNationalId: "",
      // Force registration type when transfer is selected
      vehicleType:
        newPurpose === "transfer" ? "registration" : prev.vehicleType,
    }));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-50 rounded-xl p-6"
    >
      <h3 className="text-2xl font-bold text-[#146394] mb-6 pb-3 border-b-2">
        الغرض من التأمين
      </h3>

      <div className="space-y-6">
        <div className="flex gap-4">
          {[
            { value: "new", label: "تأمين جديد" },
            { value: "transfer", label: "نقل ملكية" },
          ].map((option) => (
            <label key={option.value} className="flex-1">
              <input
                type="radio"
                name="purpose"
                value={option.value}
                checked={formData.purpose === option.value}
                onChange={() =>
                  handlePurposeChange(option.value as "new" | "transfer")
                }
                className="hidden"
              />
              <span
                className={`block text-center py-3 rounded-lg transition-all duration-200 cursor-pointer
                ${
                  formData.purpose === option.value
                    ? "bg-[#146394] text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-[#146394] hover:bg-gray-200"
                }`}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>

        {/* Dynamic Fields Based on Purpose */}
        <div className="space-y-4">
          <div>
            <label className="block text-[#146394] font-bold mb-2">
              اسم مالك الوثيقة بالكامل
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              className={`w-full px-4 py-3 border-2 rounded-lg ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="أدخل اسم مالك الوثيقة بالكامل"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {formData.purpose === "new" ? (
            <div>
              <label className="block text-[#146394] font-bold mb-2">
                رقم الهوية الوطنية
              </label>
              <input
                type="text"
                value={formData.nationalId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nationalId: e.target.value,
                  }))
                }
                className={`w-full px-4 py-3 border-2 rounded-lg ${
                  errors.nationalId ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="أدخل رقم الهوية"
              />
              {errors.nationalId && (
                <p className="text-red-500 text-xs mt-1">{errors.nationalId}</p>
              )}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[#146394] font-bold mb-2">
                  رقم هوية المشتري
                </label>
                <input
                  type="text"
                  value={formData.buyerNationalId || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      buyerNationalId: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.buyerNationalId
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="أدخل رقم هوية المشتري"
                />
                {errors.buyerNationalId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.buyerNationalId}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[#146394] font-bold mb-2">
                  رقم هوية البائع
                </label>
                <input
                  type="text"
                  value={formData.sellerNationalId || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sellerNationalId: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.sellerNationalId
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="أدخل رقم هوية البائع"
                />
                {errors.sellerNationalId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sellerNationalId}
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

export default InsurancePurpose;
