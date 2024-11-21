import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  throw new Error("Not implemented");

  return (
    <div className="w-full bg-white">
      <div className="max-w-screen-2xl  mx-auto">{children}</div>
    </div>
  );
};

export default Layout;
