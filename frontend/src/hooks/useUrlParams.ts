// hooks/useUrlParams.ts
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export type ParamPrimitive = string | number | boolean | null | undefined;
export type ParamValue = ParamPrimitive | ParamPrimitive[];

export function useUrlParams() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const setParams = (
    patch: Record<string, ParamValue>,
    { replace = false }: { replace?: boolean } = {},
  ) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(patch).forEach(([key, value]) => {
      params.delete(key); // clear existing (important for arrays)
      if (value == null) return;

      if (Array.isArray(value)) {
        if (!value.length) return;
        value.forEach(
          (v) => v != null && v !== '' && params.append(key, String(v)),
        );
      } else {
        const v = String(value);
        if (v === '') return;
        params.set(key, v);
      }
    });

    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace },
    );
  };

  return {
    searchParams,
    setParams,
  };
}
