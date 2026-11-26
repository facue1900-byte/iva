# Cargador de facturas

Pantalla para mandar fotos o PDFs de cualquier comprobante argentino (facturas A,
B o C, tickets, recibos, liquidaciones) y que el IVA y el gasto queden anotados
solos en una planilla, con una vista del IVA al día, por año y por mes.

Es **sólo el frente**: no tiene datos, ni credenciales, ni sabe de quién es la
planilla que va a escribir. La dirección del backend y la llave llegan en el
hash del link (`#api=...&token=...`) y quedan guardadas en el teléfono.

## Por qué está separado en su propio repo

Vive acá porque GitHub Pages necesita un repo público, y este código no tiene
por qué decir de quién es la planilla que atiende: el nombre de la empresa lo
trae el backend al abrir. Todo lo que identifica a un negocio —CUIT, planilla,
token, facturas— vive del otro lado.

## Qué hace

- saca la foto y la manda a leer
- **si no hay señal, la guarda en el teléfono** (IndexedDB) y la sube sola
  cuando vuelve; una foto no se borra de la cola hasta que el servidor confirmó
  que la guardó
- muestra lo que se leyó **para que una persona lo confirme** antes de que entre
  a ningún cálculo
- se instala en el celular y abre sin señal (service worker)

El backend es un Google Apps Script: transcribe con Gemini y verifica la
aritmética en código, nunca al revés.
