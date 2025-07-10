import { COUPON_CODE } from "@/sanity/lib/sale/couponeCode";
import { getActiveSaleBycouponCode } from "@/sanity/lib/sale/getActiveSaleBycouponCode";

const BaskFridayBanner =async () => {
    const sale = await getActiveSaleBycouponCode(COUPON_CODE.FRIDAY);

    // if (sale?.IsActive){
    //     return null;
    // }

  return (
<div
  className="card text-white rounded-3 border-0 shadow-sm m-4"
  style={{
    background: "linear-gradient(135deg, #8B0000, #000000)",
    borderRadius: "1rem",
  }}
>
  <div className="card-body">
    <h5 className="card-title fw-bold">{sale?.title}</h5>
    <p className="card-text">{sale?.description}</p>

    <div className="col-12 col-md-6 col-lg-4 col-xxl-3 mt-3 p-3 bg-white text-danger rounded-5">
      <span className="ms-4 me-1">Use code:</span>
      <span className="badge bg-danger text-white fw-semibold me-1">
        {sale?.couponCode}
      </span>
      <span className="fw-semibold">
        for {sale?.discountAmount}% OFF
      </span>
    </div>
  </div>
</div>

  )
}

export default BaskFridayBanner
