<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar 
```
docker compose -f docker-compose2.yml up --build
```
La primera vez utilizar la bandera '--build'

3. Para detener la ejecución
```
docker compose -f docker-compose2.yml down
```

4. Reconstruir la base de dato de la semilla
```
http://localhost:9000/api/v2/seed
```

5. Clonar el archivo ```.env.template``` y renombrar la copia a __```.env```__

6. Llenar las variables de entorno definidas en el ```.env```

7. Ejecutar la aplicación en dev:
```
yarn start:dev
```

# Ejecutar en producción
1. Crear el archivo ```.env```
2. Llenar las variables de entorno de producción
3. Crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
4. Luego de la primera vez, se puede levantar con el siguiente comando
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up
```


## Stack usado
* MongoDB
* Nest
