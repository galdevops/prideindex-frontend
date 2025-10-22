import Link from 'next/link';
import WorldMap from './components/WorldMap';
import FlatWorldMap from './components/FlatWorldMap';
import FullViewWorldMap from './components/FullViewWorldMap';

export default function Home() {
  return (
    <div className="">
      <h1 className="text-3xl font-bold">PrideIndex</h1>
      <p className="mt-4">Easily ... something.</p>
      <Link href="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded">
        Start here
      </Link>
      <WorldMap />
      {/* <FlatWorldMap /> */}
      {/* <FullViewWorldMap /> */}
    </div>
  );
}
