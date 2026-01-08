import React from "react";
import GridShape from "../components/common/GridShape";
import { Link } from "react-router";
import Logo from "/images/logo/logodarktheme.svg"

export default function AuthLayout({ children }) {
  return (
    <div className="relative z-10 min-h-screen bg-white p-6 sm:p-0">
      <div className="relative flex h-screen w-full flex-col justify-center lg:flex-row">

        {/* Left / Form Section */}
        <div className="flex w-full items-center justify-center lg:w-1/2">
          {children}
        </div>

        {/* Right / Branding Section */}
        <div className="hidden h-full w-1/2 items-center justify-center bg-blue-500 lg:flex">
          <div className="relative z-10 flex flex-col items-center">

            {/* Decorative Grid */}
            <GridShape />

            {/* Logo & Text */}
            <div className="mt-6 flex max-w-xs flex-col items-center">
              <Link to="/" className="mb-4 block">
                <img
                  src={Logo}
                  alt="Logo"
                  width={231}
                  height={48}
                />
              </Link>
              {/* 
              <p className="text-center text-sm text-white">
                React – Tailwind CSS Admin Dashboard Template
              </p> */}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
