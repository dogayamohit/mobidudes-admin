import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        
        {/* Back link */}
        {/* <Link
          to="/"
          className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeftIcon className="mr-1 size-5" />
          Back to dashboard
        </Link> */}

        {/* Header */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="mb-2 text-xl font-semibold text-gray-800 sm:text-2xl">
            Create an account
          </h1>
          <p className="text-sm text-gray-500">
            Fill in the details below to get started
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input placeholder="John" />
            </div>

            <div>
              <Label>
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input placeholder="Doe" />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label>
              Email <span className="text-red-500">*</span>
            </Label>
            <Input type="email" placeholder="john@example.com" />
          </div>

          {/* Password */}
          <div>
            <Label>
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeIcon className="size-5" />
                ) : (
                  <EyeCloseIcon className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <Checkbox checked={isChecked} onChange={setIsChecked} />
            <p className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="font-medium text-gray-800 cursor-pointer">
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="font-medium text-gray-800 cursor-pointer">
                Privacy Policy
              </span>
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
