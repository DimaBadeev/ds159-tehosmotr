# Диагностическая станция № 159

Сайт станции государственного технического осмотра в Минске: публичные страницы, онлайн-запись со слотами в базе данных и панель администратора.

**Станция:** Диагностическая станция № 159 УПТЦ МГУ МЧС РБ  
**Адрес:** 220088, г. Минск, ул. Антоновская, 9  
**Телефон:** +375 17 375-90-75

## Стек

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM + PostgreSQL (на Render; локально — Docker Compose)
- NextAuth.js (Credentials) + bcrypt
- Zod + React Hook Form
- Framer Motion, react-hot-toast

## Быстрый старт

Нужен PostgreSQL (на Render он создаётся автоматически, локально — через Docker):

```bash
docker compose up -d
copy .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### Вход в админку

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email: `admin@ds159.by`
- Пароль: `Admin159!`

После первого входа смените пароль (через повторный seed с новым хешем или обновление записи `Admin` в базе).

## Деплой на Render

Render не принимает папку с компьютера напрямую. Нужен репозиторий на GitHub (или GitLab), затем Web Service + PostgreSQL.

### 1. Залить код на GitHub

1. Установите [Git](https://git-scm.com/download/win) или [GitHub Desktop](https://desktop.github.com/).
2. На [github.com/new](https://github.com/new) создайте репозиторий, например `ds159-tehosmotr` (можно Private).
3. Загрузите проект **без** папок `node_modules`, `.next` и файла `.env`.

Через GitHub Desktop: File → Add local repository → выберите `ds159-tehosmotr` → Publish.

Через терминал (после установки Git):

```bash
cd C:\Users\Dom1\OneDrive\Documents\ds159-tehosmotr
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/ds159-tehosmotr.git
git push -u origin main
```

### 2. Создать базу PostgreSQL

1. Откройте [dashboard.render.com](https://dashboard.render.com/).
2. **New** → **PostgreSQL**.
3. Name: `ds159-db`, Region: `Frankfurt` (ближе к Минску).
4. Plan: **Free**, если доступен, иначе **Starter**.
5. Create Database и дождитесь статуса **Available**.
6. Скопируйте **Internal Database URL** (для сервиса на Render) и при необходимости **External Database URL** (только если seed будете гонять с компьютера).

### 3. Создать Web Service

1. **New** → **Web Service** → подключите GitHub и выберите репозиторий.
2. Заполните:

| Поле | Значение |
| --- | --- |
| Language | Node |
| Branch | `main` |
| Region | Frankfurt (тот же, что у базы) |
| Build Command | `npm ci && npx prisma generate && npm run build` |
| Pre-Deploy Command | `npx prisma migrate deploy` (в Advanced) |
| Start Command | `npm start` (создаёт таблицы и при пустой базе делает seed) |
| Instance type | Free |

3. В **Environment** добавьте:

| Ключ | Значение |
| --- | --- |
| `DATABASE_URL` | Internal Database URL из Postgres |
| `NEXTAUTH_SECRET` | случайная строка от 32 символов (Generate) |
| `NEXTAUTH_URL` | `https://ИМЯ-СЕРВИСА.onrender.com` — подставите после первого деплоя, если URL ещё неизвестен |
| `NODE_VERSION` | `20` |

4. Create Web Service. Дождитесь конца сборки (5–10 минут).

5. Когда появится URL вида `https://ds159-tehosmotr.onrender.com`, пропишите его в `NEXTAUTH_URL` и сохраните (пойдёт новый деплой).

### 4. Заполнить базу (админ и цены)

В карточке Web Service: **Shell** (или **Manual Deploy** не нужен) и выполните:

```bash
node prisma/seed.js
```

После этого:

- сайт: `https://ВАШ-СЕРВИС.onrender.com`
- админка: `https://ВАШ-СЕРВИС.onrender.com/admin/login`
- логин: `admin@ds159.by` / `Admin159!` — сразу смените пароль

Free-инстанс Render засыпает без трафика: первый заход после паузы может занять 30–50 секунд.

### Альтернатива: Blueprint

Если репозиторий уже на GitHub: **New** → **Blueprint** → выберите репо. Подхватится `render.yaml`. Останется вручную задать `NEXTAUTH_URL` и один раз запустить seed в Shell.

## Переменные окружения

См. `.env.example`:

| Переменная | Назначение |
| --- | --- |
| `DATABASE_URL` | PostgreSQL. Локально: `postgresql://ds159:ds159@localhost:5432/ds159?schema=public` |
| `NEXTAUTH_SECRET` | Секрет сессии администратора |
| `NEXTAUTH_URL` | Публичный URL сайта (`http://localhost:3000` или `https://….onrender.com`) |

## Скрипты

- `npm run dev` — локальная разработка
- `npm run build` / `npm start` — продакшен-сборка
- `npm run db:migrate` — миграции Prisma
- `npm run db:seed` — администратор, цены и график работы (тестовые записи не создаются)
- `npm run db:studio` — GUI базы данных

## Что умеет сайт

**Публичная часть**

- Главная: о станции, преимущества, галерея, цены, документы, оплата, карта, онлайн-запись
- Пошаговая запись с календарём и слотами (выходные, обед, занятые слоты недоступны)
- Блокировка времени в таблице `TimeSlotLock`, чтобы два клиента не заняли один слот
- Страницы услуг, документов и контактов с формой обратной связи

**Админка `/admin`**

- Дашборд: записи сегодня / за неделю, свободные слоты
- Таблица записей, фильтры, смена статуса, ручное добавление, редактирование, удаление
- Расписание: часы по дням недели, обед, длительность слота, доп. выходные
- Редактирование цен без правки кода

## Замена фотографий

Файлы-заглушки лежат в `public/gallery/station-1.svg` … `station-5.svg`. Замените их на JPEG/WebP с теми же именами или поправьте список в `src/lib/constants.ts`.

## Структура

```
src/app              публичные страницы, /admin и API
src/components       UI, хедер, форма записи, админка
src/lib              prisma, auth, слоты, валидация
prisma               схема, миграции, seed
```
