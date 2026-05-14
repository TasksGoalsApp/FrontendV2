export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-muted-foreground text-center">
        © {new Date().getFullYear()} Task App. All rights reserved.
      </div>
    </footer>
  );
}