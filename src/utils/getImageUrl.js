export const getImageUrl = (path) => {
  if (!path) return "/avatar.png";

  return path.startsWith("http")
    ? path
    : `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES}/${path}`;
};

