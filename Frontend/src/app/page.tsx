import { TabsComponent } from "./components/tab-component";
import Landing from "./components/landing-component";
import LearnComponent from "./components/learn-component";

export default function Home() {
  return (
    <div className="relative h-screen min-w-screen">
      <header className="top-5 min-h-screen">
        <Landing />
      </header>
      <main className="mt-7 flex flex-col justify-center p-7 sm:p-20 gap-11 max-w-screen">
        <TabsComponent />
        {/* <LearnComponent /> */}
      </main>
      <footer className="bottom-0 mt-7">
        <h2>Footer</h2>
      </footer>
    </div>
  );
}
