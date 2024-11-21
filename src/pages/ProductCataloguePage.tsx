import { FC, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/LoadingAnimation.json";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
} from "@heroicons/react/20/solid";
import Swal from "sweetalert2";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
  rating: { rate: number };
}

const ProductCataloguePage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([0, 1000]);
  const [selectedRating, setSelectedRating] = useState<number[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://fakestoreapi.com/products`);
        setProducts(response.data);
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.message
            ? `Network error: ${error.message}`
            : "Some error occurred";
        setError(errorMessage);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Multi-criteria Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearchQuery = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= selectedPriceRange[0] &&
        product.price <= selectedPriceRange[1];
      const matchesRating =
        selectedRating.length === 0 ||
        selectedRating.includes(Math.floor(product.rating.rate));

      return (
        matchesSearchQuery && matchesCategory && matchesPrice && matchesRating
      );
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedPriceRange,
    selectedRating,
  ]);

  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (page - 1) * productsPerPage;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleNextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  const handlePreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const previewProduct = useCallback((product: Product) => {
    Swal.fire({
      html: `
      <h2 class="text-center text-2xl font-bold font-courierPrime mb-8">${product.title}</h2>
        <div class="flex flex-col sm:flex-row justify-center font-courierPrime items-center">
          <img src="${product.image}" class="w-full sm:w-64 h-64 object-contain mx-auto" />
          <div class="flex flex-col justify-center mt-4 sm:mt-0 sm:ml-4">
            <p class="text-left mt-2 sm:mt-4">Category: ${product.category}</p>
            <p class="text-left mt-2 h-24 overflow-y-auto">Description: ${product.description}</p>          
            <p class="text-left mt-2">Price: $${product.price}</p>
            <p class="text-left mt-2">Rating: ${product.rating.rate}★</p>
          </div>
        </div>
        `,
      showConfirmButton: false,
    });
  }, []);

  const openFilterModal = () => {
    Swal.fire({
      html: `
            <h2 class="text-center text-2xl font-bold font-courierPrime mb-8">Apply Filters</h2>

        <div class="space-y-4 text-left font-courierPrime">
          <!-- Category Filter -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Select Category</label>
            <select id="category" class="swal2-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="All">All Categories</option>
              <option value="men's clothing">Men's Clothing</option>
              <option value="jewelery">Jewelry</option>
              <option value="electronics">Electronics</option>
              <option value="women's clothing">Women's Clothing</option>
            </select>
          </div>
          
          <!-- Price Range Filter -->
          <div class="flex flex-col items-center sm:flex-row sm:justify-between sm:items-center" >
            <label for="priceRange" class="block text-sm font-medium text-gray-700">Price Range ($)</label>
            <input type="range" id="priceRange" min="0" max="1000" value="${
              selectedPriceRange[1]
            }" class="swal2-input mt-1    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            <span id="priceValue" class="block mt-1  text-center min-w-16 text-sm text-gray-500">$${
              selectedPriceRange[1]
            }</span>
          </div>
          
          <!-- Rating Filter -->
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-x-8 bg-blue-200 items-center">
            <label for="rating" class="block text-sm font-medium text-gray-700">Select Rating</label>
            <div id="rating" class="flex items-center w-fit mx-auto space-x-2 ">
              ${[1, 2, 3, 4, 5]
                .map(
                  (rating) => `
                <label class="flex items-center space-x-1 bg-blue-400">
                  <input type="checkbox" class="rating-checkbox" value="${rating}" ${
                    selectedRating.includes(rating) ? "checked" : ""
                  } class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <span class="text-sm text-gray-700">${rating}★</span>
                </label>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      customClass: {
        popup: "swal2-popup-custom",
        title: "swal2-title-custom",
        confirmButton: "swal2-confirm-custom",
        cancelButton: "swal2-cancel-custom",
      },
      preConfirm: () => {
        const category = (
          document.getElementById("category") as HTMLSelectElement
        ).value;
        const price = parseInt(
          (document.getElementById("priceRange") as HTMLInputElement).value
        );
        const ratings = Array.from(
          document.querySelectorAll(".rating-checkbox:checked")
        ).map((checkbox: any) => parseInt(checkbox.value));
        setSelectedCategory(category);
        setSelectedPriceRange([0, price]);
        setSelectedRating(ratings);
        setPage(1); // Reset page to 1 after applying filters
      },
      didOpen: () => {
        const categorySelect = document.getElementById(
          "category"
        ) as HTMLSelectElement;
        categorySelect.value = selectedCategory;

        const priceRangeInput = document.getElementById(
          "priceRange"
        ) as HTMLInputElement;
        const priceValue = document.getElementById("priceValue");
        priceRangeInput.oninput = () => {
          if (priceValue) {
            priceValue.innerHTML = `$${priceRangeInput.value}`;
          }
        };
      },
    });
  };

  return (
    <div className="w-full h-full">
      <div className="w-9/12 mx-auto">
        {/* Search and Filter Section */}
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mt-4 max-w-screen-lg mx-auto sm:px-8 ">
          <input
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // Reset page to 1
            }}
            className="p-2 border border-gray-300 text-supremeRed focus:outline-supremeRed active:border-supremeRed rounded-sm"
          />

          <button className="border p-1 border-gray-300 flex justify-center">
            <FunnelIcon
              onClick={openFilterModal}
              className={`h-8 ${
                selectedCategory === "All" ? "text-gray-400" : "text-supremeRed"
              }`}
            />
          </button>
        </div>

        {/* Product List */}
        <div className="flex flex-wrap justify-center mt-4 ">
          {loading ? (
            <Lottie
              animationData={loadingAnimation}
              style={{ width: 300, height: 300 }}
              loop
              autoplay
            />
          ) : (
            displayedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 hover:border-gray-400 p-4 w-60 transition-all duration-300 ease-in-out cursor-pointer"
              >
                <img
                  onClick={() => previewProduct(product)}
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-contain mb-2 rounded-lg transform transition duration-300"
                />
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {!error && (
          <div className="relative flex justify-center items-center my-4 space-x-1">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className={`px-2 ${
                page === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-supremeRed text-white"
              }`}
            >
              <ChevronLeftIcon className="h-8" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`px-2 ${
                page === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-supremeRed text-white"
              }`}
            >
              <ChevronRightIcon className="h-8" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCataloguePage;
