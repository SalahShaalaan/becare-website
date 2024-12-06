import { FaCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img
              src="/logo.svg"
              alt="B-Care Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>
        </div>
        <div className="flex items-center">
          <button className="bg-[#146394] p-2 rounded-full">
            <FaCircleUser className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
