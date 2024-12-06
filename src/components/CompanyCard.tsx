interface OfferCardProps {
  id: number;
  companyName: string;
  offerAmount: string;
  logo: string;
}

export function OfferCard({ logo, companyName, offerAmount }: OfferCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex-shrink-0">
        <img src={logo} alt={`${companyName} logo`} className="w-16 h-auto" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{companyName}</h3>
        <p className="text-green-600 font-medium">{offerAmount} خصم </p>
      </div>
    </div>
  );
}
