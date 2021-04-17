export type Loading = {
  loading: boolean;
  loaded: boolean;
  error?: Error | undefined | null;
};

export const defaultLoading = {
  loading: false,
  loaded: false,
  error: undefined,
};
