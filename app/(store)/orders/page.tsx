import { getMyOrders } from "@/sanity/lib/orders/getMyOrders";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { formatCurrency } from "@/sanity/lib/formatCurrency";
import Image from "next/image";
import { imageUrl } from "@/sanity/lib/imageUrl";



export default async function Orders() {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const orders = await getMyOrders(userId);

    return (
        <div className="container my-5 p-5 shadow-lg rounded">
            <h1 className="fw-bold mb-4">My Orders</h1>

            {orders.length === 0 ? (
                <div className="alert alert-primary">You have not placed any orders yet.</div>
            ) : (
                orders.map((order) => (
                    <div key={order.orderNumber} className="card mb-4 shadow-sm p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <p className="mb-1 fw-semibold">Order Number</p>
                                <p className="text-success">{order.orderNumber}</p>
                                <p className="mb-1">
                                    Status: <span className="badge bg-success">{order.status}</span>
                                </p>
                                
                            </div>
                            <div className="text-end">
                                <p className="mb-1">Order Date</p>
                                <p className="fw-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                                <p className="mb-1">Total Amount</p>
                                <p className="fw-bold">{formatCurrency(order.totalPrice ?? 0, order.currency)}</p>
                            </div>
                            
                        </div>
                        <hr/>
                        {order.amountDiscount ? (
                            <div className="mb-3 p-3 rounded bg-danger bg-opacity-10 border-start border-3 border-danger">
                                <p className="mb-1 fw-semibold text-danger">
                                    Discount Applied: {formatCurrency(order.amountDiscount, order.currency)}
                                </p>
                                <p className="mb-0 text-secondary">
                                    Original Subtotal:{" "}
                                    {formatCurrency((order.totalPrice ?? 0) + order.amountDiscount, order.currency)}
                                </p>
                            </div>
                        ) : null}

                        
                        <div>
                            <h6 className="fw-semibold mb-3">Order Items</h6>
                            {order.products?.map((product) => (
                                <div
                                    key={product.product?._id}
                                    className="d-flex align-items-center justify-content-between mb-3"
                                >
                                    <div className="d-flex align-items-center">
                                        {product.product?.image && (
                                            <Image
                                                src={imageUrl(product.product.image).url()}
                                                alt={product.product?.name ?? ""}
                                                width={64}
                                                height={64}
                                                className="me-3 rounded"
                                            />
                                        )}
                                        <div>
                                            <p className="mb-1 fw-medium">{product.product?.name}</p>
                                            <p className="mb-0 text-muted">
                                                Quantity: {product.quantity ?? "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="fw-semibold mb-0">
                                        {product.product?.price && product.quantity
                                            ? formatCurrency(
                                                  product.product.price * product.quantity,
                                                  order.currency
                                              )
                                            : "N/A"}
                                    </p>
                                    
                                </div>
                                
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
