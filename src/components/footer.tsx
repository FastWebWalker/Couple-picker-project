export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/80">
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-8 text-sm text-muted-foreground md:grid-cols-[1fr_auto] md:items-center">
        <p>© 2025 Рулетка для двох. Грайте красиво, любіть сильніше.</p>
        <div className="grid grid-flow-col auto-cols-max items-center gap-4">
          <span>Зроблено для пар і друзів</span>
          <span>💛</span>
        </div>
      </div>
    </footer>
  );
}
