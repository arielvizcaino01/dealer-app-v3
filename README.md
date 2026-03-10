# Dealer Inventory Pro

Esta es una base **profesional pero amigable para principiantes** de tu app de inventario para vehículos de subasta.

## Qué trae esta versión

- Dashboard principal
- Inventario de vehículos
- Detalle completo por vehículo
- Gastos por categorías
- Profit estimado automático
- Importador de Copart en modo mock
- Prisma ORM
- Base local SQLite para aprender fácil
- Arquitectura pensada para escalar luego a PostgreSQL, autenticación y scraping real

## Importante

Esta versión está hecha para que **la puedas correr aunque no sepas programar todavía**.

Por eso, en desarrollo usa **SQLite**, que es mucho más simple.
La arquitectura ya quedó lista para luego pasar a **PostgreSQL** en producción sin rehacer todo.

---

## Paso 1: instalar programas

Necesitas instalar estos 2 programas:

### Node.js
Descarga la versión LTS desde:
https://nodejs.org

### Visual Studio Code
Descárgalo desde:
https://code.visualstudio.com

---

## Paso 2: abrir el proyecto

1. Descomprime el `.zip`
2. Abre la carpeta en VS Code
3. Abre la terminal dentro de VS Code

---

## Paso 3: instalar dependencias

En la terminal escribe:

```bash
npm install
```

---

## Paso 4: crear el archivo `.env`

Copia el archivo `.env.example` y crea uno nuevo llamado `.env`

Debe quedar así:

```env
DATABASE_URL="file:./dev.db"
```

---

## Paso 5: preparar base de datos

En la terminal corre esto:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

Eso hará 3 cosas:

1. Crear el cliente de Prisma
2. Crear la base local
3. Insertar un vehículo de ejemplo

---

## Paso 6: arrancar la app

En la terminal:

```bash
npm run dev
```

Luego abre en el navegador:

http://localhost:3000

---

## Cómo usarla

### Dashboard
Verás resumen de inventario, inversión y valor estimado.

### Importar vehículo
Ve a:

`/vehicles/new`

Pega un link o número de lote de Copart.

Por ahora el importador está en **modo mock**, o sea:
- sí crea el vehículo
- sí crea fotos
- sí llena datos automáticamente
- pero todavía no lee Copart real

Eso lo conectaremos más adelante en:

```ts
lib/copart.ts
```

### Agregar gastos
Entra a un vehículo y agrega:
- transporte
- piezas
- mano de obra
- taxes
- reparación
- otros

---

## Estructura del proyecto

```bash
app/
  page.tsx                     # dashboard
  vehicles/
    page.tsx                   # inventario
    new/page.tsx               # importar vehículo
    [id]/page.tsx              # detalle del vehículo
  api/
    vehicles/import/route.ts   # importar desde Copart mock
    vehicles/[id]/expenses/route.ts

components/
  app-shell.tsx
  expense-form.tsx
  import-form.tsx
  metric-card.tsx
  status-badge.tsx

lib/
  copart.ts                    # luego aquí metemos scraping real
  prisma.ts
  utils.ts

prisma/
  schema.prisma
  seed.ts
```

---

## Roadmap profesional

### Fase 1
- Dashboard
- Inventario
- Detalle
- Gastos
- Profit
- Importador mock

### Fase 2
- Scraping real de Copart con Playwright
- Subida de fotos propias antes/después
- Editar vehículo
- Cambiar estados

### Fase 3
- Login privado
- PostgreSQL
- Deploy online
- Cloudinary o S3 para imágenes
- Reportes PDF

### Fase 4
- Profit antes de comprar
- Fees automáticos de Copart
- Comparación con mercado
- Multi-fuente: IAAI, Cars.com, etc.

---

## Nota honesta

Para que tú puedas aprender y avanzar sin bloquearte, esta base usa la ruta más simple posible al inicio.

No es una app “de juguete”.
La estructura sí es profesional.
Lo único simplificado es el arranque:
- SQLite en vez de PostgreSQL
- importación mock en vez de scraping real

Eso fue hecho a propósito para que no te estrelles con demasiada complejidad desde el día 1.

---

## Próximo paso recomendado

Cuando la abras y corra bien, el siguiente paso será:

**conectar Copart real en `lib/copart.ts` usando Playwright**

Ahí es donde vamos a empezar a convertir esta base en tu sistema profesional completo.
