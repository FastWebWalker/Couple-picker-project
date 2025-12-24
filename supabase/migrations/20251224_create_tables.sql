create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  supabase_id uuid unique not null,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists roulettes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id) on delete set null,
  is_prebuilt boolean not null default false,
  title text not null,
  description text not null,
  icon text not null,
  created_at timestamptz not null default now(),
  unique (title, is_prebuilt)
);

create table if not exists options (
  id uuid primary key default gen_random_uuid(),
  roulette_id uuid not null references roulettes(id) on delete cascade,
  label text not null,
  weight integer,
  created_at timestamptz not null default now()
);

create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  roulette_id uuid not null references roulettes(id) on delete cascade,
  label text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists roulettes_owner_id_idx on roulettes(owner_id);
create index if not exists options_roulette_id_idx on options(roulette_id);
create index if not exists proposals_roulette_id_idx on proposals(roulette_id);

-- Seed prebuilt roulettes
insert into roulettes (title, description, icon, is_prebuilt)
values ('Куди йдемо', 'Локації для прогулянки чи зустрічі', '📍', true)
on conflict (title, is_prebuilt) do nothing;

insert into options (roulette_id, label)
select r.id, v.label
from roulettes r
join (values
  ('Кав''ярня з десертами'),
  ('Парк біля води'),
  ('Коворкінг-лаунж'),
  ('Виставка'),
  ('Ринок із фудкортом')
) as v(label) on true
where r.title = 'Куди йдемо' and r.is_prebuilt = true
and not exists (
  select 1 from options o where o.roulette_id = r.id and o.label = v.label
);

insert into roulettes (title, description, icon, is_prebuilt)
values ('Тип побачення', 'Обираємо формат вечора', '💌', true)
on conflict (title, is_prebuilt) do nothing;

insert into options (roulette_id, label)
select r.id, v.label
from roulettes r
join (values
  ('Тихий вечір удома'),
  ('Несподівана пригода'),
  ('Спільний майстер-клас'),
  ('Пікнік'),
  ('Нічний драйв')
) as v(label) on true
where r.title = 'Тип побачення' and r.is_prebuilt = true
and not exists (
  select 1 from options o where o.roulette_id = r.id and o.label = v.label
);

insert into roulettes (title, description, icon, is_prebuilt)
values ('Їжа', 'Що смакує сьогодні', '🍜', true)
on conflict (title, is_prebuilt) do nothing;

insert into options (roulette_id, label)
select r.id, v.label
from roulettes r
join (values
  ('Паста з соусом'),
  ('Суші/ролли'),
  ('Домашній бургер'),
  ('Салат і легкі закуски'),
  ('Десертний сет')
) as v(label) on true
where r.title = 'Їжа' and r.is_prebuilt = true
and not exists (
  select 1 from options o where o.roulette_id = r.id and o.label = v.label
);

insert into roulettes (title, description, icon, is_prebuilt)
values ('Хто готує', 'Справедливий вибір кухаря', '👩‍🍳', true)
on conflict (title, is_prebuilt) do nothing;

insert into options (roulette_id, label)
select r.id, v.label
from roulettes r
join (values
  ('Ти готуєш'),
  ('Я готую'),
  ('Готуємо разом'),
  ('Замовляємо доставку'),
  ('Готуємо за таймером')
) as v(label) on true
where r.title = 'Хто готує' and r.is_prebuilt = true
and not exists (
  select 1 from options o where o.roulette_id = r.id and o.label = v.label
);

insert into roulettes (title, description, icon, is_prebuilt)
values ('Активність', 'Щось динамічне', '🧩', true)
on conflict (title, is_prebuilt) do nothing;

insert into options (roulette_id, label)
select r.id, v.label
from roulettes r
join (values
  ('Квест удома'),
  ('Танці 20 хвилин'),
  ('Відеоігри 1v1'),
  ('Йога разом'),
  ('Фото-прогулянка')
) as v(label) on true
where r.title = 'Активність' and r.is_prebuilt = true
and not exists (
  select 1 from options o where o.roulette_id = r.id and o.label = v.label
);

insert into roulettes (title, description, icon, is_prebuilt)
values ('Фільм/серіал', 'Вечірній перегляд', '🎬', true)
on conflict (title, is_prebuilt) do nothing;

insert into options (roulette_id, label)
select r.id, v.label
from roulettes r
join (values
  ('Легка комедія'),
  ('Трилер'),
  ('Анімація'),
  ('Документалка'),
  ('Серіал на один вечір')
) as v(label) on true
where r.title = 'Фільм/серіал' and r.is_prebuilt = true
and not exists (
  select 1 from options o where o.roulette_id = r.id and o.label = v.label
);

insert into roulettes (title, description, icon, is_prebuilt)
values ('Настрій музики', 'Фон для вечора', '🎧', true)
on conflict (title, is_prebuilt) do nothing;

insert into options (roulette_id, label)
select r.id, v.label
from roulettes r
join (values
  ('Lo-fi'),
  ('Фанк/соул'),
  ('Акустика'),
  ('Інді-поп'),
  ('Ретро 80-х')
) as v(label) on true
where r.title = 'Настрій музики' and r.is_prebuilt = true
and not exists (
  select 1 from options o where o.roulette_id = r.id and o.label = v.label
);

insert into roulettes (title, description, icon, is_prebuilt)
values ('Бюджет', 'Скільки витрачаємо', '💸', true)
on conflict (title, is_prebuilt) do nothing;

insert into options (roulette_id, label)
select r.id, v.label
from roulettes r
join (values
  ('До 200 грн'),
  ('200-500 грн'),
  ('500-1000 грн'),
  ('1000+ грн'),
  ('Без витрат')
) as v(label) on true
where r.title = 'Бюджет' and r.is_prebuilt = true
and not exists (
  select 1 from options o where o.roulette_id = r.id and o.label = v.label
);

insert into roulettes (title, description, icon, is_prebuilt)
values ('Подарунок-сюрприз', 'Маленький бонус', '🎁', true)
on conflict (title, is_prebuilt) do nothing;

insert into options (roulette_id, label)
select r.id, v.label
from roulettes r
join (values
  ('Листівка'),
  ('Солодощі'),
  ('Книга/комікс'),
  ('Міні-щось handmade'),
  ('Сертифікат на обійми')
) as v(label) on true
where r.title = 'Подарунок-сюрприз' and r.is_prebuilt = true
and not exists (
  select 1 from options o where o.roulette_id = r.id and o.label = v.label
);

insert into roulettes (title, description, icon, is_prebuilt)
values ('Маршрут прогулянки', 'Куди звертаємо', '🚶', true)
on conflict (title, is_prebuilt) do nothing;

insert into options (roulette_id, label)
select r.id, v.label
from roulettes r
join (values
  ('Центр + кав''ярня'),
  ('Набережна'),
  ('Тихий район'),
  ('Сквери'),
  ('Випадковий маршрут 30 хв')
) as v(label) on true
where r.title = 'Маршрут прогулянки' and r.is_prebuilt = true
and not exists (
  select 1 from options o where o.roulette_id = r.id and o.label = v.label
);
