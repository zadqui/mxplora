window.APP_DATA = {
  languages: [
    { code: "ES", name: "Español", flag: "🇪🇸" },
    { code: "EN", name: "English", flag: "🇺🇸" },
    { code: "FR", name: "Français", flag: "🇫🇷" },
    { code: "DE", name: "Deutsch", flag: "🇩🇪" },
    { code: "IT", name: "Italiano", flag: "🇮🇹" },
    { code: "PT", name: "Português", flag: "🇧🇷" }
  ],

  sections: {
    restaurantes: {
      searchFields: [
        { label: "¿Qué tipo de comida buscas?", placeholder: "Ej. Tacos, Sushi, Pizza..." }
      ],
      categories: [
        { label: "Mexicana", icon: "" },
        { label: "Italiana", icon: "" },
        { label: "Japonesa", icon: "" },
        { label: "Cafeterías", icon: "" },
        { label: "Internacional", icon: "" }
      ],
      filterKey: "type"
    },

    hoteles: {
      searchFields: [
        { label: "¿Qué tipo de alojamiento buscas?", placeholder: "Ej. Boutique, Departamento..." },
        { label: "Precio máx. por noche", placeholder: "$ MXN" }
      ],
      categories: [
        { label: "Boutique", icon: "" },
        { label: "Departamento", icon: "" },
        { label: "Habitación", icon: "" }
      ],
      filterKey: "type"
    },

    bazares: {
      searchFields: [
        { label: "¿Qué producto buscas?", placeholder: "Ej. Ropa, Libros, Artesanías..." }
      ],
      categories: [
        { label: "Arte", icon: "" },
        { label: "Libros", icon: "" },
        { label: "Ropa", icon: "" },
        { label: "Artesanías", icon: "" },
        { label: "Accesorios", icon: "" },
        { label: "Otros", icon: "" }
      ],
      filterKey: "type"
    },

    fanzone: {
      searchFields: [],
      categories: [],
      filterKey: null
    },

    experiencias: {
      searchFields: [
        { label: "¿Qué tipo de experiencia buscas?", placeholder: "Ej. Cultural, Vida nocturna, Naturaleza..." }
      ],
      categories: [
        { label: "Culturales", icon: ""},
        { label: "Vida nocturna", icon: ""},
        { label: "Naturaleza", icon: ""},
        { label: "Arte y creatividad", icon: ""},
        { label: "Historia", icon: "" },
        { label: "Compras y mercados" },
        { label: "Eventos", icon: "" },
        { label: "Bienestar", icon: "" },
        { label: "Deportes y aventura", icon: ""}
      ],
      filterKey: "category"
    }
  },

cards: {
restaurantes: [
  {
    id: "tesorito-jalisco",
    name: "El Tesorito de Jalisco",
    type: "Mexicana",
    zone: "Roma Norte",
    price: "$100–200 MXN",
    img: "img/restaurantes/card-eltesorito.png",
    lat: 19.4143,
    lng: -99.1628
  },
  {
    id: "cardenal-alameda",
    name: "El Cardenal Alameda",
    type: "Mexicana",
    zone: "Centro",
    price: "$200–400 MXN",
    img: "img/restaurantes/card-alameda.png",
    lat: 19.4352,
    lng: -99.1427
  },
  {
    id: "mexicano-mezcaleria",
    name: "El Mexicano Restaurante y Mezcalería",
    type: "Mexicana",
    zone: "Cuauhtémoc",
    price: "$250–400 MXN",
    img: "img/restaurantes/card-mezcalería.png",
    lat: 19.4285,
    lng: -99.1569
  },
  {
    id: "porfirios-coyoacan",
    name: "Porfirio's Coyoacán",
    type: "Mexicana",
    zone: "Coyoacán",
    price: "$250–400 MXN",
    img: "img/restaurantes/card-porfirios.png",
    lat: 19.3467,
    lng: -99.1617
  },
  {
    id: "villa-maria",
    name: "Villa María",
    type: "Mexicana",
    zone: "Polanco",
    price: "$250–400 MXN",
    img: "img/restaurantes/card-villa.png",
    lat: 19.4328,
    lng: -99.1915
  },
  {
    id: "santo-habanero",
    name: "Santo Habanero",
    type: "Mexicana",
    zone: "Roma Norte",
    price: "$250–400 MXN",
    img: "img/restaurantes/card-habanero.png",
    lat: 19.4135,
    lng: -99.1641
  },
  {
    id: "madre-cocina",
    name: "Madre Cocina Mexicana",
    type: "Mexicana",
    zone: "Coyoacán",
    price: "$250–400 MXN",
    img: "img/restaurantes/card-madremx.png",
    lat: 19.3489,
    lng: -99.1625
  },

  {
    id: "parole-polanco",
    name: "Parole Polanco",
    type: "Italiana",
    zone: "Polanco",
    price: "$1000+ MXN",
    img: "img/restaurantes/card-parole.png",
    lat: 19.4345,
    lng: -99.1932
  },
  {
    id: "nonsolo",
    name: "NONSOLO",
    type: "Italiana",
    zone: "Centro",
    price: "$200–300 MXN",
    img: "img/restaurantes/card-nonsolo.png",
    lat: 19.4322,
    lng: -99.1345
  },
  {
    id: "pasta-comedia",
    name: "Pasta Comedia",
    type: "Italiana",
    zone: "Condesa",
    price: "$185–355 MXN",
    img: "img/restaurantes/card-pasta.png",
    lat: 19.4123,
    lng: -99.1718
  },
  {
    id: "la-famiglia",
    name: "La Famiglia",
    type: "Italiana",
    zone: "Insurgentes",
    price: "$200–350 MXN",
    img: "img/restaurantes/card-famiglia.png",
    lat: 19.3728,
    lng: -99.1784
  },
  {
    id: "nonna",
    name: "Nonna",
    type: "Italiana",
    zone: "Condesa",
    price: "$300–600 MXN",
    img: "img/restaurantes/card-nonna.png",
    lat: 19.4111,
    lng: -99.1705
  },
  {
    id: "vapiano-vallejo",
    name: "Vapiano Vía Vallejo",
    type: "Italiana",
    zone: "Azcapotzalco",
    price: "$200–300 MXN",
    img: "img/restaurantes/card-vapiano.png",
    lat: 19.4856,
    lng: -99.1847
  },
  {
    id: "terra-italia",
    name: "Terra Italia",
    type: "Italiana",
    zone: "Del Valle",
    price: "$300–400 MXN",
    img: "img/restaurantes/card-tierra.png",
    lat: 19.3732,
    lng: -99.1667
  },

  {
    id: "mian-dui-mian",
    name: "Mian dui Mian",
    type: "Internacional",
    zone: "Centro",
    price: "$150–350 MXN",
    img: "img/restaurantes/card-miandui.png",
    lat: 19.4314,
    lng: -99.1353
  },
  {
    id: "orange-king",
    name: "Orange King Asian Food",
    type: "Internacional",
    zone: "Cuauhtémoc",
    price: "$150–300 MXN",
    img: "img/restaurantes/card-orange.png",
    lat: 19.4271,
    lng: -99.1554
  },
  {
    id: "jinxi",
    name: "JinXi Sabor Oriental",
    type: "Internacional",
    zone: "Juárez",
    price: "$200–300 MXN",
    img: "img/restaurantes/card-jinxi.png",
    lat: 19.4265,
    lng: -99.1583
  },
  {
    id: "blossom",
    name: "Blossom Del Valle",
    type: "Internacional",
    zone: "Del Valle",
    price: "$250–500 MXN",
    img: "img/restaurantes/card-blossom.png",
    lat: 19.3724,
    lng: -99.1659
  },
  {
    id: "yan-polanco",
    name: "YAN",
    type: "Internacional",
    zone: "Polanco",
    price: "$300–500 MXN",
    img: "img/restaurantes/card-yan.png",
    lat: 19.4337,
    lng: -99.1926
  },

  {
    id: "binbean",
    name: "BinBean Coffee",
    type: "Cafeterías",
    zone: "Roma Norte",
    price: "$150–250 MXN",
    img: "img/restaurantes/card-binbean.png",
    lat: 19.4151,
    lng: -99.1636
  },
  {
    id: "brown-caffeine",
    name: "Brown Caffeine Lab",
    type: "Cafeterías",
    zone: "Roma Sur",
    price: "$80–200 MXN",
    img: "img/restaurantes/card-brown.png",
    lat: 19.4078,
    lng: -99.1602
  },
  {
    id: "cafe-almonte",
    name: "Café Almonte",
    type: "Cafeterías",
    zone: "Coyoacán",
    price: "$50–150 MXN",
    img: "img/restaurantes/card-almonte.png",
    lat: 19.3479,
    lng: -99.1611
  },
  {
    id: "bunker-cafe",
    name: "Bunker Café",
    type: "Cafeterías",
    zone: "Mixcoac",
    price: "$80–200 MXN",
    img: "img/restaurantes/card-bunker.png",
    lat: 19.3764,
    lng: -99.1872
  },
  {
    id: "pasteleria-ideal",
    name: "Pastelería Ideal",
    type: "Cafeterías",
    zone: "Centro",
    price: "$1–100 MXN",
    img: "img/restaurantes/card-ideal.png",
    lat: 19.4329,
    lng: -99.1374
  }
],
    hoteles: [
      {
        id: "h1",
        name: "Four Seasons México",
        subtitle: "Reforma",
        price: "Desde $8,500/noche",
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200",
        badge: "Favorito entre usuarios",
        type: "Boutique"
      },
      {
        id: "h2",
        name: "St. Regis México",
        subtitle: "Reforma",
        price: "Desde $7,200/noche",
        img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200",
        badge: "Lujo",
        type: "Boutique"
      },
      {
        id: "h3",
        name: "Condesa DF",
        subtitle: "Condesa",
        price: "Desde $4,100/noche",
        img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200",
        badge: "Diseño",
        type: "Boutique"
      },
      {
        id: "h4",
        name: "Casa Polanco",
        subtitle: "Polanco",
        price: "Desde $6,000/noche",
        img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200",
        badge: "Exclusivo",
        type: "Boutique"
      },
      {
        id: "h5",
        name: "Casa Comtesse",
        subtitle: "Condesa",
        price: "Desde $3,600/noche",
        img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200",
        badge: "Boutique",
        type: "Departamento"
      },
      {
        id: "h6",
        name: "Hotel Nima Local",
        subtitle: "Roma",
        price: "Desde $2,800/noche",
        img: "https://images.unsplash.com/photo-1560448075-bb485b067938?q=80&w=1200",
        badge: "Diseño",
        type: "Departamento"
      },
      {
        id: "h7",
        name: "ULIV Roma Norte",
        subtitle: "Roma Norte",
        price: "Desde $2,200/noche",
        img: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1200",
        badge: "Estancia urbana",
        type: "Departamento"
      },
      {
        id: "h8",
        name: "Suites Obelisk",
        subtitle: "Polanco",
        price: "Desde $2,900/noche",
        img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200",
        badge: "Cómodo",
        type: "Departamento"
      },
      {
        id: "h9",
        name: "Gran Hotel CDMX",
        subtitle: "Centro Histórico",
        price: "Desde $2,200/noche",
        img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200",
        badge: "Clásico",
        type: "Habitación"
      },
      {
        id: "h10",
        name: "Hilton Santa Fe",
        subtitle: "Santa Fe",
        price: "Desde $2,900/noche",
        img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200",
        badge: "Corporativo",
        type: "Habitación"
      },
      {
        id: "h11",
        name: "Hotel Círculo Condesa",
        subtitle: "Condesa",
        price: "Desde $2,100/noche",
        img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200",
        badge: "Buena ubicación",
        type: "Habitación"
      },
      {
        id: "h12",
        name: "Hotel Historico Central",
        subtitle: "Centro",
        price: "Desde $3,100/noche",
        img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200",
        badge: "Muy recomendado",
        type: "Habitación"
      }
    ],

    bazares: [
      {
        id: "b1",
        name: "Galería de Arte Polanco",
        subtitle: "Polanco",
        price: "Entrada libre",
        img: "",
        badge: "Curado",
        type: "Arte"
      },
      {
        id: "b2",
        name: "Kurimanzutto",
        subtitle: "San Miguel Chapultepec",
        price: "Entrada libre",
        img: "",
        badge: "Arte contemporáneo",
        type: "Arte"
      },
      {
        id: "b3",
        name: "OMA",
        subtitle: "Roma Norte",
        price: "Entrada libre",
        img: "",
        badge: "Seleccionado",
        type: "Arte"
      },
      {
        id: "b4",
        name: "El Péndulo Condesa",
        subtitle: "Condesa",
        price: "Entrada libre",
        img: "",
        badge: "Favorito entre usuarios",
        type: "Libros"
      },
      {
        id: "b5",
        name: "Librería Rosario Castellanos",
        subtitle: "Condesa",
        price: "Entrada libre",
        img: "",
        badge: "Muy completa",
        type: "Libros"
      },
      {
        id: "b6",
        name: "A través del espejo",
        subtitle: "Roma",
        price: "Entrada libre",
        img: "",
        badge: "Independiente",
        type: "Libros"
      },
      {
        id: "b7",
        name: "Bazar del Sábado",
        subtitle: "San Ángel",
        price: "Entrada libre",
        img: "",
        badge: "Muy visitado",
        type: "Ropa"
      },
      {
        id: "b8",
        name: "Goodbye Folk",
        subtitle: "Roma Norte",
        price: "Desde $250 MXN",
        img: "",
        badge: "Vintage",
        type: "Ropa"
      },
      {
        id: "b9",
        name: "Loose Blues",
        subtitle: "Roma Norte",
        price: "Desde $300 MXN",
        img: "",
        badge: "Streetwear",
        type: "Ropa"
      },
      {
        id: "b10",
        name: "Mercado de la Ciudadela",
        subtitle: "Centro",
        price: "Entrada libre",
        img: "",
        badge: "Artesanía local",
        type: "Artesanías"
      },
      {
        id: "b11",
        name: "Fonart Reforma",
        subtitle: "Reforma",
        price: "Desde $150 MXN",
        img: "",
        badge: "Hecho en México",
        type: "Artesanías"
      },
      {
        id: "b12",
        name: "Casa de las Artesanías",
        subtitle: "Centro",
        price: "Desde $120 MXN",
        img: "",
        badge: "Tradicional",
        type: "Artesanías"
      },
      {
        id: "b13",
        name: "Sephora Antara",
        subtitle: "Polanco",
        price: "Desde $250 MXN",
        img: "",
        badge: "Belleza",
        type: "Accesorios"
      },
      {
        id: "b14",
        name: "Casa Quieta Jewelry",
        subtitle: "Roma Norte",
        price: "Desde $450 MXN",
        img: "",
        badge: "Diseño local",
        type: "Accesorios"
      },
      {
        id: "b15",
        name: "Naked Boutique",
        subtitle: "Condesa",
        price: "Desde $400 MXN",
        img: "",
        badge: "Accesorios",
        type: "Accesorios"
      },
      {
        id: "b16",
        name: "Tianguis del Chopo",
        subtitle: "Guerrero",
        price: "Entrada libre",
        img: "",
        badge: "Alternativo",
        type: "Otros"
      },
      {
        id: "b17",
        name: "La Lagunilla",
        subtitle: "Centro",
        price: "Entrada libre",
        img: "",
        badge: "Antigüedades y más",
        type: "Otros"
      },
      {
        id: "b18",
        name: "Mercado de Pulgas",
        subtitle: "Lagunilla",
        price: "Entrada libre",
        img: "",
        badge: "Variedad",
        type: "Otros"
      }
    ],

    experiencias: [
      {
        id: "e1",
        name: "Museo Nacional de Antropología",
        subtitle: "Chapultepec",
        price: "$95 MXN",
        img: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?q=80&w=1200",
        badge: "Imperdible",
        category: "Culturales"
      },
      {
        id: "e2",
        name: "Museo Frida Kahlo",
        subtitle: "Coyoacán",
        price: "$250 MXN",
        img: "ps://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?q=80&w=1200",
        badge: "Muy solicitado",
        category: "Culturales"
      },
      {
        id: "e3",
        name: "Palacio de Bellas Artes",
        subtitle: "Centro",
        price: "Desde $90 MXN",
        img: "https://images.unsplash.com/photo-1583445095369-9c651e7c6b85?q=80&w=1200",
        badge: "Ícono de la ciudad",
        category: "Culturales"
      },
      {
        id: "e4",
        name: "Museo Soumaya",
        subtitle: "Polanco",
        price: "Entrada libre",
        img: "https://images.unsplash.com/photo-1590845947698-8924d7409b56?q=80&w=1200",
        badge: "Entrada libre",
        category: "Culturales"
      },
      {
        id: "e5",
        name: "Patrick Miller",
        subtitle: "Centro",
        price: "$100 MXN",
        img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?q=80&w=1200",
        badge: "Vida nocturna",
        category: "Vida nocturna"
      },
      {
        id: "e6",
        name: "Departamento",
        subtitle: "Roma Norte",
        price: "$150 MXN",
        img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200",
        badge: "Muy concurrido",
        category: "Vida nocturna"
      },
      {
        id: "e7",
        name: "Supra Rooftop",
        subtitle: "Reforma",
        price: "$200 MXN consumo",
        img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200",
        badge: "Vista destacada",
        category: "Vida nocturna"
      },
      {
        id: "e8",
        name: "Tokyo Music Bar",
        subtitle: "Juárez",
        price: "Desde $300 MXN",
        img: "https://images.unsplash.com/photo-1514361892635-e955c1bba41b?q=80&w=1200",
        badge: "Concepto único",
        category: "Vida nocturna"
      },
      {
        id: "e9",
        name: "Bosque de Chapultepec",
        subtitle: "Chapultepec",
        price: "Entrada libre",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200",
        badge: "Naturaleza",
        category: "Naturaleza"
      },
      {
        id: "e10",
        name: "Desierto de los Leones",
        subtitle: "Álvaro Obregón",
        price: "$30 MXN",
        img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200",
        badge: "Escapada",
        category: "Naturaleza"
      },
      {
        id: "e11",
        name: "Xochimilco",
        subtitle: "Xochimilco",
        price: "Desde $200 MXN",
        img: "https://images.unsplash.com/photo-1580327332925-a10e6cb11baa?q=80&w=1200",
        badge: "Clásico de la ciudad",
        category: "Naturaleza"
      },
      {
        id: "e12",
        name: "Viveros de Coyoacán",
        subtitle: "Coyoacán",
        price: "Entrada libre",
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200",
        badge: "Al aire libre",
        category: "Naturaleza"
      },
      {
        id: "e13",
        name: "Museo Jumex",
        subtitle: "Polanco",
        price: "$120 MXN",
        img: "",
        badge: "Arte contemporáneo",
        category: "Arte y creatividad"
      },
      {
        id: "e14",
        name: "Museo Tamayo",
        subtitle: "Chapultepec",
        price: "$90 MXN",
        img: "",
        badge: "Arte",
        category: "Arte y creatividad"
      },
      {
        id: "e15",
        name: "Casa Estudio Luis Barragán",
        subtitle: "Tacubaya",
        price: "$300 MXN",
        img: "",
        badge: "Arquitectura",
        category: "Arte y creatividad"
      },
      {
        id: "e16",
        name: "Taller de cerámica",
        subtitle: "Roma Norte",
        price: "Desde $450 MXN",
        img: "",
        badge: "Actividad creativa",
        category: "Arte y creatividad"
      },
      {
        id: "e17",
        name: "Templo Mayor",
        subtitle: "Centro",
        price: "$95 MXN",
        img: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?q=80&w=1200",
        badge: "Historia viva",
        category: "Historia"
      },
      {
        id: "e18",
        name: "Castillo de Chapultepec",
        subtitle: "Chapultepec",
        price: "$100 MXN",
        img: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?q=80&w=1200",
        badge: "Imperdible",
        category: "Historia"
      },
      {
        id: "e19",
        name: "Centro Histórico guiado",
        subtitle: "Centro",
        price: "Desde $180 MXN",
        img: "",
        badge: "Recorrido",
        category: "Historia"
      },
      {
        id: "e20",
        name: "Museo del Templo Mayor nocturno",
        subtitle: "Centro",
        price: "Varía",
        img: "",
        badge: "Especial",
        category: "Historia"
      },
      {
        id: "e21",
        name: "Mercado de la Ciudadela",
        subtitle: "Centro",
        price: "Entrada libre",
        img: "",
        badge: "Compras locales",
        category: "Compras y mercados"
      },
      {
        id: "e22",
        name: "Mercado de San Juan",
        subtitle: "Centro",
        price: "Entrada libre",
        img: "",
        badge: "Gourmet",
        category: "Compras y mercados"
      },
      {
        id: "e23",
        name: "Tianguis del Chopo",
        subtitle: "Guerrero",
        price: "Entrada libre",
        img: "",
        badge: "Alternativo",
        category: "Compras y mercados"
      },
      {
        id: "e24",
        name: "La Lagunilla",
        subtitle: "Centro",
        price: "Entrada libre",
        img: "",
        badge: "Antigüedades",
        category: "Compras y mercados"
      },
      {
        id: "e25",
        name: "Auditorio Nacional",
        subtitle: "Polanco",
        price: "Varía por evento",
        img: "",
        badge: "Eventos top",
        category: "Eventos"
      },
      {
        id: "e26",
        name: "Foro Sol",
        subtitle: "Iztacalco",
        price: "Varía por evento",
        img: "",
        badge: "Masivo",
        category: "Eventos"
      },
      {
        id: "e27",
        name: "Arena Ciudad de México",
        subtitle: "Azcapotzalco",
        price: "Varía por evento",
        img: "",
        badge: "Conciertos y shows",
        category: "Eventos"
      },
      {
        id: "e28",
        name: "Pepsi Center",
        subtitle: "Nápoles",
        price: "Varía por evento",
        img: "",
        badge: "Mediano formato",
        category: "Eventos"
      },
      {
        id: "e29",
        name: "Away Spa W Mexico City",
        subtitle: "Polanco",
        price: "Desde $800 MXN",
        img: "",
        badge: "Relax",
        category: "Bienestar"
      },
      {
        id: "e30",
        name: "Banyan Tree Spa",
        subtitle: "Reforma",
        price: "Desde $1,200 MXN",
        img: "",
        badge: "Premium",
        category: "Bienestar"
      },
      {
        id: "e31",
        name: "Yoga en parques CDMX",
        subtitle: "Varios puntos",
        price: "Libre / $50 MXN",
        img: "",
        badge: "Al aire libre",
        category: "Bienestar"
      },
      {
        id: "e32",
        name: "Temazcal urbano",
        subtitle: "Sur de la ciudad",
        price: "Desde $350 MXN",
        img: "",
        badge: "Experiencia distinta",
        category: "Bienestar"
      },
      {
        id: "e33",
        name: "Six Flags México",
        subtitle: "Tlalpan",
        price: "Desde $649 MXN",
        img: "",
        badge: "Aventura",
        category: "Deportes y aventura"
      },
      {
        id: "e34",
        name: "K1 Speed",
        subtitle: "Pedregal",
        price: "Desde $230 MXN",
        img: "",
        badge: "Karting",
        category: "Deportes y aventura"
      },
      {
        id: "e35",
        name: "Paseo en bici en Reforma",
        subtitle: "Reforma",
        price: "Desde $50 MXN",
        img: "",
        badge: "Domingo clásico",
        category: "Deportes y aventura"
      },
      {
        id: "e36",
        name: "Escalada indoor",
        subtitle: "Benito Juárez",
        price: "Desde $200 MXN",
        img: "",
        badge: "Activo",
        category: "Deportes y aventura"
      }
    ]
  }
};