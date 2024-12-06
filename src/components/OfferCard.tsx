import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updatePaymentDetails } from "../redux/slices/paymentSlice";
import { RootState } from "../redux/store";

interface OfferProps {
  offer: {
    id: string;
    name: string;
    type: string;
    main_price: string;
    company: {
      name: string;
      image_url: string;
    };
    extra_features: Array<{ content: string; price: number }>;
    extra_expenses: Array<{ reason: string; price: number }>;
  };
}

export default function OfferCard({ offer }: OfferProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(parseFloat(offer.main_price));
  const insuranceDetails = useSelector(
    (state: RootState) => state.insuranceDetails
  );

  useEffect(() => {
    const freeFeatureIndices = offer.extra_features
      .map((feature, index) => (feature.price === 0 ? index : -1))
      .filter((index) => index !== -1);
    setSelectedFeatures(freeFeatureIndices);
  }, [offer.extra_features]);

  const calculateTotalPrice = useCallback(() => {
    const basePrice = parseFloat(offer.main_price);
    const featuresPrice = selectedFeatures.reduce((total, index) => {
      return total + offer.extra_features[index].price;
    }, 0);
    return basePrice + featuresPrice;
  }, [offer.main_price, selectedFeatures, offer.extra_features]);

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [selectedFeatures, calculateTotalPrice]);

  const handleFeatureSelection = useCallback(
    (index: number, checked: boolean) => {
      setSelectedFeatures((prev) =>
        checked ? [...prev, index] : prev.filter((i) => i !== index)
      );
    },
    []
  );

  const handleOfferSelection = useCallback(() => {
    const endDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    )
      .toISOString()
      .split("T")[0];

    dispatch(
      updatePaymentDetails({
        policyDetails: {
          insuranceType: getArabicInsuranceType(offer.type),
          company: offer.company.name,
          startDate: insuranceDetails.startDate,
          endDate,
          referenceNumber: Math.floor(
            100000000 + Math.random() * 900000000
          ).toString(),
        },
        summaryDetails: {
          subtotal: totalPrice,
          vat: 0.15,
          total: totalPrice * 1.15,
        },
      })
    );
    navigate("/payment");
  }, [offer, totalPrice, dispatch, navigate]);

  const getArabicInsuranceType = useMemo(
    () => (type: string) => {
      const types = {
        "against-others": "ضد الغير",
        comprehensive: "شامل",
        special: "مميز",
      };
      return types[type as keyof typeof types] || type;
    },
    []
  );

  return (
    <div className="bg-white container mx-auto rounded-xl overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300">
      <div className="relative flex flex-col lg:flex-row">
        <div className="absolute top-4 right-4">
          <span
            className="relative inline-block px-6 py-2 text-sm font-bold text-white 
  bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg
  transform hover:scale-105 transition-all duration-300 hover:shadow-xl active:scale-100
  before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 
  before:w-6 before:h-6 before:rotate-45 before:bg-gradient-to-r before:from-blue-600 before:to-blue-400
  before:shadow-lg
  after:content-[''] after:absolute after:-right-3 after:top-1/2 after:-translate-y-1/2 
  after:w-6 after:h-6 after:rotate-45 after:bg-gradient-to-r after:from-blue-600 after:to-blue-400
  after:shadow-lg"
          >
            {getArabicInsuranceType(offer.type)}
          </span>
        </div>

        <div className="w-full lg:w-1/4 p-8 flex items-center justify-center bg-gray-50">
          <img
            src={offer.company.image_url}
            alt={`شعار ${offer.company.name}`}
            className="h-28 object-contain transform hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <div className="w-full lg:w-2/4 p-6 border-t-[3rem] border-sky-500 ">
          <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
            المنافع الإضافية
          </h3>

          <div className="space-y-4">
            {offer.extra_features.map((feature, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg transition-all duration-200 ${
                  feature.price === 0
                    ? "bg-[#ddd]/50 cursor-default"
                    : "hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(index)}
                  disabled={feature.price === 0}
                  onChange={(e) =>
                    handleFeatureSelection(index, e.target.checked)
                  }
                  className="ml-4 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`اختيار ${feature.content}`}
                />
                <div className="flex-1 border-b p-1">
                  <span className="text-gray-800 font-medium">
                    {feature.content}
                  </span>
                </div>
                {feature.price > 0 && (
                  <span className="text-gray-700 font-bold">
                    {feature.price} ريال
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/4 p-8 bg-gradient-to-b from-gray-50 to-white flex flex-col justify-center border-r">
          <div className="text-center space-y-6">
            <div>
              <span className="block text-sm text-gray-500 mb-2">
                السعر النهائي
              </span>
              <span className="text-4xl font-bold text-blue-600">
                {totalPrice.toFixed(2)} ريال
              </span>
            </div>

            <button
              onClick={handleOfferSelection}
              className="w-1/2 bg-[#ffa500] hover:bg-[#ff9000] active:bg-[#f08800] text-white font-bold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              aria-label="شراء الان"
            >
              شراء الان
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
