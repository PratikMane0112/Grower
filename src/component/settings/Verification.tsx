import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BadgeCheck, Upload, FileCheck, BadgeAlert, Info } from "lucide-react";
import { api } from "~/utils/api";

const Verification = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const isUserStartup = session?.user?.role === "startup";
  const [isVerified, setIsVerified] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({
    dpiit: null,
    gstin: null,
    panCard: null,
    aadhaar: null,
    otherDoc: null,
  });
  const [verificationStatus, setVerificationStatus] = useState("unverified"); // "unverified", "pending", "verified"

  // Mock API query - in a real app, we'd fetch the verification status from the backend
  // const { data: verificationData } = api.users.getVerificationStatus.useQuery(
  //   undefined,
  //   {
  //     enabled: !!isUserStartup,
  //     refetchOnWindowFocus: false,
  //   }
  // );

  // Redirect non-startup users away from this page
  useEffect(() => {
    if (session && !isUserStartup) {
      router.push("/settings");
    }
  }, [session, isUserStartup, router]);

  // Simulate verification check
  useEffect(() => {
    // In a real implementation, we'd get this from the API
    // if (verificationData) {
    //   setVerificationStatus(verificationData.status);
    //   setIsPending(verificationData.status === "pending");
    //   setIsVerified(verificationData.status === "verified");
    // }
  }, []);

  // Don't render anything if the user isn't a startup
  if (!isUserStartup) {
    return null;
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFiles((prev) => ({
        ...prev,
        [docType]: event.target.files?.[0] || null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation - at least one file is required
    if (!Object.values(selectedFiles).some((file) => file !== null)) {
      toast.error("Please upload at least one verification document");
      return;
    }
    
    // In a real app, we would upload the files to the server here
    // const formData = new FormData();
    // Object.entries(selectedFiles).forEach(([key, file]) => {
    //   if (file) formData.append(key, file);
    // });
    
    // Mock successful submission
    setIsPending(true);
    setVerificationStatus("pending");
    toast.success("Verification documents submitted successfully! Your application is being reviewed.");

    // Reset form fields
    setSelectedFiles({
      dpiit: null,
      gstin: null,
      panCard: null,
      aadhaar: null,
      otherDoc: null,
    });
  };

  if (verificationStatus === "verified") {
    return (
      <>
        <header className="pb-4 border-b border-border-light dark:border-border">
          <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
            Startup Verification
          </h1>
        </header>

        <section className="py-6">
          <div className="flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-4">
            <BadgeCheck className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Your startup is verified!
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
              Your startup has been verified by our team. Investors and mentors can now engage with your startup with confidence.
            </p>
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
              <BadgeCheck className="h-4 w-4 mr-1" />
              Verified on {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="mt-6 p-4 border border-border-light dark:border-border rounded-md bg-light-bg dark:bg-primary-light">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-text-secondary mb-3">
              Benefits of being verified
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">✓</div>
                <span>Priority visibility to investors and mentors</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">✓</div>
                <span>Verified badge on your profile and posts</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">✓</div>
                <span>Access to exclusive networking events</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">✓</div>
                <span>Enhanced credibility in the startup community</span>
              </li>
            </ul>
          </div>
        </section>
      </>
    );
  }

  if (verificationStatus === "pending") {
    return (
      <>
        <header className="pb-4 border-b border-border-light dark:border-border">
          <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
            Startup Verification
          </h1>
        </header>

        <section className="py-6">
          <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-4">
            <BadgeAlert className="h-16 w-16 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Verification in progress
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
              We've received your verification documents and our team is reviewing them. This process typically takes 2-3 business days.
            </p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
              <Info className="h-4 w-4 mr-1" />
              Submission date: {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-yellow-400 dark:text-gray-300" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-gray-300">
                  Need to update your documents? <a href="mailto:support@grower.com" className="font-medium underline dark:text-blue-300">Contact our support team</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <header className="pb-4 border-b border-border-light dark:border-border">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
          Startup Verification
        </h1>
      </header>

      <section className="py-6">
        <div className="bg-light-bg dark:bg-primary-light rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-text-secondary mb-2">
            Why get verified?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Verification adds credibility to your startup profile, making it easier for investors and mentors to trust and engage with your posts. Verified startups receive priority visibility and additional benefits.
          </p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border-light dark:border-border rounded-md p-4 bg-white dark:bg-primary">
              <div className="flex items-center mb-2">
                <BadgeCheck className="text-gray-600 h-5 w-5 mr-2 dark:text-gray-300" />
                <h3 className="font-medium dark:text-gray-300">Enhanced Credibility</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Verification badge shows investors your startup is legitimate and trustworthy
              </p>
            </div>
            <div className="border border-border-light dark:border-border rounded-md p-4 bg-white dark:bg-primary">
              <div className="flex items-center mb-2">
                <BadgeCheck className="text-gray-600 h-5 w-5 mr-2 dark:text-gray-300" />
                <h3 className="font-medium dark:text-gray-300">Investor Priority</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Verified startups get priority visibility to potential investors
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-text-secondary mb-4">
              Upload Verification Documents
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Please upload at least one government-verified document to verify your startup. Supported formats: PDF, PNG, JPG (max 5MB each)
            </p>

            <div className="space-y-4">
              {/* DPIIT Certificate */}
              <div className="border border-border-light dark:border-border rounded-md p-4">
                <label className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <span className="text-gray-700 dark:text-text-secondary font-medium">
                      DPIIT Recognition Certificate
                    </span>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 py-0.5 px-2 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <div className="relative mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border-light dark:border-border rounded-md">
                    {selectedFiles.dpiit ? (
                      <div className="flex items-center space-x-2 text-green-500">
                        <FileCheck className="h-6 w-6" />
                        <span>{selectedFiles.dpiit.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="dpiit"
                            className="relative cursor-pointer rounded-md bg-white dark:bg-primary font-medium text-secondary hover:text-primary-dark"
                          >
                            <span>Upload a file</span>
                            <input
                              id="dpiit"
                              name="dpiit"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileChange(e, "dpiit")}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* GSTIN */}
              <div className="border border-border-light dark:border-border rounded-md p-4">
                <label className="flex flex-col">
                  <span className="text-gray-700 dark:text-text-secondary font-medium">GSTIN Certificate</span>
                  <div className="relative mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border-light dark:border-border rounded-md">
                    {selectedFiles.gstin ? (
                      <div className="flex items-center space-x-2 text-green-500">
                        <FileCheck className="h-6 w-6" />
                        <span>{selectedFiles.gstin.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="gstin"
                            className="relative cursor-pointer rounded-md bg-white dark:bg-primary font-medium text-secondary hover:text-primary-dark"
                          >
                            <span>Upload a file</span>
                            <input
                              id="gstin"
                              name="gstin"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileChange(e, "gstin")}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* PAN Card */}
              <div className="border border-border-light dark:border-border rounded-md p-4">
                <label className="flex flex-col">
                  <span className="text-gray-700 dark:text-text-secondary font-medium">PAN Card</span>
                  <div className="relative mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border-light dark:border-border rounded-md">
                    {selectedFiles.panCard ? (
                      <div className="flex items-center space-x-2 text-green-500">
                        <FileCheck className="h-6 w-6" />
                        <span>{selectedFiles.panCard.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="panCard"
                            className="relative cursor-pointer rounded-md bg-white dark:bg-primary font-medium text-secondary hover:text-primary-dark"
                          >
                            <span>Upload a file</span>
                            <input
                              id="panCard"
                              name="panCard"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileChange(e, "panCard")}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Aadhaar */}
              <div className="border border-border-light dark:border-border rounded-md p-4">
                <label className="flex flex-col">
                  <span className="text-gray-700 dark:text-text-secondary font-medium">Aadhaar Card</span>
                  <div className="relative mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border-light dark:border-border rounded-md">
                    {selectedFiles.aadhaar ? (
                      <div className="flex items-center space-x-2 text-green-500">
                        <FileCheck className="h-6 w-6" />
                        <span>{selectedFiles.aadhaar.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="aadhaar"
                            className="relative cursor-pointer rounded-md bg-white dark:bg-primary font-medium text-secondary hover:text-primary-dark"
                          >
                            <span>Upload a file</span>
                            <input
                              id="aadhaar"
                              name="aadhaar"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileChange(e, "aadhaar")}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Other Document */}
              <div className="border border-border-light dark:border-border rounded-md p-4">
                <label className="flex flex-col">
                  <span className="text-gray-700 dark:text-text-secondary font-medium">
                    Other Supporting Document (Optional)
                  </span>
                  <div className="relative mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border-light dark:border-border rounded-md">
                    {selectedFiles.otherDoc ? (
                      <div className="flex items-center space-x-2 text-green-500">
                        <FileCheck className="h-6 w-6" />
                        <span>{selectedFiles.otherDoc.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="otherDoc"
                            className="relative cursor-pointer rounded-md bg-white dark:bg-primary font-medium text-secondary hover:text-primary-dark"
                          >
                            <span>Upload a file</span>
                            <input
                              id="otherDoc"
                              name="otherDoc"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileChange(e, "otherDoc")}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Your documents will be reviewed by our team within 2-3 business days. You'll be notified when your startup is verified.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="btn-filled px-6 py-2"
            >
              Submit for Verification
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Verification;