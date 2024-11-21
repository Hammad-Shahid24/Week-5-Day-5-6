import { FC, useState, useEffect } from "react";
import SupremeLogo from "../assets/supreme.svg";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const Header: FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const timeZone = "Asia/Karachi";
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const zonedDate = toZonedTime(currentDateTime, timeZone);
  const formattedDate = format(zonedDate, "MM/dd/yyyy hh:mma zzz");

  return (
    <div className="w-full my-12  flex flex-col justify-center items-center">
      <img
        className="w-32 h-10 scale-110 pt-0.5 my-2 bg-supremeRed"
        src={SupremeLogo}
        alt="supreme"
      />
      <h1 className=" mt-3 font-thin text-sm font-courierPrime">
        {formattedDate}
      </h1>
    </div>
  );
};

export default Header;
