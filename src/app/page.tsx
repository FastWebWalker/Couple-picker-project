import Link from "next/link";

const items = [
  {
    title: "Рулетка",
    description: "Обертай ідеї для двох.",
    href: "/roulettes",
  },
  {
    title: "Хотілки",
    description: "Список бажань та мрій.",
    href: "/wishes",
  },
  {
    title: "Нотатки",
    description: "Швидкі записи пари.",
    href: "/notes",
  },
  {
    title: "Плани",
    description: "Спільні ідеї на майбутнє.",
    href: "/plans",
  },
  {
    title: "Побачення",
    description: "Історія та натхнення.",
    href: "/dates",
  },
  {
    title: "Сюрпризи",
    description: "Ідеї для маленьких радощів.",
    href: "/gifts",
  },
];

export default function HomePage() {
  return (
    <div className="grid h-[calc(100vh-64px)] w-full overflow-hidden">
      <div className="grid h-full grid-rows-2 gap-0 md:grid-cols-3 md:grid-rows-2">
        {items.map((item, index) => (
          <Link
            key={item.title}
            href={item.href}
            className="card-animate card-folder group grid h-full content-center border border-orange-400 bg-white/70 p-6 text-gray-900 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-orange-50/80 hover:shadow-2xl"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <h2 className="text-lg font-semibold uppercase tracking-[0.25em]">
              {item.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
