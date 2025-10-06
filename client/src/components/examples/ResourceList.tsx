import ResourceList from '../ResourceList';

export default function ResourceListExample() {
  const resources = [
    { id: "1", name: "Jean Dupont", role: "Chef de chantier", status: "affecte" as const, project: "Immeuble A" },
    { id: "2", name: "Marie Martin", role: "Ingénieur", status: "affecte" as const, project: "Usine Nord" },
    { id: "3", name: "Pierre Durand", role: "Électricien", status: "disponible" as const },
    { id: "4", name: "Sophie Bernard", role: "Maçon", status: "conge" as const },
    { id: "5", name: "Luc Petit", role: "Plombier", status: "disponible" as const },
  ];

  return (
    <ResourceList
      title="Salariés"
      resources={resources}
      onAdd={() => console.log('Add resource')}
    />
  );
}
