import HeaderContent from "./components/header-content";
import { TabsComponent } from "./components/tab-component";

export default function Home() {
  return (
    <div className="relative h-screen pl-1.5">
      <header className="top-5">
        <h1>Header</h1>
        <HeaderContent />
        <HeaderContent />
        <HeaderContent />
      </header>
      <main className="mt-7 flex justify-center">
        <TabsComponent />
      </main>
      <footer className="bottom-0 mt-7">
        <h2>Footer</h2>
        <HeaderContent />
        <HeaderContent />
      </footer>
    </div>
  );
}
