import { defineQuery } from "next-sanity";
import { CouponeCode } from "./couponeCode";
import { sanityFetch } from "../live";

export const getActiveSaleBycouponCode = async (couponCode: CouponeCode) => {
  const ACTIVE_SALE_BY_CUPON_QUERY = defineQuery(`
    *[
      _type == "sale"
      && IsActive == true
      && couponCode == $couponCode
    ] | order(validForm desc)[0]
  `);

  try {
    const activeSale = await sanityFetch({
      query: ACTIVE_SALE_BY_CUPON_QUERY,
      params: {
        couponCode, // ✅ ПЕРЕДАЧА ПАРАМЕТРУ
      },
    });

    return activeSale ? activeSale.data : null;
  } catch (err) {
    console.error("Error fetching sale:", err);
    return null;
  }
};
