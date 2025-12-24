# Date Roulette

Українська веб-апка для пар і друзів з красивими рулетками та колесом фортуни.

## Стек

- Next.js 14+ (App Router, TypeScript)
- TailwindCSS + shadcn/ui
- Supabase Auth (Google OAuth + Email/Password)
- Supabase Postgres (SQL migrations)
- zod, framer-motion, react-custom-roulette

## Запуск локально

1) Встановити залежності:
```bash
npm i
```

2) Створити `.env` на основі `.env.example` та додати ключі Supabase
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`).

3) Залінкувати Supabase та застосувати SQL міграції:
```bash
supabase link --project-ref <PROJECT_REF>
supabase db push
```

4) Запустити dev сервер:
```bash
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000).

## Ролі

- `user` — може крутити рулетки, створювати власні, пропонувати поля для готових.
- `admin` — підтверджує пропозиції та додає поля до prebuilt рулеток.

Роль зберігається у таблиці `User` (поле `role`). Для адміна потрібно
вручну виставити `admin` у базі.

## Supabase Auth

- OAuth redirect: `/auth/callback`
- Після входу користувач автоматично створюється у таблиці `User`.

## Основні маршрути

- `/` — головна grid сторінка
- `/roulettes` — каталог
- `/roulette/[id]` — сторінка рулетки
- `/create` — створення кастомної рулетки
- `/admin` — адмін панель
- `/sign-in`, `/sign-up` — авторизація

## Дані

SQL міграції знаходяться в `supabase/migrations`. Вони створюють таблиці та
стартові prebuilt рулетки.
