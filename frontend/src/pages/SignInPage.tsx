import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { signInUser } from "@/lib/services";
import { useAuth } from "@/contexts/AuthContext";

interface SignInFormData {
  email: string;
  password: string;
}

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const from = location.state?.from?.pathname || "/";

  async function handleSigninUser(data: SignInFormData) {
    setIsLoading(true);
    try {
      const response = await signInUser(data);

      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);
      localStorage.setItem("auth_username", response.user.username);

      login(response.user.username);
      toast.success(`Welcome back, ${response.user.username}!`);

      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      console.error("Sign-in error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Sign In | SISAL</title>
      </Helmet>

      <div className="flex min-h-screen flex-col bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
        <Navbar />

        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.16),transparent_34%),linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_100%)]" />

          <div className="relative w-full max-w-md space-y-6">
            <Card className="overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-[#050505] text-white shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
              <CardHeader className="space-y-3 border-b border-[#D4AF37]/15 px-6 pb-6 pt-7 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37] shadow-[0_12px_30px_rgba(212,175,55,0.28)]">
                  <span className="text-xl font-bold text-[#050505]">S</span>
                </div>

                <CardTitle className="text-2xl font-bold tracking-tight text-white">
                  Welcome back
                </CardTitle>

                <CardDescription className="text-base text-white/55">
                  Sign in to continue shopping securely with SISAL.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pt-6">
                <form
                  onSubmit={handleSubmit(handleSigninUser)}
                  className="space-y-4"
                >
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-white/80">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address",
                        },
                      })}
                      className="h-11 rounded-xl border-[#D4AF37]/25 bg-white/[0.06] text-white placeholder:text-white/35 transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                    />
                    {errors.email && (
                      <p className="text-sm text-[#F2D675]">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm text-white/80">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        className="h-11 rounded-xl border-[#D4AF37]/25 bg-white/[0.06] pr-10 text-white placeholder:text-white/35 transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-white/45 hover:bg-transparent hover:text-[#D4AF37]"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-[#F2D675]">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="h-11 w-full rounded-xl bg-[#D4AF37] text-base font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675] hover:shadow-[0_12px_28px_rgba(212,175,55,0.24)] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/45"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="px-6 pb-7 pt-5">
                <div className="w-full text-center text-sm text-white/55">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-[#D4AF37] transition-colors duration-300 hover:text-[#F2D675]"
                  >
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </Card>

            <p className="text-center text-xs leading-relaxed text-[#050505]/55">
              By signing in, you agree to our{" "}
              <Link
                to="/terms"
                className="font-medium text-[#D4AF37] transition-colors duration-300 hover:text-[#050505]"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="font-medium text-[#D4AF37] transition-colors duration-300 hover:text-[#050505]"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SignInPage;