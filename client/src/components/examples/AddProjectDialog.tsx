import AddProjectDialog from '../AddProjectDialog';

export default function AddProjectDialogExample() {
  return (
    <AddProjectDialog onAdd={(project) => console.log('Project added:', project)} />
  );
}
