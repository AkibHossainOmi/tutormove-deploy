import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobPostForm from "../components/JobPostForm";

export default function PostRequirement() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [requirementId, setRequirementId] = useState(null);

  const handleRequirementCreated = (job) => {
    setRequirementId(job?.id || null);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full px-4 sm:px-6 lg:px-8 mx-auto pt-24 pb-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-700 mb-3">
            Post Your Learning Requirement
          </h1>
          <p className="text-gray-600">
            Fill out the form below to connect with tutors. If you are not signed in, we will redirect you to signup and submit this requirement right after your student registration.
          </p>
        </div>

        <JobPostForm
          variant="page"
          submitLabel="Submit Requirement"
          unauthenticatedSubmitMode="redirect-to-signup"
          onJobCreated={handleRequirementCreated}
        />
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900">Requirement Submitted</h3>
            <p className="text-gray-600 mt-3">
              Your requirement has been posted successfully.
              {requirementId ? ` Reference ID: #${requirementId}` : ""}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
