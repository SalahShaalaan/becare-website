import { motion } from "framer-motion";

const CompanySection = () => {
  const companies = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    logo: `/companies/company-${i + 1}.png`,
    alt: `Company ${i + 1}`,
  }));

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-center text-[#136494] mb-12">
          مصرح من
        </h2>

        {/* Logos Container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{
              x: [-100, -50, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* First Set of Logos */}
            {companies.map((company) => (
              <div
                key={company.id}
                className="flex-shrink-0 w-32 h-32 flex items-center justify-center"
              >
                <img
                  src={company.logo}
                  alt={company.alt}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}

            {/* Duplicate Set for Seamless Animation */}
            {companies.map((company) => (
              <div
                key={`duplicate-${company.id}`}
                className="flex-shrink-0 w-32 h-32 flex items-center justify-center"
              >
                <img
                  src={company.logo}
                  alt={company.alt}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
