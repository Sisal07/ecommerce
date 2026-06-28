import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { signUpUser } from "@/lib/services";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },

  } = useForm<SignUpFormValues>();

  const password = watch("password");

  async function handleSignupUser(data: SignUpFormValues) {
    setIsLoading(true);
    try {
      await signUpUser(data);
      navigate("/signin");
      toast.success("Account created successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occured!");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (data: SignUpFormValues) => {
    handleSignupUser(data);
  };

  return (
    <>
      <Helmet>
        <title>Signup | SISAL</title>
      </Helmet>

      <div className="flex min-h-screen flex-col bg-white font-['Inter','Poppins',sans-serif] text-[#050505]">
        <Navbar />

        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.16),transparent_34%),linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_100%)]" />

          <div className="relative w-full max-w-md">
            <Card className="overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-[#050505] text-white shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
              <CardHeader className="space-y-3 border-b border-[#D4AF37]/15 px-6 pb-6 pt-7 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37] shadow-[0_12px_30px_rgba(212,175,55,0.28)]">
                  <span className="text-xl font-bold text-[#050505]">S</span>
                </div>

                <CardTitle className="text-2xl font-bold tracking-tight text-white">
                  Create account
                </CardTitle>

                <CardDescription className="text-base text-white/55">
                  Join SISAL for secure instant shopping and lifestyle essentials.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-white/80">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
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

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm text-white/80">
                      Username
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register("username", {
                        required: "Username is required",
                      })}
                      className="h-11 rounded-xl border-[#D4AF37]/25 bg-white/[0.06] text-white placeholder:text-white/35 transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                    />
                    {errors.username && (
                      <p className="text-sm text-[#F2D675]">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm text-white/80">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "At least 6 characters",
                          },
                        })}
                        className="h-11 rounded-xl border-[#D4AF37]/25 bg-white/[0.06] pr-10 text-white placeholder:text-white/35 transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-white/45 hover:bg-transparent hover:text-[#D4AF37]"
                        onClick={() => setShowPassword(!showPassword)}
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm text-white/80"
                    >
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...register("confirmPassword", {
                          required: "Confirm your password",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                        className="h-11 rounded-xl border-[#D4AF37]/25 bg-white/[0.06] pr-10 text-white placeholder:text-white/35 transition-all duration-300 focus-visible:border-[#D4AF37] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-white/45 hover:bg-transparent hover:text-[#D4AF37]"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-[#F2D675]">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full rounded-xl bg-[#D4AF37] text-base font-semibold text-[#050505] transition-all duration-300 hover:bg-[#F2D675] hover:shadow-[0_12px_28px_rgba(212,175,55,0.24)] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/45"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="px-6 pb-7 pt-5">
                <div className="w-full text-center text-sm text-white/55">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="font-medium text-[#D4AF37] transition-colors duration-300 hover:text-[#F2D675]"
                  >
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default SignUpPage;