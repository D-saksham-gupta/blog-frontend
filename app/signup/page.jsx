"use client";
//import { BACKEND_URL, WS_URL } from "@/config";
//import axios from "axios";
import {
  ArrowRight,
  Eye,
  EyeClosed,
  Lock,
  Mail,
  Pencil,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GoogleImg from "../../assets/google.png";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";

export default function signup() {
  const router = useRouter();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    bio: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signup, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  return (
    <div className="min-h-screen bg-black text-white flex items-center lg:items-stretch">
      {/* Left side - Hero section */}
      <div
        onClick={() => router.push("/")}
        className="hidden lg:flex lg:w-1/2 relative bg-neutral-950 items-center justify-center"
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center" />
        </div>
        <Pencil className="w-72 h-72 text-white z-10" />
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-24">
        <div className="flex flex-col max-w-md mx-auto lg:mx-0">
          <h1 className="text-3xl lg:text-4xl font-bold mb-8">
            Create your account with{" "}
            <span className="text-5xl text-center justify-center flex font-extrabold bg-linear-to-r from-rose-300 via-rose-400 to-rose-500 bg-clip-text text-transparent">
              Blogger
            </span>
          </h1>
          <form className="space-y-6 mt-7">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={values.username}
                onChange={(e) => handleChange(e)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={(e) => handleChange(e)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full Name"
                name="fullName"
                value={values.fullName}
                onChange={(e) => handleChange(e)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="About yourself"
                name="bio"
                value={values.bio}
                onChange={(e) => handleChange(e)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-2 flex justify-between">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={(e) => handleChange(e)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-white z-50 p-4"
              >
                {showPassword ? (
                  <EyeClosed className="w-5 h-5 z-9999" />
                ) : (
                  <Eye className="w-5 h-5 z-9999" />
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-neutral-200 transition-colors"
              onClick={async (e) => {
                e.preventDefault();
                setError("");
                setLoading(true);

                try {
                  await signup(values);
                  router.push("/login");
                } catch (err) {
                  setError(
                    err.response?.data?.message ||
                      "Signup failed. Please try again."
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? "Creating your account..." : "Sign up"}
            </button>
          </form>

          <div className="text-gray-400 mt-8 flex items-center justify-center">
            OR
          </div>

          <div className="space-y-4 mt-6">
            <button className="w-full text-lg cursor-pointer border flex justify-center gap-5 items-center border-neutral-800 text-white font-semibold py-3 px-4 rounded-lg hover:bg-neutral-900 transition-colors">
              <Image width={40} src={GoogleImg} alt="" /> Sign up with Google
            </button>
            <p className="text-neutral-400 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <p className="text-neutral-600 text-sm">
            © 2025 Blogger. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
