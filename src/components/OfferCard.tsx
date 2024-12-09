import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updatePaymentDetails } from "../redux/slices/paymentSlice";
import { RootState } from "../redux/store";
import { convertToTimestamp, createOrder } from "../apis/orders";

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

  const [isProcessing, setIsProcessing] = useState(false);

  const handleOfferSelection = useCallback(async () => {
    setIsProcessing(true);

    const endDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    )
      .toISOString()
      .split("T")[0];

    // const selectedOfferData = {
    //   id: offer.id,
    //   name: offer.name,
    //   company_id: crypto.randomUUID(),
    //   type: offer.type,
    //   main_price: parseFloat(offer.main_price),
    //   selectedFeatures: offer.extra_features.filter((_, index) =>
    //     selectedFeatures.includes(index)
    //   ),
    //   totalPrice,
    //   company: offer.company,
    //   purchaseDate: new Date().toISOString(),
    // };

    const selectedOfferData = {
      id: offer.id,
      name: offer.name,
      company_id: crypto.randomUUID(),
      type: offer.type,
      main_price: parseFloat(offer.main_price),
      selectedFeatures: selectedFeatures.map((index) => ({
        ...offer.extra_features[index],
        id: offer.extra_features[index].id, // Use the feature ID from API
      })),
      totalPrice,
      company: offer.company,
      purchaseDate: new Date().toISOString(),
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const existingOffers = JSON.parse(
      localStorage.getItem("selectedOffers") || "[]"
    );
    existingOffers.push(selectedOfferData);
    localStorage.setItem("selectedOffers", JSON.stringify(existingOffers));

    dispatch(
      updatePaymentDetails({
        policyDetails: {
          insurance_type: getArabicInsuranceType(offer.type),
          company: offer.company.name,
          start_date: insuranceDetails.start_date,
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
    //////////////////////////////////////////////////////////
    const {
      owner_identity_number,
      buyer_identity_number,
      seller_identity_number,
      documment_owner_full_name: document_owner_full_name,
      serial_number,
      customs_code,
      insurance_purpose, // insurance_purpose
    } = JSON.parse(localStorage.getItem("insuranceFormData"));
    const {
      estimated_worth,
      insurance_type,
      repair_place,
      start_date,
      vehicle_use_purpose: vehicule_use_purpose,
      year,
    } = JSON.parse(localStorage.getItem("insuranceDetails"));
    let { selectedFeatures: selected_extra_features } = JSON.parse(
      localStorage.getItem("selectedOffers")
    )[0];
    selected_extra_features = selected_extra_features.reduce((acc, feature) => {
      const id = feature.id;
      return [...acc, id];
    }, []);

    const orderData = {
      insurance_purpose,
      insurance_type,
      document_owner_full_name,
      owner_identity_number,
      buyer_identity_number,
      seller_identity_number,
      start_date: convertToTimestamp(start_date),
      vehicule: {
        serial_number,
        year: +year,
        customs_code: customs_code ? customs_code : "غير محدد",
        vehicule_use_purpose: vehicule_use_purpose
          ? vehicule_use_purpose
          : "personal",
        estimated_worth: +estimated_worth,
        repair_place,
      },
      selected_extra_features,
    };
    // console.log(orderData);
    // console.log(selected_extra_features);

    const order_id = await createOrder(offer.id, orderData);
    localStorage.setItem("order_id", JSON.stringify(order_id));
    ///////////////////////////////////////////////////
    setIsProcessing(false);
    navigate("/payment");
  }, [
    offer,
    totalPrice,
    dispatch,
    navigate,
    insuranceDetails.start_date,
    selectedFeatures,
  ]);

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
        {/* Company Logo Section */}
        <div className="w-full lg:w-1/4 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center bg-gray-50">
          <span
            className="mb-4 relative inline-block px-4 sm:px-6 py-1.5 sm:py-2 text-sm font-bold text-white 
            bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg rounded-full
            transform hover:scale-105 transition-all duration-300 hover:shadow-xl active:scale-100"
          >
            {getArabicInsuranceType(offer.type)}
          </span>
          <img
            src={offer.company.image_url}
            alt={`شعار ${offer.company.name}`}
            className="h-20 sm:h-24 lg:h-28 object-contain transform hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Features Section */}
        <div className="w-full lg:w-2/4 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 border-b pb-3">
            المنافع الإضافية
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {/* Feature items with responsive spacing */}
            {offer.extra_features.map((feature, index) => (
              <label
                key={index}
                className={`flex items-center p-3 sm:p-4 rounded-lg transition-all duration-200 ${
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
                  className="ml-3 sm:ml-4 h-4 sm:h-5 w-4 sm:w-5 text-blue-600"
                />
                <div className="flex-1 border-b p-1">
                  <span className="text-sm sm:text-base text-gray-800 font-medium">
                    {feature.content}
                  </span>
                </div>
                {feature.price > 0 && (
                  <span className="text-sm sm:text-base text-gray-700 font-bold whitespace-nowrap">
                    {feature.price} ريال
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Price Section */}
        <div className="w-full lg:w-1/4 p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white flex flex-col justify-center border-t lg:border-t-0 lg:border-r">
          <div className="text-center space-y-4 sm:space-y-6">
            <div>
              <span className="block text-xs sm:text-sm text-gray-500 mb-2">
                السعر النهائي
              </span>
              <span className="text-2xl  font-bold text-blue-600">
                {totalPrice.toFixed(2)} ريال
              </span>
            </div>
            <button
              onClick={handleOfferSelection}
              disabled={isProcessing}
              className="w-full sm:w-2/3 lg:w-1/2 bg-[#ffa500] hover:bg-[#ff9000] active:bg-[#f08800] text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  جاري المعالجة...
                </div>
              ) : (
                "شراء الان"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
