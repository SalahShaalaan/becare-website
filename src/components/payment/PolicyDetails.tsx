import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface PolicyDetailsProps {
  policyDetails: {
    insuranceType: string;
    company: string;
    startDate: string;
    referenceNumber: string;
    endDate: string;
  };
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="text-right">
    <p className="text-gray-600 mb-1">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

export const PolicyDetails = ({ policyDetails }: PolicyDetailsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 backdrop-blur-lg bg-opacity-95 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl md:text-2xl font-bold text-right mb-6 text-[#146394]">
        تفاصيل الوثيقة
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <DetailItem label="نوع التأمين" value={policyDetails.insuranceType} />
          <DetailItem label="شركة التأمين" value={policyDetails.company} />
          <DetailItem
            label="تاريخ بدء الوثيقة"
            value={format(new Date(policyDetails.startDate), "dd MMMM yyyy", {
              locale: ar,
            })}
          />
        </div>
        <div className="space-y-4">
          <DetailItem
            label="الرقم المرجعي للتسعيرة"
            value={policyDetails.referenceNumber}
          />
          <DetailItem
            label="تاريخ انتهاء الوثيقة"
            value={format(new Date(policyDetails.endDate), "dd MMMM yyyy", {
              locale: ar,
            })}
          />
        </div>
      </div>
    </div>
  );
};
