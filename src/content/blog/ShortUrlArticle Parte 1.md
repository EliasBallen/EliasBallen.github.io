---
title: "ShortURL con AWS parte 1"
description: "Te explico como pude crear una ShortURl usando AWS desde cero paso a paso de principio a fin"
pubDate: "March 12 2024"
heroImage: "/blogs_articles/Short url in Aws/shortUrlAws.webp"
badge: "AWS"
tags: ["AWS","DynamoDB","NodeJs"]
---
# ShortUrl en AWS Parte 1

El generador

En primer lugar voy a utilizar esta arquitectura. si estamos en la parte de servidor es importante que cuando recibimos la URL la validemos para que sea apropiada segun nuestros estandares. esto lo revisaremos en otra parte cuando entremos a las funciones lambda, por ahora asumiremos que todas las URLs que nos entregaran a nuestra función generadora seran válidas.

![arquitectura de la aplicacion](/blogs_articles/Short%20url%20in%20Aws/architechture.png)

Recurso usado de [Medium](https://medium.com/@sureshpodeti/system-design-url-shortener-d5d2e094a729 "System Design: Url Shortener")

Nuestra funcion generadora es la siguente.

```jsx
function generateShortURL(longURL){
    const decodedURL = decodeURI(longURL) //decode if not utf8
    const appendedURL = addseq(decodedURL) //** append a seq number to not be predictable
    const md5hash = hashTextToInt(appendedURL) //** md5 hash the text, returns hex
    const base62encodedInt = base62encoder(md5hash) //** encode in base62 return 22characters string
    const picked7randletters = randompick7(base62encodedInt) //** select 7 random characters from the string to create the url
    return picked7randletters
}
```

Podemos  ver que seguimos la secuencia para generar la url corta segun lo que tenemos en la arquitectura cada paso de la arquitectura tiene su funcion asociada, se hizo asi para hacer mas facil entender como funciona. salvo por la primera funcion las demas tendremos que crearlas pero al dividir la tarea sera mas sencillo si sabemos que es lo que nos estan pasando.

A continuación, desglosaremos cada una de estas funciones para entender mejor cómo trabajan en conjunto para generar la URL corta. Cada función cumple un propósito específico en el proceso y es vital para garantizar que las URL cortas generadas sean únicas y seguras.

## Desglosando las funciones

1. **convertToUTF8 —> decodeURI(longURL)**: Esta función se encarga de decodificar la URL si está en formato utf8. Esto es esencial para asegurar que todos los caracteres especiales sean interpretados correctamente. esta funcion ya esta en Javascript
2. **append a sec. no. —> addseq(decodedURL)**: Esta función agrega un número de secuencia a la URL decodificada para evitar que sea predecible. Esto es importante para añadir una capa extra de seguridad.
3. **md5 Hash —> hashTextToInt(appendedURL)**: Esta función realiza un hash md5 al texto, devolviendo un valor INT. El hash md5 es una forma común de generar un valor único a partir de un texto.
4. **base 62 encoding —> base62encoder(md5hash)**: Esta función codifica el hash md5 en base62, devolviendo una cadena de 22 caracteres [0-9a-zA-Z]. La codificación en base62 es útil para reducir la longitud de la URL.
5. **randompick 7 characters —> randompick7(base62encodedInt)**: Esta función selecciona 7 caracteres aleatorios de la cadena de 22 caracteres para crear la URL. Al seleccionar caracteres al azar, garantizamos que nuestras URL cortas sean únicas.

Cada una de estas funciones cumple un papel fundamental en el proceso de generación de la URL corta. Al combinarlas, podemos asegurar que nuestras URL cortas son no solo únicas, sino también seguras y fiables.

**decodeURI(longURL)**:

Esta funcion decodificara la URL a formato utf8 si no lo esta, si no esta en formato utf8 no lo modifica. 

cuando una URL ha sido codificada usando **encodeURI(url)** ciertos caracteres especiales se cambian por otros caracteres para mostrar un simbolo que existen. no queremos eso ya que si alguien sube una URL sin codificar y luego codificada, podriamos generar 2 shortUrl para una misma URL lo cual no queremos.

```jsx
Encoded URI:
my%20test.asp?name=st%C3%A5le&car=saab
Decoded URI:
my test.asp?name=ståle&car=saab
```

**addseq(decodedURL)**

```jsx
let seqadd = 1
function addseq(str){
    seqadd++;
    return str+''+seqadd;
}
module.exports = {addseq}
```

Esta función sencillamente agrega un valor secuencial a la URL para cuando ocurra el hashing no haya forma de saber que valor saldrá despues. esto permite que el algoritmo sea mas seguro, podría utilizarse números aleatorios, u otro generador de secuencias aleatorias en este paso. 

**hashTextToInt(appendedURL)**

```jsx
const { createHash } = require('node:crypto');
function hashText(content, algo = 'md5') {
  const hashFunc = createHash(algo);   // you can also sha256, sha512 etc
  hashFunc.update(content);
  return hashFunc.digest('hex');       // will return hash, formatted to HEX
}
function hashTextToInt(content, algo = 'md5'){
    const hextext = hashText(content) //128bits  hex value 
    return parseInt(hextext,16)   //transform to int
}

module.exports = {hashText,hashTextToInt}
```

La función hashText utiliza el metodo createHash incluyendo el algoritmo, para obtener un valor toma una cadena de texto y la convertira en un valor hexadecimal (por defecto es en binario.)

esto no es lo que queremos ya que quisieramos que fuera un entero para luego poder pasarlo a base 62. se podria hacer directamente desde binario pero es mas complejo que solo hacer  `parseInt(hextext,16)`

**base62encoder(md5hash)**

```jsx
//Base 62 encoding
const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
.split('')

function base62encoder(integer){   
    if (integer === 0) {
        return 0;
      }
      let s = [];
      while (integer > 0) {
        s = [charset[integer % 62], ...s];
        integer = Math.floor(integer / 62);
      }
      return s.join('');
}
function base62decode(chars){
    return chars.split('').reverse().reduce((prev, curr, i) =>
    prev + (charset.indexOf(curr) * (62 ** i)), 0)
}

module.exports = {base62decode,base62encoder}
```
Esta función transforma el número entero que puede ser muy grande en caracteres [0-9a-zA-Z] esta en base 62 porque no incluimos todos los caracteres del alfabeto. lo unico que hace la función es entrar en un ciclo de division para 62 del valor que le pasamos y usando el residuo sacamos nuestro caracter, luego lo junta todo en una cadena de texto, esta cadena es de 22 caracteres. no queremos usar 22 caracteres para un acortador de links porque no tendria sentido reemplazar una URL larga por OTRA URL larga por eso usamos la siguiente función.

**randompick7(base62encodedInt)**

```jsx
function randompick7(linestring){
    let pickedindex = []
    let randomgenString = ""
    const lengthstring = linestring.length   
    while(pickedindex.length < 7){
        let picked = Math.floor(Math.random()*lengthstring)
        if(pickedindex.includes(picked)){continue}
        pickedindex.push(picked)
        randomgenString += ''+linestring[picked]
    }
    return randomgenString
}
module.exports = {randompick7}

```
Esta función simplemente retornalos 7 caracteres escogidos aleatoriamente de los 22, quize evitar que el mismo caracter de la cadena fuera escogido varias veces, pero no es necesario hacerlo asi.

Gracias por Leer este Blog.
