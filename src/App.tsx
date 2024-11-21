import { FC } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import ProductCataloguePage from "./pages/ProductCataloguePage";
import Header from "./components/Header";

const App: FC = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <Header />
        <ProductCataloguePage />
      </Layout>
    </ErrorBoundary>
  );
};

export default App;
