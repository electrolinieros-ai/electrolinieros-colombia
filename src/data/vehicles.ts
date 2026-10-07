/**
 * Catálogo de vehículos y productos.
 *
 * Las imágenes se cargan de forma automática desde cada carpeta de producto
 * (`src/assets/products/<vehículo>/<producto>/*.webp`) usando `import.meta.glob`.
 * Así no hay que mantener imports ni arrays de imágenes a mano: basta con
 * dejar la foto en la carpeta y ejecutar `npm run images`.
 */

const imageModules = import.meta.glob<string>(
  "../assets/products/**/*.{avif,jpeg,jpg,png,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const imagesByFolder: Record<string, string[]> = {};

for (const [filePath, url] of Object.entries(imageModules)) {
  const relativePath = filePath.slice("../assets/products/".length);
  const lastSlash = relativePath.lastIndexOf("/");

  if (lastSlash === -1) continue;

  const folder = relativePath.slice(0, lastSlash);
  (imagesByFolder[folder] ??= []).push(url);
}

for (const urls of Object.values(imagesByFolder)) {
  urls.sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
}

function imagesFor(productFolder: string): string[] {
  return imagesByFolder[productFolder] ?? [];
}

export type Product = {
  id: string;
  name: string;
  shortDescription: string;
  benefit: string;
  compatibility?: string;
  images?: string[];
  technicalDetails?: {
    label: string;
    value: string;
  }[];
};

export type Vehicle = {
  slug: string;
  brand: "BYD" | "Tesla";
  name: string;
  description: string;
  products: Product[];
};

export const vehicles: Vehicle[] = [
  {
    slug: "yuan-up",
    brand: "BYD",
    name: "Yuan Up",
    description:
      "Accesorios y soluciones pensados para mejorar la experiencia de tu Yuan Up.",
    products: [
      {
        id: "yuan-up-porton-electrico",
        name: "Portón eléctrico",
        shortDescription:
          "Convierte el portón trasero de tu Yuan Up en un sistema de apertura y cierre eléctrico.",
        benefit:
          "Más comodidad en el acceso al baúl y en el uso cotidiano de tu vehículo.",
        compatibility: "BYD Yuan Up 2024",
        images: imagesFor("yuan-up/porton-electrico"),
        technicalDetails: [
          {
            label: "Tipo",
            value: "Portón eléctrico para retrofit",
          },
          {
            label: "Control",
            value:
              "Llave/mando remoto, interruptor delantero y botón del portón",
          },
          {
            label: "Voltaje de operación",
            value: "11–15 V DC",
          },
          {
            label: "Tiempo de apertura y cierre",
            value: "6–10 segundos",
          },
          {
            label: "Ruido de funcionamiento",
            value: "<70 dB(A)",
          },
          {
            label: "Temperatura de operación",
            value: "-30 °C a 80 °C",
          },
          {
            label: "Vida útil",
            value: "50.000 ciclos",
          },
          {
            label: "Instalación",
            value: "Autoinstalación / retrofit",
          },
          {
            label: "Garantía",
            value: "3 años",
          },
          {
            label: "Origen",
            value: "Guangdong, China",
          },
        ],
      },
      {
        id: "yuan-up-protector-bateria",
        name: "Protector de batería",
        shortDescription:
          "Protección inferior para el conjunto de batería y componentes expuestos bajo el vehículo.",
        benefit:
          "Ayuda a proteger la parte inferior del vehículo frente a impactos y elementos del camino.",
        compatibility: "BYD Yuan Up 2024",
        images: imagesFor("yuan-up/protector-bateria"),
        technicalDetails: [
          { label: "Tipo", value: "Placa de protección inferior" },
          { label: "Material", value: "Acero / aluminio" },
          {
            label: "Aplicación",
            value: "Protección inferior del motor y chasis",
          },
          { label: "Instalación", value: "Tornillería especial" },
          { label: "Característica", value: "Resistencia al impacto" },
          { label: "Tamaño", value: "Dimensiones originales del vehículo" },
          { label: "Origen", value: "Guangdong, China" },
        ],
      },
      {
        id: "yuan-up-caja-frunk",
        name: "Caja de almacenamiento",
        shortDescription:
          "Aprovecha el espacio delantero de tu Yuan Up con un compartimento.",
        benefit:
          "Más espacio organizado para guardar cables, accesorios y objetos de uso cotidiano.",
        compatibility: "BYD Yuan Up 2024",
        images: imagesFor("yuan-up/frunk-storage"),
        technicalDetails: [
          {
            label: "Tipo",
            value: "Caja de almacenamiento para frunk",
          },
          {
            label: "Material",
            value: "Plástico",
          },
          {
            label: "Dimensiones",
            value: "76 × 60 × 25 cm",
          },
          {
            label: "Relleno interior",
            value: "Fibra sintética",
          },
          {
            label: "Peso",
            value: "5,5 kg",
          },
          {
            label: "Compatibilidad",
            value: "BYD ATTO 2 / Yuan Up +2024",
          },
        ],
      },
    ],
  },

  {
    slug: "seagull",
    brand: "BYD",
    name: "Seagull",
    description:
      "Accesorios y soluciones pensados para mejorar la experiencia de tu Seagull.",
    products: [
      {
        id: "seagull-porton-electrico",
        name: "Portón eléctrico",
        shortDescription:
          "Convierte el portón trasero de tu Seagull en un sistema de apertura y cierre eléctrico.",
        benefit:
          "Más comodidad en el acceso al baúl, con controles integrados al funcionamiento original del vehículo.",
        compatibility: "BYD Seagull 2023–actualidad",
        images: imagesFor("seagull/porton-electrico"),
        technicalDetails: [
          {
            label: "Tipo",
            value: "Sistema de portón eléctrico para retrofit",
          },
          {
            label: "Control",
            value: "Llave original y botón original del vehículo",
          },
          {
            label: "Antipinzamiento",
            value: "Inteligente",
          },
          {
            label: "Cierre",
            value: "Cierre suave",
          },
          {
            label: "Ajuste",
            value: "Ajuste de altura",
          },
          {
            label: "Programación",
            value: "No requiere programación",
          },
          {
            label: "Instalación",
            value: "No destructiva",
          },
          {
            label: "Compatibilidad",
            value: "BYD Seagull 2023–actualidad",
          },
        ],
      },
      {
        id: "seagull-protector-bateria",
        name: "Protector de batería",
        shortDescription:
          "Protección inferior diseñada para el conjunto de batería de tu BYD Seagull.",
        benefit:
          "Ayuda a proteger la parte inferior del vehículo frente a impactos y elementos del camino.",
        compatibility: "BYD Seagull",
        images: imagesFor("seagull/protector-bateria"),
        technicalDetails: [
          {
            label: "Tipo",
            value: "Protector del conjunto de batería",
          },
          {
            label: "Material",
            value: "Aleación de aluminio y magnesio",
          },
          {
            label: "Espesor",
            value: "3 mm",
          },
          {
            label: "Dimensiones",
            value: "95 × 152 cm",
          },
          {
            label: "Color",
            value: "Negro",
          },
          {
            label: "Instalación",
            value: "Utiliza los puntos de fijación originales del vehículo",
          },
          {
            label: "Origen",
            value: "Guangdong, China",
          },
        ],
      },
      {
        id: "seagull-dashcam",
        name: "Dashcam para BYD Seagull",
        shortDescription:
          "Dashcam específica para BYD Seagull con cámara de alta definición y diseño pensado para una instalación sencilla.",
        benefit:
          "Registra tus recorridos con una cámara integrada al vehículo y una instalación plug-and-play.",
        compatibility: "BYD Seagull",
        images: imagesFor("seagull/dashcam"),
        technicalDetails: [
          {
            label: "Tipo",
            value: "Dashcam específica para BYD Seagull",
          },
          {
            label: "Cámara",
            value: "Alta definición",
          },
          {
            label: "Instalación",
            value: "Plug-and-play",
          },
          {
            label: "Cableado",
            value: "Sin cableado complejo",
          },
          {
            label: "Configuración",
            value: "Sin configuraciones complicadas",
          },
          {
            label: "Peso",
            value: "0,4 kg",
          },
        ],
      },
    ],
  },

  {
    slug: "dolphin",
    brand: "BYD",
    name: "Dolphin",
    description:
      "Accesorios y soluciones pensados para mejorar la experiencia de tu Dolphin.",
    products: [
      {
        id: "dolphin-porton-electrico",
        name: "Portón eléctrico",
        shortDescription:
          "Convierte el portón trasero de tu BYD Dolphin en un sistema de apertura y elevación automática.",
        benefit:
          "Más comodidad en el acceso al baúl, con una instalación directa y sin modificaciones adicionales.",
        compatibility: "BYD Dolphin 2021+",
        images: imagesFor("dolphin/porton-electrico"),
        technicalDetails: [
          {
            label: "Tipo",
            value: "Kit de portón eléctrico",
          },
          {
            label: "Compatibilidad",
            value: "BYD Dolphin 2021+",
          },
          {
            label: "Apertura",
            value: "Elevación automática del portón",
          },
          {
            label: "Sensor de pie",
            value: "Opcional",
          },
          {
            label: "Instalación",
            value: "Directa, sin modificaciones adicionales",
          },
          {
            label: "Herramientas",
            value: "No requiere herramientas especiales",
          },
          {
            label: "Certificación",
            value: "CE",
          },
          {
            label: "Origen",
            value: "China continental",
          },
        ],
      },
      {
        id: "dolphin-protector-bateria",
        name: "Protector inferior de batería",
        shortDescription:
          "Placa de protección inferior diseñada específicamente para el BYD Dolphin.",
        benefit:
          "Ayuda a proteger el conjunto de batería y el chasis frente a impactos y elementos del camino.",
        compatibility: "BYD Dolphin",
        images: imagesFor("dolphin/protector-bateria"),
        technicalDetails: [
          {
            label: "Tipo",
            value: "Placa de protección del conjunto de batería",
          },
          {
            label: "Material",
            value: "Aleación de aluminio y magnesio",
          },
          {
            label: "Dimensiones",
            value: "1735 × 1180 mm",
          },
          {
            label: "Color",
            value: "Negro",
          },
          {
            label: "Diseño",
            value: "Protección inferior 3D",
          },
          {
            label: "Función",
            value: "Protección del conjunto de batería y chasis",
          },
          {
            label: "Instalación",
            value: "En los puntos de fijación originales del vehículo",
          },
          {
            label: "Origen",
            value: "Guangdong, China",
          },
        ],
      },
      {
        id: "dolphin-dashcam",
        name: "Dashcam para BYD Dolphin",
        shortDescription:
          "Dashcam diseñada para integrarse de forma discreta en tu BYD Dolphin y registrar tus recorridos.",
        benefit:
          "Obtén un registro visual de tus recorridos con grabación fluida, visión nocturna y GPS integrado.",
        compatibility: "BYD Dolphin",
        images: imagesFor("dolphin/dashcam"),
        technicalDetails: [
          {
            label: "Tipo",
            value: "Dashcam DVR integrada",
          },
          {
            label: "Grabación",
            value: "60 FPS",
          },
          {
            label: "Visión nocturna",
            value: "Sí",
          },
          {
            label: "Grabación en bucle",
            value: "Sí",
          },
          {
            label: "GPS",
            value: "Integrado",
          },
          {
            label: "Montaje",
            value: "Oculto",
          },
          {
            label: "Instalación",
            value: "Integración discreta en el vehículo",
          },
        ],
      },
    ],
  },

  {
    slug: "model-3",
    brand: "Tesla",
    name: "Model 3",
    description:
      "Accesorios y soluciones pensados para mejorar la experiencia de tu Model 3.",
    products: [
      {
        id: "model-3-protector-bateria",
        name: "Protector de batería",
        shortDescription:
          "Placa de protección frente a impactos y obstáculos del camino.",
        benefit:
          "Ayuda a proteger la batería, el tren de rodaje y componentes inferiores del vehículo durante la conducción.",
        compatibility: "Tesla Model 3 2019–2024",
        images: imagesFor("tesla3/protector-bateria"),
        technicalDetails: [
          {
            label: "Tipo",
            value: "Placa de protección inferior",
          },
          {
            label: "Material",
            value: "Aleación metálica",
          },
          {
            label: "Ubicación",
            value: "Parte delantera inferior del vehículo",
          },
          {
            label: "Protección",
            value: "Batería, tren de rodaje y chasis",
          },
          {
            label: "Dimensiones",
            value: "120 × 110 × 10 cm",
          },
          {
            label: "Peso",
            value: "5 kg",
          },
          {
            label: "Compatibilidad",
            value: "Tesla Model 3 2019–2026",
          },
          {
            label: "Origen",
            value: "China continental",
          },
        ],
      },
      {
        id: "model-3-cierre-frunk-electrico",
        name: "Cierre eléctrico para frunk",
        shortDescription:
          "Convierte el cierre del frunk de tu Tesla Model 3 en un sistema eléctrico de cierre suave y automático.",
        benefit:
          "Permite cerrar el frunk con mayor suavidad, evitando tener que ejercer fuerza para asegurar el cierre.",
        compatibility: "Tesla Model 3 2021–2024*",
        images: imagesFor("tesla3/soft-close"),
        technicalDetails: [
          {
            label: "Tipo",
            value: "Cierre eléctrico de succión suave para frunk",
          },
          { label: "Función", value: "Cierre automático y suave" },
          { label: "Material", value: "Aleación metálica" },
          { label: "Voltaje de operación", value: "9–15 V" },
          { label: "Corriente de operación", value: "<5 A" },
          { label: "Ruido de funcionamiento", value: "<50 dB" },
          {
            label: "Instalación",
            value: "Instalación directa, sin modificaciones",
          },
          { label: "Origen", value: "China continental" },
        ],
      },
      {
        id: "model-3-parasol-techo-panoramico",
        name: "Parasol panorámico",
        shortDescription:
          "Parasol diseñado para cubrir el techo panorámico del Tesla Model 3 y ayudar a reducir la exposición al sol.",
        benefit:
          "Ayuda a mantener el interior más confortable y reduce la entrada directa de luz solar por el techo.",
        compatibility: "Tesla Model 3",
        images: imagesFor("tesla3/parasol"),
        technicalDetails: [
          { label: "Tipo", value: "Parasol para techo panorámico" },
          { label: "Material", value: "Fibra de poliéster" },
          {
            label: "Instalación",
            value: "Sistema de fijación mediante hebillas",
          },
          { label: "Diseño", value: "Diseño específico para el vehículo" },
          { label: "Estilo", value: "Un solo color" },
          { label: "Modelo", value: "A90" },
          { label: "Instalación", value: "Fácil instalación" },
          { label: "Origen", value: "Guangdong, China" },
        ],
      },
    ],
  },

  {
    slug: "model-y",
    brand: "Tesla",
    name: "Model Y",
    description:
      "Accesorios y soluciones pensados para mejorar la experiencia de tu Model Y.",
    products: [
      {
        id: "model-y-power-frunk-cierre-suave",
        name: "Cierre eléctrico para Frunk",
        shortDescription:
          "Sistema eléctrico para automatizar el cierre del frunk de tu Tesla Model Y con un cierre suave y controlado.",
        benefit:
          "Más comodidad al cerrar el frunk, con un sistema eléctrico diseñado para integrarse al funcionamiento del vehículo.",
        compatibility: "Tesla Model Y Juniper 2025+",
        images: imagesFor("teslay/frunk"),
        technicalDetails: [
          { label: "Tipo", value: "Cerradura eléctrica para frunk" },
          { label: "Función", value: "Cierre eléctrico suave y automático" },
          {
            label: "Aplicación",
            value: "Actualización del sistema de cierre original",
          },
          { label: "Compatibilidad", value: "Tesla Model Y Juniper 2025+" },
          { label: "Instalación", value: "Actualización del sistema original" },
          { label: "Origen", value: "Guangdong, China" },
        ],
      },
      {
        id: "model-y-protector-bateria",
        name: "Protector de batería",
        shortDescription:
          "Protección metálica para la parte inferior de tu Tesla Model Y, diseñada para ayudar a reducir el riesgo de daños por impactos y obstáculos del camino.",
        benefit:
          "Ayuda a proteger los componentes inferiores del vehículo durante la conducción sobre carreteras irregulares.",
        compatibility: "Tesla Model Y — verificar año y versión",
        images: imagesFor("teslay/protector-bateria"),
        technicalDetails: [
          { label: "Tipo", value: "Protector inferior delantero" },
          { label: "Material", value: "Aleación de aluminio y magnesio" },
          { label: "Peso", value: "4 kg" },
          {
            label: "Ubicación",
            value: "Parte delantera inferior del vehículo",
          },
          {
            label: "Protección",
            value: "Motor, suspensión y componentes inferiores",
          },
          {
            label: "Instalación",
            value: "Utiliza los puntos de fijación originales del vehículo",
          },
          {
            label: "Modificación",
            value: "No requiere modificaciones al vehículo",
          },
          { label: "Diseño", value: "Adaptación 1:1 al vehículo" },
        ],
      },
      {
        id: "model-y-parasol-ventanas-juniper",
        name: "Kit de parasoles",
        shortDescription:
          "Kit de parasoles a medida para ayudar a reducir la entrada de luz y calor en el interior de tu Tesla Model Y.",
        benefit:
          "Ayuda a reducir la exposición directa al sol y aporta mayor privacidad durante el estacionamiento o los viajes.",
        compatibility: "Tesla Model Y Juniper 2025–2026",
        images: imagesFor("teslay/parasol"),
        technicalDetails: [
          { label: "Tipo", value: "Kit de parasoles para ventanas" },
          {
            label: "Aplicación",
            value: "Parabrisas, ventanas laterales y ventana trasera",
          },
          { label: "Diseño", value: "A medida para el vehículo" },
          {
            label: "Instalación",
            value: "Instalación sencilla mediante marco elástico",
          },
          { label: "Características", value: "Plegable y ligero" },
          { label: "Protección", value: "Protección solar y UV" },
          {
            label: "Tecnología",
            value: "Capa reflectante y aislamiento térmico",
          },
          { label: "Compatibilidad", value: "Tesla Model Y Juniper 2025–2026" },
        ],
      },
    ],
  },
];

export function getVehicleBySlug(slug: string) {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}

export function getProductById(
  vehicleSlug: string,
  productId: string,
): Product | undefined {
  return vehicles
    .find((vehicle) => vehicle.slug === vehicleSlug)
    ?.products.find((product) => product.id === productId);
}