// Proxy de desarrollo: ng serve (:4200) reenvía /api a la API ASP.NET Core (:5190). Mismo origen, sin CORS.
module.exports = [
  {
    context: ['/api/**'],
    target: 'http://localhost:5190',
    secure: false,
  },
];
