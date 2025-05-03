import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MetaTags from "~/component/MetaTags";
import { Google, Logo } from "~/svgs";

const Onboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("");
  
  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      void router.push("/");
    }
  }, [session, status, router]);

  const handleGoogleSignIn = () => {
    // For signup: validate role is selected and include it in state
    // For login: just proceed normally
    if (isSignUp) {
      if (!selectedRole) return; // Extra validation
      
      void signIn("google", {
        callbackUrl: "/",
        state: JSON.stringify({ role: selectedRole })
      });
    } else {
      void signIn("google", {
        callbackUrl: "/"
      });
    }
  };

  // Determine if the sign-up button should be disabled
  const isSignUpButtonDisabled = isSignUp && !selectedRole;

  return (
    <>
      <MetaTags
        title={isSignUp ? "Sign up for Grower" : "Sign in to Grower"}
        description="Be a part of the Grower community. Join Grower to start your journey."
      />

      <header className="flex items-center justify-center border-b border-border-light bg-white p-4 dark:border-border dark:bg-primary">
        <Link href="/">
          <Logo className="h-9 fill-secondary" />
        </Link>
      </header>

      <main className="min-h-[100dvh] bg-light-bg dark:bg-black">
        <div className="mx-auto flex max-w-[1440px] gap-0 px-4 py-16 md:gap-8 lg:gap-20 xl:gap-28">
          <div className="flex w-full flex-col justify-center">
            {/* Toggle between Sign Up and Log In */}
            <div className="mx-auto mb-8 flex rounded-lg border border-border-light bg-white p-1 text-lg font-medium dark:border-border dark:bg-primary md:mb-10">
              <button 
                onClick={() => setIsSignUp(true)}
                className={`rounded-md px-6 py-2 transition-all ${
                  isSignUp 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                Sign Up
              </button>
              <button 
                onClick={() => setIsSignUp(false)}
                className={`rounded-md px-6 py-2 transition-all ${
                  !isSignUp 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                Log In
              </button>
            </div>
            
            <h1 className="mx-auto mb-6 items-center text-3xl font-semibold text-secondary">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            
            {isSignUp && (
              <div className="mb-8 flex flex-col items-center justify-center">
                <h2 className="mb-4 text-xl font-medium text-secondary">Select your role</h2>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <RoleOption 
                    role="startup" 
                    label="Startup" 
                    description="I'm building a company"
                    isSelected={selectedRole === "startup"} 
                    onClick={() => setSelectedRole("startup")}
                  />
                  <RoleOption 
                    role="mentor" 
                    label="Mentor" 
                    description="I provide guidance"
                    isSelected={selectedRole === "mentor"} 
                    onClick={() => setSelectedRole("mentor")}
                  />
                  <RoleOption 
                    role="investor" 
                    label="Investor" 
                    description="I fund startups"
                    isSelected={selectedRole === "investor"} 
                    onClick={() => setSelectedRole("investor")}
                  />
                </div>
                
                {!selectedRole && (
                  <p className="text-sm text-orange-500 dark:text-orange-400 mb-2">
                    Please select a role to continue
                  </p>
                )}
              </div>
            )}

            <div className="mb-5 flex flex-col justify-center gap-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={isSignUpButtonDisabled}
                className={`btn-oauth mx-auto flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium shadow-sm transition-all lg:w-7/12 ${
                  isSignUpButtonDisabled 
                    ? "cursor-not-allowed opacity-60" 
                    : "hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                }`}
              >
                <Google className="h-5 w-5 fill-gray-700 dark:fill-white" />
                <span>{isSignUp ? "Sign up with Google" : "Sign in with Google"}</span>
              </button>
              
              <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                {isSignUp 
                  ? "Already have an account? " 
                  : "Don't have an account? "}
                <button 
                  onClick={() => setIsSignUp(!isSignUp)} 
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {isSignUp ? "Log in" : "Sign up"}
                </button>
              </p>
            </div>
          </div>
          <div className="hidden w-full md:block md:w-7/12 xl:w-full">
            <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-primary">
              <i className="mb-6 block text-xl leading-relaxed text-gray-700 dark:text-text-secondary">
                &quot;It&apos;s amazing to see how fast entrepreneurs go from 0 to Blog
                under a domain they own on Grower 🤯. It reminds me a lot of
                what Substack did for journalists.&quot;
              </i>

              <div className="flex items-center gap-3">
                <Image
                  src={
                    "https://utfs.io/f/53f08a4c-c6a2-42f0-9fa3-ae206c80fdb9-fvu4vo.jpg"
                  }
                  width={70}
                  height={70}
                  alt="hackathon profile"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
                    Caffeinated Coders
                  </h1>
                  <p className="text-sm font-normal text-gray-500 dark:text-text-primary">
                    Winner, Hackathon 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

// Role selection component
interface RoleOptionProps {
  role: string;
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const RoleOption = ({ role, label, description, isSelected, onClick }: RoleOptionProps) => {
  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 p-5 w-[130px] h-[130px] flex flex-col items-center justify-center transition-all 
        ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}
      `}
    >
      <div className={`text-lg font-medium mb-2 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-secondary'}`}>
        {label}
      </div>
      <div className="text-xs text-center text-gray-500 dark:text-text-primary">
        {description}
      </div>
    </div>
  );
};

export default Onboard;
