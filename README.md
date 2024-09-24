# YourWaiter 

**URL de proyecto**:

[your-waiter.deno.dev](your-waiter.deno.dev)

## Servicios
- Hosting: Deno Deploy
- DBaaS (Base de datos como Servicio): Supabase
- DBMS (Sistema Manejador de Base de Datos): PostgresSQL

## Tecnologías
- Astro
- Typescript
- Preact
- Nodejs (22.8.X)
## Instalación (para desarrollo)
1. En carpeta raiz del projecto, ejecutar el siguiente comando para instalar paqueterias y dependencias:
```bash
$ npm install --force
```

2. Crear archivo `.env` con las credenciales necesarias, extraidas de Supabase:
```text
SUPABASE_URL=<api key>
SUPABASE_ANON_KEY=<api key>
PROJECT_REF=<id de proyecto>
```
3. Ejecutar proyecto
```bash
$ npm run dev
```

o tambien
```bash
$ node --run dev
```

## Estructura del proyecto

Dentro del proyecto, se encuentra la siguiente estructura de proyectos y archivos

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
- La carpeta `public` se encuentran los archivos estaticos (imagenes, iconos, audios, etc.) para ser utilizados en el proyecto como el favicon
- La carpeta `components` se encuentran componentes (bloques del proyecto) que seran reutilizados en el proyecto. Se encuentra subdividido en carpetas para agrupar conforme conforme a Caso de Uso o funcionalidad. Pueden ser escritos en Astro o Preact
- La carpeta `layout` se encuentran los layouts que se usaran para la paginas, es decir, la base o disposición de la pagína
- La carpeta `lib` se encuentra la implementación del cliente de Supabase, que sera utilizado en todo el proyecto
- La carpeta `pages` se encuentran todos los archivos, con terminación `.astro`, que automaticamente seran convertidas a URL. Dentro de esta carpeta se encuentra una subcarpeta, `api`, que contiene las rutas de la API del proyecto que son requeridas
- La carpeta `schema` se encuentran Schemas para validaciones usando Zod y tipos de datos generados a partir de mismos Schemas o creados manualmente.
- La carpeta `util` se encuentran funciones, metodos, clases que no pertenecen a lo nada de lo anterios y que son reutilizables
- El archivo `middleware.ts`se encarga de controlar el acceso la navegación y llamadas a API del proyecto, y obtener información del perfil actual para ser accesible a la misma en cualquier parte del proyecto
