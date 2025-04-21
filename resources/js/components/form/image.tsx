import React from 'react';
import Dropzone from 'react-dropzone';
import { XCircleIcon } from 'lucide-react';
const ImagePreview = ({ url, onRemove }: { url: string; onRemove: () => void }) => (
    <div className="relative aspect-[6/4]"> {/* Aspecto 6:4 */}
        <button
            type='button'
            className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 shadow-md hover:bg-gray-300"
            onClick={onRemove}
        >
            <XCircleIcon className="text-gray-600 h-5 w-5" /> {/* Ícono más minimalista */}
        </button>
        <img
            src={url}
            alt="Preview"
            className="border-gray-300 h-full w-full rounded-md border-4 object-cover" // Borde más limpio
        />
    </div>
);

export default function ImageDropZone({
    images,
    maxImages = 4,
    onUpload,
    onRemove,
    label,
}: {
    images: string[];
    maxImages?: number;
    onUpload: (files: File[]) => void;
    onRemove: (index: number) => void;
    label: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600">{label}</label> {/* Texto más suave */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-2"> {/* Hacerlo responsive */}
                {images.map((image, index) => (
                    <ImagePreview key={index} url={image} onRemove={() => onRemove(index)} />
                ))}
                {images.length < maxImages && (
                    <Dropzone onDrop={onUpload}>
                        {({ getRootProps, getInputProps }) => (
                            <div
                                {...getRootProps()}
                                className="flex aspect-[6/4] cursor-pointer items-center justify-center rounded-md border-4 border-dashed border-gray-300 hover:border-gray-400" // Borde más limpio
                            >
                                <input {...getInputProps()} />
                                <p className="text-center text-sm sm:text-base text-gray-600">Arrastra imágenes o haz clic para subir</p> {/* Texto más suave */}
                            </div>
                        )}
                    </Dropzone>
                )}
            </div>
        </div>
    );
}
