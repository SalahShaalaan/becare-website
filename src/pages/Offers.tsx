import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import OfferCard from "../components/OfferCard";
import { motion } from "framer-motion";

interface Company {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface Offer {
  id: string;
  name: string;
  company_id: string;
  type: FilterType;
  main_price: string;
  created_at: string;
  updated_at: string;
  company: Company;
  extra_features: Array<{ content: string; price: number }>;
  extra_expenses: Array<{ reason: string; price: number }>;
}

type FilterType = "against-others" | "special" | "comprehensive";

interface InsuranceTypeOption {
  id: FilterType;
  label: string;
  ariaLabel: string;
}
export default function Offers() {
  const selectedInsuranceType = useSelector(
    (state: RootState) => state.insuranceDetails.insuranceType as FilterType
  );

  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: selectedInsuranceType,
    company: "",
  });

  const insuranceTypes: InsuranceTypeOption[] = useMemo(
    () => [
      { id: "against-others", label: "ضد الغير", ariaLabel: "تأمين ضد الغير" },
      { id: "comprehensive", label: "شامل", ariaLabel: "تأمين شامل" },
      { id: "special", label: "مميز", ariaLabel: "تأمين مميز" },
    ],
    []
  );

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://newinsu.site/api/offers");
      if (!response.ok) throw new Error("فشل في تحميل العروض");
      const data = await response.json();
      setOffers(data);
      setFilteredOffers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...offers];

    if (filters.type) {
      filtered = filtered.filter((offer) => offer.type === filters.type);
    }

    if (filters.company) {
      filtered = filtered.filter(
        (offer) => offer.company.name === filters.company
      );
    }

    setFilteredOffers(filtered);
  }, [filters, offers]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      type: selectedInsuranceType,
    }));
  }, [selectedInsuranceType]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleTypeChange = useCallback((typeId: FilterType) => {
    setFilters((prev) => ({ ...prev, type: typeId }));
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-lg text-gray-600">جاري تحميل العروض...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50"
        role="alert"
      >
        <div className="bg-red-50 text-red-700 p-4 rounded-lg shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 md:py-12">
      <div className=" px-4 sm:px-6 lg:px-8 container mx-auto">
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-8"
          role="region"
          aria-label="فلترة العروض"
        >
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 w-full sm:items-center">
            <h2 className="text-xl text-[#146394] font-semibold">
              نوع التأمين
            </h2>
            <div
              className="grid grid-cols-3  gap-3 md:w-1/3 w-fit"
              role="radiogroup"
              aria-label="اختيار نوع التأمين"
            >
              {insuranceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(type.id)}
                  aria-pressed={filters.type === type.id}
                  aria-label={type.ariaLabel}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 text-base  whitespace-nowrap
                    ${
                      filters.type === type.id
                        ? "bg-[#146394] text-white shadow-lg transform scale-105"
                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#146394] hover:text-[#146394]"
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </motion.section>
        <section className="space-y-6" aria-label="قائمة العروض">
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <OfferCard offer={offer} />
                <hr className="mt-8 container mx-auto  border-4 border-[#146394]" />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
              role="status"
              aria-live="polite"
            >
              <div className="text-gray-500 text-xl">
                لا توجد عروض متاحه الان
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </main>
  );
}
