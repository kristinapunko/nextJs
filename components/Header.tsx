"use client"

import { ClerkLoaded, SignedIn, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link";
import Form from "next/form";
import useBasketStore from "@/app/store/store";

const Header = () => {
    const {user} = useUser();
    const itemCount = useBasketStore((state)=>
    state.items.reduce((total, item) => total + item.quantity, 0))

    const createClerkPasskey = async () =>{
      try{
        const res = await user?.createPasskey();
        console.log(res);
      } catch (err) {
        console.error("Error", JSON.stringify(err, null, 2));
        
      }

    };

    return (

<header>
  <nav className="navbar navbar-expand-lg mt-2">
    <div className="container-fluid d-flex flex-nowrap align-items-center">
      <Link href="/" className="text-decoration-none me-2 flex-shrink-0">
        <h2 className="text-primary fw-bold mb-0">Shopr</h2>
      </Link>

      <Form action="/search" className="d-flex flex-grow-1 me-2">
        <input
          type="text"
          name="query"
          placeholder="Search a product"
          className="form-control"
        />
      </Form>

      <div className="d-flex align-items-center flex-nowrap">
        {/* Корзина */}
        <div className="position-relative bg-primary rounded mx-1 px-2 d-inline-flex flex-shrink-0">
          {itemCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {itemCount}
              <span className="visually-hidden">items in basket</span>
            </span>
          )}
          <Link href="/basket" className="d-flex align-items-center text-white text-decoration-none">
            <i className="bi bi-cart3 p-1 fs-5 text-white"></i>
            <span className="basket-text px-1">My Basket</span>
          </Link>
        </div>

        {/* Замовлення */}
        <ClerkLoaded>
          <SignedIn>
            <div className="bg-primary rounded mx-1 px-2  d-inline-flex flex-shrink-0">
              <Link href="/orders" className="d-flex align-items-center text-white text-decoration-none">
              <i className="bi bi-box-seam p-1 fs-5 text-white"></i>
                <span className="basket-text px-1">My Orders</span>
              </Link>
            </div>
          </SignedIn>
        </ClerkLoaded>

        {/* Вхід/вихід */}
        {user ? (
          <div className="d-flex align-items-center ms-1 flex-shrink-0">
         
            <UserButton />
         
        
          <div className="ms-2 d-none d-xl-block text-truncate">
            <p className="mb-0 small">Welcome back</p>
            <p className="mb-0 fw-semibold small">{user.fullName}!</p>
          </div>
        </div>
        

) : (
  <SignInButton mode="modal">
    <button className="btn btn-primary ms-2 flex-shrink-0">
      Sign In
    </button>
  </SignInButton>
)}


        {user?.passkeys.length === 0 && (
          <button onClick={createClerkPasskey} className="btn btn-outline-primary ms-2 flex-shrink-0">
            Create a passkey now
          </button>
        )}
      </div>
    </div>
  </nav>
</header>

    );
  };

export default Header
