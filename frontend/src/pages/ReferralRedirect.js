import { useParams, Navigate } from 'react-router-dom';

const ReferralRedirect = () => {
  const { username } = useParams();
  return <Navigate to={`/signup?ref=${encodeURIComponent(username)}`} replace />;
};

export default ReferralRedirect;
