import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiCamera } from 'react-icons/fi';
export const PhotoCell = ({ row, table }) => {
    const original = row.original;
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const previewUrl = URL.createObjectURL(file);
            // We store both the file object and the preview URL
            table.options.meta?.updateData(row.index, 'foto', file);
            table.options.meta?.updateData(row.index, 'fotoPreview', previewUrl);
        }
    }, [row.index, table.options.meta]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxFiles: 1
    });
    return (<div {...getRootProps()} className={`border rounded p-1 text-center cursor-pointer position-relative overflow-hidden ${isDragActive ? 'bg-light' : ''}`} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <input {...getInputProps()}/>
      {original.fotoPreview ? (<img src={original.fotoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}/>) : (<FiCamera size={18} className="text-muted"/>)}
    </div>);
};
