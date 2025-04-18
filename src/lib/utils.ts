import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const fileType = file.name.split(".").pop();
  console.log("File uploaded");

  let endpoint = "";
  if (fileType === "pdf") {
    endpoint = "/parse-pdf";
  } else if (fileType === "docx" || fileType === "doc") {
    endpoint = "/parse-docx";
  } else if (fileType === "pptx" || fileType === "ppt") {
    endpoint = "/parse-pptx";
  } else {
    throw new Error("Unsupported file type");
  }

  const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to upload");
  }

  const data = await response.json();
  return data.text; // returns the parsed text from the file
};

export const processText = async (text: string, mode: string) => {
  const response = await fetch("http://127.0.0.1:8000/process-document", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, mode }),

  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to process document");
  }

  return await response.json(); // returns summary, explanation, flashcards, etc.
};
