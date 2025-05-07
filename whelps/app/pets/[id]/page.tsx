// app/pets/[id]/page.tsx
import PetProfile from '@/app/petprofile/page';
import pets from '@/app/data/mockData';

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const pet = pets.find(p => p.id === Number(params.id));

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Pet not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PetProfile pet={pet} />
    </div>
  );
}