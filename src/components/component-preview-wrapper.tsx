
import { ComponentPreview } from "./component-preview";
import { Index } from "@/__registry__";
import fs from "fs";
import path from "path";

export  function ComponentPreviewWrapper({
  name,
}: {
  name: string;
})  {
   const file = Index[name]?.files?.[0];

  const code = file ? getComponentCode(file) : null;

  return (
    <ComponentPreview
      name={name}
      codeString={code}
    />
  );
}




export function getComponentCode(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const file = fs.readFileSync(fullPath, "utf-8");
    return file;
  } catch {
    return null;
  }
}

