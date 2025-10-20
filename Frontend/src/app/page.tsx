import { TabsComponent } from "./components/tab-component";
import Landing from "./components/landing-component";
import LearnComponent from "./components/learn-component";

export default function Home() {
  return (
    <div className="h-screen min-w-screen">
      <header className="w-full">
        <Landing />
        <h1 className="text-center">hello world</h1>
      </header>
      <main className="mt-7 flex justify-center gap-11 w-full">
        <TabsComponent />
        {/* <LearnComponent /> */}
      </main>
      <footer className="mt-7">
        <h2>Footer</h2>
      </footer>
    </div>
  );
}
