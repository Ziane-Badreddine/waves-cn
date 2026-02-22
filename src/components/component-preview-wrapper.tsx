import { ComponentPreview } from "./component-preview";
import { Index } from "@/__registry__";
import fs from "fs";
import path from "path";

interface ComponentPreviewWrapperProps {
  name: string;
  variant?: "normal" | "preview" | "codesource";
  hideCode?: boolean;
}
const parseCode = (code: string) => code.replace(/@\/registry\//g, "@/");

export function ComponentPreviewWrapper({
  name,
  variant = "normal",
  hideCode = false,
}: ComponentPreviewWrapperProps) {
  const file = Index[name]?.files?.[0];

  const code = !hideCode && file ? getComponentCode(file) : null;

  return (
    <ComponentPreview
      name={name}
      variant={variant}
      hideCode={hideCode}
      codeString={code == null ? null : parseCode(code)}
    />
  );
}

function getComponentCode(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      return null;
    }

    return fs.readFileSync(fullPath, "utf-8");
  } catch (error) {
    console.error("Error reading component source:", error);
    return null;
  }
}
