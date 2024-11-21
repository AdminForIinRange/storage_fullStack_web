"use client"; 
// This tells Next.js to render the component on the client side (not server-side).

import React, { useCallback, useState } from "react";
// Importing React and two hooks: useState (for managing state) and useCallback (to memoize functions).

import { useDropzone } from "react-dropzone";
// Importing the 'useDropzone' hook from 'react-dropzone' to handle drag-and-drop file uploads.

import { Button } from "@/components/ui/button";
// Custom Button component imported from your project.

import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
// Utility functions: 
// - `cn`: Likely used to combine CSS class names.
// - `convertFileToUrl`: Converts a file into a URL (for displaying previews).
// - `getFileType`: Determines file type and extension based on its name.

import Image from "next/image";
// Next.js optimized Image component for better performance.

import Thumbnail from "@/components/Thumbnail";
// Thumbnail component to generate a preview of uploaded files.

import { MAX_FILE_SIZE } from "@/constants";
// A constant defining the maximum file size allowed (probably 50MB here).

import { useToast } from "@/hooks/use-toast";
// Custom hook to display toast notifications (feedback messages).

// import { uploadFile } from "@/lib/actions/file.actions";
// (Commented out): A function for uploading files to the server.

import { usePathname } from "next/navigation";
// Hook to get the current URL pathname in a Next.js app.

interface Props {
  ownerId: string; // ID of the file owner.
  accountId: string; // Account ID associated with the upload.
  className?: string; // Optional CSS class for styling.
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname(); // Get the current URL path.
  const { toast } = useToast(); // Use the toast hook for notifications.
  const [files, setFiles] = useState<File[]>([]); // State to store uploaded files.

  // Function triggered when files are dropped.
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles); // Save the dropped files to state.

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          // Check if the file exceeds the size limit.
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name),
          ); // Remove the file from the list.

          return toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> is too large.
                Max file size is 50MB.
              </p>
            ), // Show a toast message indicating the error.
            className: "error-toast",
          });
        }

        // (Commented out): Upload the file to the server.
        // return uploadFile({ file, ownerId, accountId, path }).then(
        //   (uploadedFile) => {
        //     if (uploadedFile) {
        //       setFiles((prevFiles) =>
        //         prevFiles.filter((f) => f.name !== file.name),
        //       );
        //     }
        //   },
        // );
      });

      await Promise.all(uploadPromises); // Wait for all upload promises to complete.
    },
    [ownerId, accountId, path], // Dependencies for the useCallback hook.
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  // Destructure methods from `useDropzone`. These help manage drag-and-drop behavior.

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string,
  ) => {
    e.stopPropagation(); // Prevents triggering other click events.
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    // Remove the file with the given name from the list.
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      {/* Invisible input element for file selection */}
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />{" "}
        <p>Upload</p>
      </Button>
      {/* Upload button */}
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            // Get file type and extension.

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  {/* Thumbnail preview of the file */}
                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
                {/* Remove file button */}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
// Exporting the component for use in the app.
