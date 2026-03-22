import Topbar from "../components/TopbarStatic";
export default function AboutPage() {
  

  return (
    <div className="">
      <Topbar />
      <div className="pt-16"></div>
      <main className="mx-auto max-w-4xl px-6 py-10 text-gray-100">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">About PrideIndex</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-300">
          PrideIndex is a personal project focused on collecting and organizing
          information about LGBT+ individuals who have made meaningful
          contributions across culture, science, technology, politics, and the
          arts. Its goal is to turn scattered public information into a
          structured, easy-to-explore dataset.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold">What it is</h2>
        <div className="mt-4 space-y-4 text-gray-300 leading-7">
          <p>At its core, PrideIndex combines three parts:</p>

          <ul className="list-disc space-y-2 pl-6">
            <li>A curated dataset of LGBT+ figures</li>
            <li>A simple API for accessing structured data</li>
            <li>An interactive map for exploring by country and domain</li>
          </ul>

          <p>
            You can browse by location, explore areas of impact, and look into
            individual profiles through a consistent data structure designed for
            readability and reuse.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold">Why I built it</h2>
        <div className="mt-4 space-y-4 text-gray-300 leading-7">
          <p>
            Information about LGBT+ figures exists in many places, but it is
            often unstructured or not easily accessible.
          </p>
          <p>
            PrideIndex is my attempt to make that information more usable,
            searchable, and organized for people who want to build, study, or
            explore with it.
          </p>
          <p>
            On personal note - As a little gay girl I'd be thrilled to have a resource like this when I was younger. I hope it can be a source of inspiration and pride for others as well.
          </p>
        </div>
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold">Note , requests, bugs?</h2>
        <div className="mt-4 space-y-4 text-gray-300 leading-7">
          <p>
            PrideIndex is a project in progress, and I'm always looking for ways to improve it. If you have any feedback, suggestions, or want to contribute, please email me at <a href="mailto:galdevops@gmail.com" className="text-blue-400 underline">galdevops@gmail.com</a>
          </p>
        </div>
      </section>
      

      <section className="border-t border-gray-800 pt-8">
        <h2 className="text-2xl font-semibold">Disclaimer</h2>
        <p className="mt-4 text-sm leading-7 text-gray-400">
          This project relies on publicly available web sources. While care was
          taken to use reputable references and structure the information
          consistently, the content may still contain inaccuracies, omissions,
          outdated details, or source-dependent bias. The results should be
          treated as informational only and independently verified before use in
          research, publication, legal, medical, financial, or other high-stakes
          contexts.
        </p>
      </section>
    </main>
    </div>
    
  );
}