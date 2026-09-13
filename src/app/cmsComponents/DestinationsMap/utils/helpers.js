export const DEFAULT_CENTER = [32.5085, 45.787];
export const DEFAULT_ZOOM = 5;

/* Flat map palette (matches the reference design). */
export const MAP_SEA_COLOR = "#1b5a7d";
export const MAP_LAND_COLOR = "#a9c5d0";
export const MAP_LAND_BORDER_COLOR = "#1b5a7d";

export function getDestinationsMapContent(data, lang = "en") {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  if (!translations.length) {
    return { content: null, hasContent: false };
  }

  const sectionType = data?.type || data?.componentType || data?.sectionType;
  if (sectionType && sectionType !== "DestinationsMap") {
    return { content: null, hasContent: false };
  }

  const normalized = String(lang || "").toLowerCase();
  const matched =
    translations.find(
      (t) => String(t?.languageCode || "").toLowerCase() === normalized
    ) || translations[0];

  const content = matched?.content || null;
  if (!content) {
    return { content: null, hasContent: false };
  }

  const cities = Array.isArray(content.cities) ? content.cities : [];
  const routes = Array.isArray(content.routes) ? content.routes : [];

  return {
    content,
    cities,
    routes,
    labels: content.labels || {},
    hasContent: cities.length > 0 || routes.length > 0,
  };
}

function normalizeCity(city = {}, { isNewCity } = {}) {
  const imageUrl = Array.isArray(city.imageUrl)
    ? city.imageUrl[0] || ""
    : city.imageUrl || "";

  return {
    cityId: city.cityId || "",
    cityName: city.cityName || "",
    countryName: city.countryName || "",
    IATACode: city.IATACode || "",
    latitude: city.latitude ?? "",
    longitude: city.longitude ?? "",
    isNewCity:
      typeof isNewCity === "boolean" ? isNewCity : Boolean(city.isNewCity),
    price: city.price ?? "",
    currency: city.currency || "",
    numberOfFlightsPerWeek: city.numberOfFlightsPerWeek ?? "",
    duration: city.duration ?? "",
    flightType: city.flightType || "",
    imageUrl,
  };
}

/** Editor city fields (category comes from which group the city sits in). */
function toEditorCity(city = {}) {
  const normalized = normalizeCity(city);
  return {
    cityId: normalized.cityId,
    cityName: normalized.cityName,
    countryName: normalized.countryName,
    IATACode: normalized.IATACode,
    latitude: normalized.latitude,
    longitude: normalized.longitude,
    price: normalized.price,
    currency: normalized.currency,
    numberOfFlightsPerWeek: normalized.numberOfFlightsPerWeek,
    duration: normalized.duration,
    flightType: normalized.flightType,
    imageUrl: normalized.imageUrl,
  };
}

function serializeCity(city = {}, isNewCity) {
  return {
    cityId: city?.cityId || "",
    cityName: city?.cityName || "",
    countryName: city?.countryName || "",
    IATACode: city?.IATACode || "",
    latitude: city?.latitude ?? "",
    longitude: city?.longitude ?? "",
    isNewCity: Boolean(isNewCity),
    price: city?.price ?? "",
    currency: city?.currency || "",
    numberOfFlightsPerWeek: city?.numberOfFlightsPerWeek ?? "",
    duration: city?.duration ?? "",
    flightType: city?.flightType || "",
    imageUrl: city?.imageUrl ? [city.imageUrl] : [],
  };
}

/** Flat cities → New routes / Our network editor groups. */
export function citiesToRouteGroups(cities = []) {
  const list = Array.isArray(cities) ? cities : [];
  return {
    newRouteCities: list.filter((city) => city?.isNewCity).map(toEditorCity),
    networkCities: list.filter((city) => !city?.isNewCity).map(toEditorCity),
  };
}

/** Editor groups → flat cities for runtime / CMS storage. */
export function routeGroupsToCities(content = {}) {
  if (Array.isArray(content.cities) && content.cities.length) {
    return content.cities.map((city) => normalizeCity(city));
  }

  return [
    ...(Array.isArray(content.newRouteCities) ? content.newRouteCities : []).map(
      (city) => normalizeCity(city, { isNewCity: true })
    ),
    ...(Array.isArray(content.networkCities) ? content.networkCities : []).map(
      (city) => normalizeCity(city, { isNewCity: false })
    ),
  ];
}

export function getDestinationsMapEditorContent(data, lang = "en") {
  const result = getDestinationsMapContent(data, lang);
  const cities = result.cities || [];
  const routes = result.routes || [];
  const labels = result.labels || {};
  const groups = citiesToRouteGroups(cities);

  return {
    fromLabel: labels?.from || "",
    toLabel: labels?.to || "",
    resetLabel: labels?.reset || "",
    bookNowLabel: labels?.bookNow || "",
    newRoutesLabel: labels?.newRoutes || "",
    ourNetworkLabel: labels?.ourNetwork || "",
    newRouteCities: groups.newRouteCities,
    networkCities: groups.networkCities,
    routes: (Array.isArray(routes) ? routes : []).map((route) => ({
      fromCityId: route?.fromCityId || "",
      toCityId: route?.toCityId || "",
    })),
  };
}

export function wrapDestinationsMapContent(content = {}, lang = "en") {
  const cities = routeGroupsToCities(content);

  return {
    type: "DestinationsMap",
    translations: [
      {
        languageCode: lang,
        content: {
          labels: {
            from: content.fromLabel || "",
            to: content.toLabel || "",
            reset: content.resetLabel || "",
            bookNow: content.bookNowLabel || "",
            newRoutes: content.newRoutesLabel || "",
            ourNetwork: content.ourNetworkLabel || "",
          },
          cities: cities.map((city) => serializeCity(city, city.isNewCity)),
          routes: (Array.isArray(content.routes) ? content.routes : []).map(
            (route) => ({
              fromCityId: route?.fromCityId || "",
              toCityId: route?.toCityId || "",
            })
          ),
        },
      },
    ],
  };
}

export function transformDestinationData(backendCities) {
  if (!backendCities || !Array.isArray(backendCities)) return [];

  return backendCities.map((city) => {
    const imageUrls = Array.isArray(city.imageUrl)
      ? city.imageUrl
      : city.imageUrl
        ? [city.imageUrl]
        : [];
    const mainImageUrl = imageUrls[0] || "";

    const formattedPrice =
      city.price && city.currency
        ? `${city.price} ${city.currency}`
        : city.price
          ? `${city.price}`
          : "";

    const formattedFlightsPerWeek = city.numberOfFlightsPerWeek
      ? `${city.numberOfFlightsPerWeek} ${
          city.numberOfFlightsPerWeek === 1 ? "flight" : "flights"
        } per week`
      : "";

    const formattedDuration = city.duration ? `${city.duration} flight` : "";

    return {
      id: city.cityId,
      name: city.cityName,
      lat: Number(city.latitude),
      lng: Number(city.longitude),
      description: city.isNewCity ? "New Route" : "Popular Destination",
      image: {
        src: mainImageUrl,
        urls: imageUrls,
      },
      country: city.countryName,
      city: city.cityName,
      code: city.IATACode,
      flightType: city.flightType || "Non-stop flight",
      flightsPerWeek: formattedFlightsPerWeek,
      flightDuration: formattedDuration,
      price: formattedPrice,
      isNewRoute: Boolean(city.isNewCity),
    };
  });
}

export function buildRoutesMap(routesData) {
  const map = new Map();
  routesData.forEach((route) => {
    if (!map.has(route.fromCityId)) {
      map.set(route.fromCityId, []);
    }
    map.get(route.fromCityId).push(route.toCityId);
  });
  return map;
}

export function getPlaneDirection(from, to) {
  const dLat = to[0] - from[0];
  const dLng = to[1] - from[1];

  if (dLat === 0 && dLng === 0) return "E";

  const angleRad = Math.atan2(dLat, dLng);
  let angleDeg = (angleRad * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;

  if (angleDeg >= 337.5 || angleDeg < 22.5) return "E";
  if (angleDeg >= 22.5 && angleDeg < 67.5) return "NE";
  if (angleDeg >= 67.5 && angleDeg < 112.5) return "N";
  if (angleDeg >= 112.5 && angleDeg < 157.5) return "NW";
  if (angleDeg >= 157.5 && angleDeg < 202.5) return "W";
  if (angleDeg >= 202.5 && angleDeg < 247.5) return "SW";
  if (angleDeg >= 247.5 && angleDeg < 292.5) return "S";
  if (angleDeg >= 292.5 && angleDeg < 337.5) return "SE";

  return "E";
}

export function buildCurvePoints(from, to, segments = 80) {
  const points = [];
  const lat1 = from.lat;
  const lng1 = from.lng;
  const lat2 = to.lat;
  const lng2 = to.lng;
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  let nLat = -dLng;
  let nLng = dLat;
  const len = Math.sqrt(nLat * nLat + nLng * nLng) || 1;
  nLat /= len;
  nLng /= len;

  const offsetFactor = 0.25;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const baseLat = lat1 + dLat * t;
    const baseLng = lng1 + dLng * t;
    const curve = Math.sin(Math.PI * t) * offsetFactor;
    points.push([baseLat + nLat * curve, baseLng + nLng * curve]);
  }

  return points;
}

export function createPlaneIcon(L, direction) {
  const rotationByDir = {
    N: -90,
    NE: -45,
    E: 0,
    SE: 45,
    S: 90,
    SW: 135,
    W: 180,
    NW: -135,
  };
  const rotation = rotationByDir[direction] ?? 0;

  return L.divIcon({
    className: "route-plane-icon",
    html: `
      <div style="
        transform: translate(-50%, -50%) translateY(-6px) rotate(${rotation}deg);
        font-size: 20px;
        line-height: 1;
      ">✈️</div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export function createCustomIcon(L, destination, {
  hoveredDestination,
  fromDestination,
  toDestination,
} = {}) {
  const isHovered = hoveredDestination?.id === destination.id;
  const isFrom = fromDestination?.id === destination.id;
  const isTo = toDestination?.id === destination.id;
  const isActive = isHovered || isFrom || isTo;
  const baseColor = destination.isNewRoute ? "#A6CFE0" : "#BAA981";

  if (isActive) {
    const imageUrl =
      destination.image?.src ||
      (destination.image?.urls && destination.image.urls[0]) ||
      "";

    return new L.DivIcon({
      className: "custom-icon-hover",
      html: `
        <div style="position: relative; display: inline-block; margin-top:-10px">
          <div style="
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            background-image: url(${imageUrl});
            background-size: cover;
            background-position: center;
            position: relative;
          "></div>
          <div style="
            position: absolute;
            left: 50%;
            bottom: -8px;
            transform: translateX(-50%) translateY(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 6px solid #ffffff;
          "></div>
        </div>
        <div style="
          margin-top: 10px;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0,0,0,0.65);
          white-space: nowrap;
        ">
          ${destination.name}
        </div>
      `,
      iconSize: [60, 70],
      iconAnchor: [30, 60],
      popupAnchor: [0, -30],
    });
  }

  return new L.DivIcon({
    className: "custom-icon",
    html: `
      <div style="position: relative; width: 18px; height: 22px; cursor: pointer;">
        <div style="
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          background-color: ${baseColor};
          border: 1.5px solid rgba(255,255,255,0.85);
          border-radius: 50%;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
        "></div>
      </div>
    `,
    iconSize: [18, 22],
    iconAnchor: [9, 14],
    popupAnchor: [0, -10],
  });
}
