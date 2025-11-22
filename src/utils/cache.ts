export const keepCache = (): boolean => {
    const cache = localStorage.getItem("collect_cache_confirmed");
    return !!cache;
  };
  