// import AddToBasketButton from "@/components/AddToBasketButton";
// import { imageUrl } from "@/sanity/lib/imageUrl";
// import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
// import { PortableText } from "next-sanity";
// import Image from "next/image";

// export const dynamic = "force-static";
// export const revalidate = 60;

// export async function generateMetadata({ params }) {

//   const { slug } = await params;
//   const product = await getProductBySlug(slug);

//   console.log(
//     crypto.randomUUID().slice(0, 5) +
//       `>>> Rerendered the product page cache for ${slug}`
//   );

//   return {
//     title: product?.name ?? "Product Not Found",
//     description:
//       product?.description?.[0]?.children?.[0]?.text ??
//       "View our product details.",
//   };
// }

// async function ProductPage({ params }) {
//   const { slug } = await params;
//   const product = await getProductBySlug(slug);

//   if (!product) {
//     return (
//       <div className="text-center text-danger mt-5">
//         <h2>Product not found</h2>
//       </div>
//     );
//   }

//   const isOutOfStock = product.stock != null && product.stock <= 0;

//   return (
//     <div className={`container my-5 ${isOutOfStock ? "opacity-50" : ""}`}>
//       <div className="row align-items-start">
//         {/* Product Image */}
//         <div className="col-md-4 text-center mb-4">
//           {product.image && (
//             <Image
//               src={imageUrl(product.image).url()}
//               alt={product.name ?? "Product image"}
//               width={0}
//               height={0}
//               sizes="100vw"
//               style={{ width: "100%", height: "auto" }}
//               className="img-fluid rounded shadow-sm"
//             />
//           )}
          
//         </div>

//         {/* Product Info */}
//         <div className="col-md-8">
//           <h2 className="mb-3">{product.name}</h2>
//           {Array.isArray(product.description) && (
//             <div className="product-description p-3 bg-light rounded">
//               <PortableText value={product.description} />
//             </div>
//           )}

//           <div>
//             <AddToBasketButton product={product} disabled={isOutOfStock} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductPage;



import AddToBasketButton from "@/components/AddToBasketButton";
import { imageUrl } from "@/sanity/lib/imageUrl";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { PortableText } from "next-sanity";
import Image from "next/image";

export const dynamic = "force-static";
export const revalidate = 60;

// ✅ Type for params
type Params = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Params) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  console.log(
    crypto.randomUUID().slice(0, 5) +
      `>>> Rerendered the product page cache for ${slug}`
  );

  return {
    title: product?.name ?? "Product Not Found",
    description:
      product?.description?.[0]?.children?.[0]?.text ??
      "View our product details.",
  };
}

async function ProductPage({ params }: Params) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="text-center text-danger mt-5">
        <h2>Product not found</h2>
      </div>
    );
  }

  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <div className={`container my-5 ${isOutOfStock ? "opacity-50" : ""}`}>
      <div className="row align-items-start">
        {/* Product Image */}
        <div className="col-md-4 text-center mb-4">
          {product.image && (
            <Image
              src={imageUrl(product.image).url()}
              alt={product.name ?? "Product image"}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              className="img-fluid rounded shadow-sm"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="col-md-8">
          <h2 className="mb-3">{product.name}</h2>
          {Array.isArray(product.description) && (
            <div className="product-description p-3 bg-light rounded">
              <PortableText value={product.description} />
            </div>
          )}

          <div>
            <AddToBasketButton product={product} disabled={isOutOfStock} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
