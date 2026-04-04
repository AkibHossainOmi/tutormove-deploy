import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes === 1) return '1 minute ago';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInWeeks === 1) return '1 week ago';
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
  if (diffInMonths === 1) return '1 month ago';
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  if (diffInYears === 1) return '1 year ago';
  return `${diffInYears} years ago`;
};

const GigDetails = ({ gig: initialGig }) => {
  // If navigating via router: get :id from URL
  const { id } = useParams();
  const [gig, setGig] = useState(initialGig || null);
  const [contactInfo, setContactInfo] = useState(initialGig?.contact_info || '[Locked. Buy points to view.]');
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!initialGig);

  // Fetch gig data if not provided
  React.useEffect(() => {
    if (!gig && id) {
      setLoading(true);
      axios.get(`${process.env.REACT_APP_API_URL}/api/tutors/${id}/`)
        .then(res => {
          setGig(res.data);
          setContactInfo(res.data.contact_info || '[Locked. Buy points to view.]');
        })
        .catch(() => setError('Failed to load gig.'))
        .finally(() => setLoading(false));
    }
  }, [gig, id]);

  const handleUnlockContact = async () => {
    setUnlocking(true);
    setError('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/tutors/${id || gig.id}/unlock_contact/`);
      setContactInfo(res.data.contact_info);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to unlock contact info.');
    }
    setUnlocking(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!gig) return <div style={{ padding: 40 }}>Not found.</div>;

  return (
    <div style={{
      maxWidth: 700,
      margin: '32px auto',
      background: 'white',
      borderRadius: 12,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      padding: 36
    }}>
      <h2 style={{ marginBottom: 8, color: '#212529' }}>{gig.title}</h2>
      <div style={{ color: '#007bff', marginBottom: 14 }}>
        Posted by: {gig.teacher?.username || 'Tutor'}
      </div>
      <p style={{ marginBottom: 18, color: '#495057' }}>{gig.description}</p>
      <div style={{ marginBottom: 10 }}>
        <strong>Subjects:</strong> {gig.subject}
      </div>
      <div style={{ marginBottom: 10 }}>
        <strong>Location:</strong> {gig.location || 'N/A'}
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong>Contact Info:</strong>{' '}
        {contactInfo && !contactInfo.startsWith('[Locked') ? (
          <span>{contactInfo}</span>
        ) : (
          <button
            onClick={handleUnlockContact}
            disabled={unlocking}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '5px',
              fontSize: '15px',
              cursor: unlocking ? 'not-allowed' : 'pointer',
              marginLeft: '10px'
            }}
          >
            {unlocking ? 'Unlocking...' : 'Unlock Contact Info (1 point)'}
          </button>
        )}
      </div>
      {error && <div style={{ color: 'red', fontSize: 14, marginBottom: 12 }}>{error}</div>}

      <div style={{ margin: '18px 0' }}>
        <strong>Posted:</strong> {formatRelativeTime(gig.created_at)}
      </div>
      {/* Add more gig fields if needed, e.g. qualifications, experience, availability */}
    </div>
  );
};

export default GigDetails;
