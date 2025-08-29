// src/routes/Error.jsx
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router-dom';
import ThemedButton from '../components/ThemedButton';

export default function Error() {
  const navigate = useNavigate();
  const error = useRouteError();

  // normalize message/status
  const isResponse = isRouteErrorResponse(error);
  const title = isResponse
    ? `Oops! ${error.status}`
    : 'Something went wrong 😢';
  const message =
    (isResponse && (error.data?.message || error.statusText)) ||
    error?.message ||
    'An unexpected error occurred.';

  return (
    <div className="ml-6 mt-6 w-full max-w-xl rounded-2xl border border-outline bg-primary p-8 shadow-xl">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-outline shadow">
          <span className="text-2xl text-white">!</span>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold leading-tight text-text-primary">
            {title}
          </h1>

          {/* Optional technical details toggle */}
          {import.meta.env?.DEV && error && (
            <details className="mt-4 whitespace-pre-wrap rounded-lg bg-white/60 p-4 text-sm text-[#5f5f5f]">
              <summary className="cursor-pointer font-medium">
                Technical details
              </summary>
              {console.log(error)}
              {isResponse ? JSON.stringify(error, null, 2) : message}
            </details>
          )}

          <div className="mt-6 flex items-center gap-3">
            <ThemedButton onClick={() => navigate(-1)}>Go back</ThemedButton>

            {/* Secondary: take user home */}
            <ThemedButton
              color="secondary"
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Go home
            </ThemedButton>
          </div>
        </div>
      </div>
    </div>
  );
}
