"use client";
import { Product } from "@/sanity.types";
import { AnimatePresence, motion } from "framer-motion";
import ProductThumb from "./ProductThumb";

const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <div className="d-flex flex-wrap justify-content-center gap-2 px-2 py-5">
      <AnimatePresence>
        {products?.map((product) => (
          <motion.div
            key={product._id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProductThumb product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;
