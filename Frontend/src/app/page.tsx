import { TabsComponent } from "./components/tab-component";
import Landing from "./components/landing-component";
import LearnComponent from "./components/learn-component";

export default function Home() {
  return (
    <>
      <header className="w-full">
        <Landing />
      </header>
      <main className="mt-7 flex flex-col justify-center gap-11 w-full">
        <TabsComponent />
        <LearnComponent />
      </main>
      <footer className="mt-7">
        <h2>Footer</h2>
      </footer>
    </>
  );
}
