"use client";

import React, { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
// import Thumbnail from "@/components/Thumbnail";
// import { MAX_FILE_SIZE } from "@/constants";
// import { useToast } from "@/hooks/use-toast";
// import { uploadFile } from "@/lib/actions/file.actions";
// import { usePathname } from "next/navigation";

const fileUploader = () => {
  return (
    <div className="cursor-pointer">
      <input />
      <Button type="button" className={cn("uploader-button")}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />{" "}
        <p>Upload</p>
      </Button>

      <ul className="uploader-preview-list">
        <h4 className="h4 text-light-100">Uploading</h4>

        <li className="uploader-preview-item">
          <div className="flex items-center gap-3">
            <div className="preview-item-name">
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
          />
        </li>
      </ul>
    </div>
  );
};

export default fileUploader;
