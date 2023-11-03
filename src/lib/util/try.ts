export const try$ = <TRet, TFallback = null>(
  fn: (...args: never[]) => TRet,
  fallback?: TFallback,
) => {
  try {
    return fn();
  } catch {
    return (fallback ?? null) as TFallback extends null | undefined
      ? null
      : TFallback;
  }
};

export const tryAsync$ = async <TRet, TFallback = null>(
  fn: (...args: never[]) => Promise<TRet>,
  fallback?: TFallback,
) => {
  try {
    return await fn();
  } catch {
    return (fallback ?? null) as TFallback extends null | undefined
      ? null
      : TFallback;
  }
};
