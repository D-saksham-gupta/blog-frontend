import { assets } from "../assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const { logout, user, isAuthenticated, isAdmin } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <div className="py-5 px-5 md:px-12 lg:px-28">
      <div className="flex justify-between items-center">
        <Image
          src={assets.logo}
          width={180}
          alt="blogger"
          className="w-auto sm:w-[150px]"
          onClick={() => router.push("/")}
        />

        {user ? (
          <div className="flex gap-5">
            {isAuthenticated() && isAdmin() && (
              <Link
                href={"/admin/dashboard"}
                className="w-full flex items-center gap-2 bg-black text-rose-300 text-left px-4 py-3 rounded-lg font-medium text-black hover:text-rose-300 hover:bg-gray-100 transition-all duration-300"
              >
                Dashboard
                <span>
                  <ArrowBigRight />
                </span>
              </Link>
            )}
            <button
              className="bg-rose-100 text-rose-900 font-bold px-4 py-2 rounded-lg cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black cursor-pointer shadow-[-5px_5px_0px_#000000]"
          >
            Login <Image src={assets.arrow} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
