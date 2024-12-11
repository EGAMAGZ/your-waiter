# YourWaiter

**URL de documentacion de proyecto**:
[Documentacion](https://drive.google.com/drive/folders/12dpj1jh5kyHUQhxRBsrNWq9WsIfvrNBw)

**URL de proyecto (Produccion)**:
[your-waiter.deno.dev](https://your-waiter.deno.dev)

## Servicios utilizados para el proyecto

- Servidio de Hosting (donde esta desplegado el proyecto a producción): Deno Deploy
- El servicio de base de datos en la nube utilizado: Supabase
- Sistema Manejador de Base de Datos (que el utiliza el servicio de base de datos en la nube): PostgresSQL

## Tecnologías utilizadas para el desarrollo del proyecto

- Astro (Framework con el que fue desarrollado)
- Typescript (Lenguaje de programacion usado)
- Preact (Libreria usada para hacer la interfaz de usuario)
- [Nodejs](https://nodejs.org/en/download/package-manager) (Instalar 22.8.X o superior)

## Instalación de proyecto (para desarrollo en local)
>[!Important]
> Se requiere instalar las siguientes herramientas antes de proceder:
> - [Nodejs](https://nodejs.org/en/download/package-manager) en su versión 22.8.X o superior
> - [Git](https://git-scm.com/)

1. En carpeta raiz del projecto, ejecutar el siguiente comando para instalar
   paqueterias y dependencias:

```bash
$ npm install --force
```

2. Crear archivo `.env` con las credenciales necesarias, extraidas de Supabase:

```text
SUPABASE_URL=<api key>
SUPABASE_ANON_KEY=<api key>
PROJECT_REF=<id de proyecto>
```

3. Ejecutar proyecto de manera local

```bash
$ npm run dev
```

o tambien

```bash
$ node --run dev
```
>[!IMPORTANT]
> Al estar la base de de datos en la nube (Supabase), en todo momento se requerirá conexión a internet al estar ejecutandose en local

## Estructura del proyecto

Dentro del proyecto, se encuentra la siguiente estructura de proyectos y
archivos

```text
/
├── public/
├── src/
│   └── components/
│   └── layout/
│   └── lib/
│   └── pages/
│   │   └── api/
│   │   └── index.astro
│   └── schema/
│   └── util/
│   └── env.d.ts
│   └── middleware.ts
└── package.json
```

- La carpeta `public` se encuentran los archivos estaticos (imagenes, iconos,
  audios, etc.) para ser utilizados en el proyecto como el favicon
- La carpeta `components` se encuentran componentes (bloques del proyecto) que
  seran reutilizados en el proyecto. Se encuentra subdividido en carpetas para
  agrupar conforme conforme a Caso de Uso o funcionalidad. Pueden ser escritos
  en Astro o Preact
- La carpeta `layout` se encuentran los layouts que se usaran para la paginas,
  es decir, la base o disposición de la pagína
- La carpeta `lib` se encuentra la implementación del cliente de Supabase, que
  sera utilizado en todo el proyecto
- La carpeta `pages` se encuentran todos los archivos, con terminación `.astro`,
  que automaticamente seran convertidas a URL. Dentro de esta carpeta se
  encuentra una subcarpeta, `api`, que contiene las rutas de la API del proyecto
  que son requeridas
- La carpeta `schema` se encuentran Schemas para validaciones usando Zod y tipos
  de datos generados a partir de mismos Schemas o creados manualmente.
- La carpeta `util` se encuentran funciones, metodos, clases que no pertenecen a
  lo nada de lo anterios y que son reutilizables
- El archivo `middleware.ts`se encarga de controlar el acceso la navegación y
  llamadas a API del proyecto, y obtener información del perfil actual para ser
  accesible a la misma en cualquier parte del proyecto
