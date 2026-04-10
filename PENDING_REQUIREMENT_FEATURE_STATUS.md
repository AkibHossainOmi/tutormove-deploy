# Post Requirement Feature - Implementation Status

## Feature Overview
Allow guest users to fill out "Post Your Learning Requirement" form, redirect to signup, and auto-submit the requirement after login.

## Flow
```
Guest fills form → Submit → Save to localStorage → Redirect to /signup
                                                          ↓
                                                    User signs up
                                                          ↓
                                                    Redirect to /login
                                                          ↓
                                                    User logs in
                                                          ↓
                                              Auto-submit job from localStorage
                                              Set success flag
                                                          ↓
                                                Redirect to /dashboard
                                                          ↓
                                              Dashboard shows success modal
```

---

## Implementation Status

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| PostRequirement Page | `frontend/src/pages/PostRequirement.js` | ✅ Done | Refactored to use JobPostForm with new props |
| Pending Requirement Utility | `frontend/src/utils/pendingRequirement.js` | ✅ Done | localStorage save/get/clear functions |
| JobPostForm Props | `frontend/src/components/JobPostForm.js` | ❌ Pending | Missing `variant`, `submitLabel`, `unauthenticatedSubmitMode` props |
| Login Auto-Submit | `frontend/src/pages/Login.js` | ❌ Pending | Need to check localStorage and auto-submit after login |
| Dashboard Success Modal | `frontend/src/pages/StudentDashboard.js` | ❌ Pending | Show success modal when redirected after auto-submit |

---

## Completed Work

### 1. PostRequirement.js (Modified)
- Removed old basic form with 6 fields
- Now uses `JobPostForm` component with props:
  ```jsx
  <JobPostForm
    variant="page"
    submitLabel="Submit Requirement"
    unauthenticatedSubmitMode="redirect-to-signup"
    onJobCreated={handleRequirementCreated}
  />
  ```
- Added local success modal (for authenticated users)

### 2. pendingRequirement.js (New File)
```javascript
const PENDING_REQUIREMENT_KEY = "pending_requirement_job_payload";

savePendingRequirement(payload)   // Save form data to localStorage
getPendingRequirement()           // Get saved form data
clearPendingRequirement()         // Clear saved data
```

---

## Pending Work

### 1. JobPostForm.js - Add New Props Support

Need to add support for:
- `variant`: "modal" (default) | "page" - Controls wrapper styling
- `submitLabel`: Custom submit button text
- `unauthenticatedSubmitMode`: "redirect-to-signup" - For guest users

Logic needed:
```javascript
// If user is not authenticated and unauthenticatedSubmitMode === "redirect-to-signup"
// 1. Save form data to localStorage using savePendingRequirement()
// 2. Redirect to /signup
```

### 2. Login.js - Auto-Submit After Login

After successful login (around line 51-53), add:
```javascript
import { getPendingRequirement, clearPendingRequirement } from '../utils/pendingRequirement';

// After setting token and user in localStorage:
const pendingJob = getPendingRequirement();
if (pendingJob) {
  try {
    await jobAPI.createJob(pendingJob);
    clearPendingRequirement();
    localStorage.setItem('jobPostSuccess', 'true');
  } catch (err) {
    console.error('Failed to auto-submit pending job:', err);
  }
}
navigate("/dashboard");
```

### 3. StudentDashboard.js - Success Modal

On component mount:
```javascript
useEffect(() => {
  const success = localStorage.getItem('jobPostSuccess');
  if (success) {
    localStorage.removeItem('jobPostSuccess');
    setShowSuccessModal(true);
  }
}, []);
```

Add modal:
```jsx
{showSuccessModal && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900">Requirement Posted!</h3>
      <p className="text-gray-600 mt-3">
        Your learning requirement has been posted successfully. Tutors matching your criteria will be notified.
      </p>
      <div className="mt-6 flex justify-end">
        <button onClick={() => setShowSuccessModal(false)} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg">
          Got it
        </button>
      </div>
    </div>
  </div>
)}
```

---

## Files to Modify

1. `frontend/src/components/JobPostForm.js` - Add new props support
2. `frontend/src/pages/Login.js` - Add auto-submit logic
3. `frontend/src/pages/StudentDashboard.js` - Add success modal

---

## Git Status

```
Modified (staged for next commit):
- frontend/src/pages/PostRequirement.js

New (untracked):
- frontend/src/utils/pendingRequirement.js
```

---

*Last Updated: 2026-04-10*
