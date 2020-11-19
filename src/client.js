import axios from "axios";

export const getAuthToken = async (user, pw) => {
  const UNAUTHORIZED = 401;
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const { status } = error.response;
      if (status === UNAUTHORIZED) {
        return status;
      }
      return Promise.reject(error);
    }
  );

  let req = await axios.post(
    "http://churrasco.uk.to:3005/api/auth",
    {
      email: user,
      password: pw,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return req;
};

export const getSitesData = async (token) => {
  const UNAUTHORIZED = 401;

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const { status } = error.response;
      if (status === UNAUTHORIZED) {
        return status;
      }
      return Promise.reject(error);
    }
  );

  const req = await axios.get("http://churrasco.uk.to:3005/api/sites", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const sitesArray = req.data.sites;

  const filtered = sitesArray.filter((site) => {
    //Filter short descriptions and no descriptions at all
    if (!site.descripcion || site.descripcion.length < 10) return false;
    //Filter nodechallenge urls and bad img extensions.
    const url = site.url_imagen;
    if (!url || url.includes("nodechallenge")) return false;
    if (url.substring(url.length - 3).toLowerCase() !== ("jpg" || "png"))
      return false;
    //Filter wrong coordinates
    const coordinates = site.ubicacion;
    if (typeof coordinates !== "object") return false;
    //All test passed
    return true;
  });

  return filtered;
};
