import { writeFile } from "node:fs/promises";

const categories = [
  { name: "Audio", nouns: ["Headphones", "Speaker", "Earbuds", "Turntable", "Soundbar"] },
  { name: "Computing", nouns: ["Keyboard", "Monitor", "Dock", "Mouse", "Webcam"] },
  { name: "Desk", nouns: ["Lamp", "Stand", "Organizer", "Charger", "Clock"] },
  { name: "Gaming", nouns: ["Controller", "Headset", "Console", "Keypad", "Microphone"] },
  { name: "Mobile", nouns: ["Phone", "Power Bank", "Case", "Gimbal", "Tracker"] },
  { name: "Photography", nouns: ["Camera", "Lens", "Tripod", "Light", "Scanner"] },
  { name: "Smart Home", nouns: ["Hub", "Sensor", "Thermostat", "Doorbell", "Display"] },
  { name: "Wearables", nouns: ["Watch", "Band", "Ring", "Clip", "Glasses"] },
];
const brands = ["Auralab", "Forma", "Kite", "Monogram", "Nexa", "Orbit"];
const adjectives = ["Arc", "Halo", "Lumen", "Mono", "Nova", "Pulse", "Quiet", "Studio", "Vector", "Wave"];
const colors = ["Bone White", "Graphite", "Moss", "Signal Orange", "Slate Blue", "Soft Sand"];
const badges = ["New", "Editor's pick", "Low stock", "", "", ""];

const products = Array.from({ length: 120 }, (_, index) => {
  const id = index + 1;
  const group = categories[index % categories.length];
  const noun = group.nouns[Math.floor(index / categories.length) % group.nouns.length];
  const adjective = adjectives[(index * 3) % adjectives.length];
  const brand = brands[index % brands.length];
  const price = 49 + ((index * 37) % 13) * 25;
  const inStock = index % 9 !== 0;
  const name = `${brand} ${adjective} ${noun} ${String((index % 4) + 1).padStart(2, "0")}`;

  return {
    id,
    name,
    image: `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(name)}&backgroundColor=e5ebd8,f6d5c8,dde6eb`,
    description: `A refined ${noun.toLowerCase()} designed for reliable daily use, with tactile controls, balanced performance, and a calm material finish.`,
    category: group.name,
    brand,
    color: colors[index % colors.length],
    price,
    originalPrice: price + 40 + (index % 4) * 20,
    rating: Number((4 + (index % 10) / 10).toFixed(1)),
    reviews: 18 + ((index * 17) % 430),
    inStock,
    stock: inStock ? 4 + ((index * 7) % 42) : 0,
    badge: badges[index % badges.length],
    sku: `NX-${group.name.slice(0, 3).toUpperCase()}-${String(id).padStart(4, "0")}`,
  };
});

const response = ({
  statusCode,
  body,
  label,
  rules = [],
  isDefault = true,
}) => ({
  uuid: crypto.randomUUID(),
  body,
  latency: 280,
  statusCode,
  label,
  headers: [],
  bodyType: "INLINE",
  filePath: "",
  databucketID: "",
  sendFileAsBody: false,
  rules,
  rulesOperator: "AND",
  disableTemplating: false,
  fallbackTo404: false,
  default: isDefault,
  crudKey: "id",
  callbacks: [],
});

const loginRouteId = crypto.randomUUID();
const logoutRouteId = crypto.randomUUID();
const productRouteId = crypto.randomUUID();
const productBucketId = "products";

const environment = {
  uuid: crypto.randomUUID(),
  lastMigration: 33,
  name: "NEXA Product Showcase API",
  endpointPrefix: "",
  latency: 0,
  port: 3000,
  hostname: "0.0.0.0",
  routes: [
    {
      uuid: loginRouteId,
      type: "http",
      documentation: "Authenticate the demo user and return mock access and refresh tokens.",
      method: "post",
      endpoint: "api/login",
      responses: [
        response({
          statusCode: 200,
          label: "Valid demo credentials",
          isDefault: false,
          rules: [
            { target: "body", modifier: "username", value: "demo", invert: false, operator: "equals" },
            { target: "body", modifier: "password", value: "Demo@123", invert: false, operator: "equals" },
          ],
          body: JSON.stringify({
            accessToken: "nexa-demo-access-token",
            refreshToken: "nexa-demo-refresh-token",
            expiresIn: 3600,
            user: { id: 1, name: "Demo Curator", username: "demo" },
          }, null, 2),
        }),
        response({
          statusCode: 401,
          label: "Invalid credentials",
          body: JSON.stringify({ message: "Incorrect username or password." }, null, 2),
        }),
      ],
      responseMode: null,
      streamingMode: null,
      streamingInterval: 0,
    },
    {
      uuid: logoutRouteId,
      type: "http",
      documentation: "Revoke the current mock token.",
      method: "post",
      endpoint: "api/logout",
      responses: [response({ statusCode: 204, label: "Logged out", body: "" })],
      responseMode: null,
      streamingMode: null,
      streamingInterval: 0,
    },
    {
      uuid: productRouteId,
      type: "crud",
      documentation: "List, filter, paginate, and retrieve products by id.",
      method: "",
      endpoint: "api/product",
      responses: [
        {
          ...response({ statusCode: 200, label: "Product data", body: "{}" }),
          latency: 180,
          bodyType: "DATABUCKET",
          databucketID: productBucketId,
        },
      ],
      responseMode: null,
      streamingMode: null,
      streamingInterval: 0,
    },
  ],
  proxyMode: false,
  proxyHost: "",
  proxyReqHeaders: [],
  proxyResHeaders: [],
  proxyRemovePrefix: false,
  cors: true,
  headers: [{ key: "Content-Type", value: "application/json" }],
  tlsOptions: {
    enabled: false,
    type: "CERT",
    pfxPath: "",
    certPath: "",
    keyPath: "",
    caPath: "",
    passphrase: "",
  },
  data: [
    {
      uuid: crypto.randomUUID(),
      id: productBucketId,
      name: "Products",
      documentation: "120 deterministic products used by the CRUD route.",
      value: JSON.stringify(products),
    },
  ],
  folders: [],
  rootChildren: [
    { type: "route", uuid: loginRouteId },
    { type: "route", uuid: logoutRouteId },
    { type: "route", uuid: productRouteId },
  ],
  callbacks: [],
};

await writeFile(
  new URL("../mockoon-data.json", import.meta.url),
  `${JSON.stringify(environment, null, 2)}\n`,
  "utf8",
);

console.log(`Generated ${products.length} products in mockoon-data.json`);
