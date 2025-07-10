import { Product } from "@/sanity.types";
import { imageUrl } from "@/sanity/lib/imageUrl";
import Image from "next/image";
import Link from "next/link";

const ProductThumb = ({ product }: { product: Product }) => {
  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className={`card shadow-sm rounded-2 overflow-hidden border-0 text-decoration-none text-dark transition-all ${
        isOutOfStock ? "opacity-50" : ""
      }`}
      style={{ width: "20rem", minHeight: "28rem", margin: "1rem" }}
    >
      <div className="position-relative" style={{ height: "250px" }}>
        {product.image && (
          <Image
            src={imageUrl(product.image).url()}
            alt={product.name || "image"}
            fill
            className="object-fit-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 18rem"
          />
        )}
        {isOutOfStock && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75 text-white fw-bold">
            Out of stock
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title text-truncate">{product.name}</h5>
        <p className="card-text small text-muted">
          {product.description?.map((block) =>
            block._type === "block"
              ? block.children?.map((child) => child.text).join("")
              : ""
          ).join("") || "No description available"}
        </p>
        <p className="fw-bold mt-auto">{product.price?.toFixed(2)} $</p>
      </div>
    </Link>
  );
};

export default ProductThumb;
