require("dotenv").config();

// console.log(process.env.PRISMIC_ENDPOINT, process.env.PRISMIC_CLIENT_ID);

const fetch = require('node-fetch');
const express = require('express');
const path = require('path');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const logger = require('morgan');
const methodOverride = require('method-override');

const app = express();
const port = 8005;

const Prismic = require('@prismicio/client');
const PrismicH = require('@prismicio/helpers');
const { application } = require('express');
const UAParser = require('ua-parser-js');

app.use(logger('dev')); // Log requests to the console
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings
app.use(errorHandler()); 
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// // Initialize the prismic.io api
// const initApi = (req) => {
//   return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
//     accessToken: process.env.PRISMIC_ACCESS_TOKEN,
//     req,
//     fetch,
//   });
// };

// // Link Resolver
// const handleLinkResolver = (doc) => {
//   if (doc.type === "product") {
//     return `/detail/${doc.slug}`;
//   }

//   if (doc.type === "collections") {
//     return "/collections";
//   }

//   if (doc.type === "about") {
//     return `/about`;
//   }

//   // Default to homepage
//   return "/";
// };

// // app.use(errorHandler());

// // Middleware to inject prismic context
// app.use((req, res, next) => {
//   const ua = UAParser(req.headers["user-agent"]);

//   res.locals.isDesktop = ua.device.type === undefined;
//   res.locals.isPhone = ua.device.type === "mobile";
//   res.locals.isTablet = ua.device.type === "tablet";

//   res.locals.Link = handleLinkResolver;
//   res.locals.PrismicH = PrismicH;
//   res.locals.Numbers = (index) => {
//     return index === 0
//       ? "One"
//       : index === 1
//       ? "Two"
//       : index === 2
//       ? "Three"
//       : index === 3
//       ? "Four"
//       : "";
//   };

//   next();
// });

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "pug");
// app.locals.basedir = app.get("views");

// const handleRequest = async (api) => {
//   const meta = await api.getSingle("meta"); 
//   const navigation = await api.getSingle("navigation");
//   const preloader = await api.getSingle("preloader");

//   return {

//     meta,
//     navigation,
//     preloader,
//   };
// };

// app.get("/", async (req, res) => {
//   const api = await initApi(req);
//   const home = await api.getSingle("home"); 
//   const defaults = await handleRequest(api);

//   const { results: collections }= await api.query(
//     Prismic.Predicates.at("document.type", "collection"),
//     {
//       fetchLinks: "product.image",
//     }
//   );

//   res.render("pages/home", {
//     ...defaults,
//     collections,
//     home,
//   });
// });

// app.get("/about", async (req, res) => { 
//     const api = await initApi(req); 
//     const defaults = await handleRequest(api);
//     const about = await api.getSingle("about"); 
    
//     res.render("pages/about", {
//       ...defaults, // spread operator not necessary
//       about,
//     });
// });

// app.get("/collections", async (req, res) => {
//   const api = await initApi(req);
//   const defaults = await handleRequest(api);
//   const home = await api.getSingle("home");

//   const { results: collections }= await api.query(
//     Prismic.Predicates.at("document.type", "collection"),
//     {
//       fetchLinks: "product.image",
//     }
//   );

//   collections.forEach(collection => {
//     console.log(collection.data.products[0].products_product);
//   });

//   console.log(home);
//   console.log(collections);

//   res.render("pages/collections", {
//     ...defaults,
//     collections,
//     home,
//   });
// });


// app.get("/detail/:uid", async (req, res) => {
//   const api = await initApi(req);
//   const defaults = await handleRequest(api);
//   const product = await api.getByUID("product", req.params.uid, {
//     fetchLinks: "collection.title",
//   });

//   res.render("pages/detail", {
//     ...defaults,
//     product,
//   });
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });


///////////////////////////////////////////////////////////////////

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch,
  })
};

// Link Resolver, set http address directions
const HandleLinkResolver = (doc) => {
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`
  }
  if (doc.type === 'collections' || doc === 'collections') {
    //collections_names
    return '/collections'
  }
  if (doc.type === 'about') {
    return `/about`
  }
  // Default to homepage
  return '/'
};

// Middleware to inject prismic context
app.use((req, res, next) => {
  // mobile end
  const ua = UAParser(req.headers['user-agent'])
  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'

  // body class
  res.locals.Link = HandleLinkResolver
  res.locals.PrismicH = PrismicH
  res.locals.Numbers = (index) => {
    return index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : index === 3 ? 'Four' : ''
  }

  //console.log(res.locals.Link);

  next()
});

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.locals.basedir = app.get('views')

const handleRequest = async (api) => {
  const [meta, preloader, navigation, home, about, { results: collections }] = await Promise.all([
    api.getSingle('meta'),
    api.getSingle('preloader'),
    api.getSingle('navigation'),
    api.getSingle('home'),
    api.getSingle('about'),
    api.query(Prismic.predicate.at('document.type', 'collection'), {
      fetchLinks: 'product.image',
    }),
  ])
  // console.log(home.data.collection, Link(home.data.collection));

  // collections.forEach((collection) => {
  //   console.log(collection);
  //   collection.data.products.forEach((item) => {
  //     console.log(item);
  //   });
  // });

  // all images needed to be preloaded before the pages appear
  const assets = []

  // home page images
  home.data.gallery.forEach((item) => {
    assets.push(item.image.url)
  })
  // about page images
  about.data.gallery.forEach((item) => {
    assets.push(item.image.url)
  })
  about.data.body.forEach((section) => {
    if (section.slice_type === 'gallery') {
      section.items.forEach((item) => {
        assets.push(item.image.url)
      })
    }
  })
  // collection page images
  collections.forEach((collection) => {
    collection.data.products.forEach((item) => {
      assets.push(item.products_product.data.image.url)
    })
  })

  return {
    assets,
    meta,
    home,
    collections,
    about,
    navigation,
    preloader,
  }
};

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  // console.log(defaults.collections[0].data.products[0].products_product.data.image.url);

  res.render('pages/home', {
    ...defaults,
  })
});

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('pages/about', {
    ...defaults,
  })
});

app.get('/collections', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  console.log(defaults.collections[0].data.products[0]);

  res.render('pages/collections', {
    ...defaults,
  })
});

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title',
  })

  res.render('pages/detail', {
    ...defaults,
    product,
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


// const handleRequest = async (api) => {
//   const about = await api.getSingle("about");
//   const home = await api.getSingle("home");
//   const meta = await api.getSingle("meta");
//   const navigation = await api.getSingle("navigation");
//   const preloader = await api.getSingle("preloader");

//   const { results: collections } = await api.query(
//     Prismic.Predicates.at("document.type", "collection"),
//     {
//       fetchLinks: "product.image",
//     }
//   );

//   const assets = [];

// home.data.gallery.forEach((item) => {
//   assets.push(item.image.url);
// });

// about.data.gallery.forEach((item) => {
//   assets.push(item.image.url);
// });

// about.data.body.forEach((section) => {
//   if (section.slice_type === "gallery") {
//     section.items.forEach((item) => {
//       assets.push(item.image.url);
//     });
//   }
// });

// collections.forEach((collection) => {
//   collection.data.products.forEach((item) => {
//     assets.push(item.products_product.data.image.url);
//   });
// });

//   return {
//     assets,
//     meta,
//     home,
//     collections,
//     about,
//     navigation,
//     preloader,
//   };
// };

///////////////////////////////////////////////////////////////////

// const handleRequest = async (api) => {
//   const [meta, home, about, { results: collections }] = await Promise.all([
//     api.getSingle("meta"),
//     api.getSingle("preloader"),
//     api.getSingle("navigation"),
//     api.getSingle("home"),
//     api.getSingle("about"),
//     api.query(Prismic.predicate.at("document.type", "collection"), {
//       fetchLinks: "product.image",
//     }),
//   ]);

//   const assets = [];

  // home.data.gallery.forEach((item) => {
  //   assets.push(item.image.url);
  // });

  // about.data.gallery.forEach((item) => {
  //   assets.push(item.image.url);
  // });

  // about.data.body.forEach((section) => {
  //   if (section.slice_type === "gallery") {
  //     section.items.forEach((item) => {
  //       assets.push(item.image.url);
  //     });
  //   }
  // });

  // collections.forEach((collection) => {
  //   collection.data.products.forEach((item) => {
  //     assets.push(item.products_product.data.image.url);
  //   });
  // });

//   return {
//     assets,
//     meta,
//     home,
//     collections,
//     about,
//   };
// };