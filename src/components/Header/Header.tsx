import Image from "next/image";
import MobileLogo from "../../../public/assests/logo/logo_mobile.png";
import Select from "./Select";

export default function Header() {
  return (
    <header className="bg-white flex p-4 justify-between">
      <div className="flex space-x-4">
        <div>
          <Image src={MobileLogo} alt="Mobile Logo" />
        </div>
        <div className="flex justify-center items-center">
          <h1 className="text-primary font-bold">Louka Altdorf Reynes</h1>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Select />
      </div>
    </header>
  );
}
