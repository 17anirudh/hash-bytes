import HeaderContent from "./components/header-content";


export default function Home() {
  return (
    <div className="relative h-screen">
      <header className="top-5">
        <h1>Header</h1>
        <HeaderContent />
        <HeaderContent />
        <HeaderContent />
      </header>
      <main className="mt-7">
        <h1>Main</h1>
        <HeaderContent />
        <HeaderContent />
        <HeaderContent />
        <HeaderContent />
      </main>
      <footer className="bottom-0 mt-7">
        <h2>Footer</h2>
        <HeaderContent />
        <HeaderContent />
      </footer>
    </div>
  );
}
