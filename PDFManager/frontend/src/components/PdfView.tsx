import { useCallback } from 'react';
import Dropzone from 'react-dropzone';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy, } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Composant sortable interne
function SortablePdf({ id, file }: { id: number; file: File }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
        alt="PDF"
        style={{ width: '50px', height: '50px' }}
      />
      <span
        style={{
          maxWidth: '70px',
          textAlign: 'center',
          fontSize: '12px',
          wordBreak: 'break-word',
        }}
      >
        {file.name}
      </span>
    </div>
  );
}

// Composant principal
export default function PdfView(
  { files,
    setFiles }: {
      files: File[];
      setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    }
) {
  //const [pdfFiles, setPdfFiles] = useState<File[]>([]);

  const inDrop = useCallback((acceptedFiles: File[]) => {
    const pdfs = acceptedFiles.filter(file => file.type === 'application/pdf');
    setFiles(prev => [...prev, ...pdfs]);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = active.id as number;
      const newIndex = over.id as number;
      setFiles(items => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <>
      <div>pdf_view</div>

      {files.length === 0 && <Dropzone onDrop={inDrop}>

        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            style={{
              border: '2px dashed #cccccc',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
      </Dropzone>}



      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={files.map((_, i) => i)}
          strategy={horizontalListSortingStrategy}
        >
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginTop: '20px',
            }}
          >
            {files.map((file, index) => (
              <SortablePdf key={index} id={index} file={file} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
