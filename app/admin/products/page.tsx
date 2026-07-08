import { getAllProductsForAdmin } from "@/lib/products";
import ProductsTable from "./ProductsTable";

export const metadata = {
  title: "Admin · Products | Haywood Mushrooms",
};

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <main className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <ProductsTable products={products} />
      </div>
    </main>
  );
}
