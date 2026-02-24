"use client";

import React from "react";
import WaveRecorder from "@/registry/components/wave-recorder";
import { toast } from "sonner";

export default function WaveRecorderMinimal() {
  return (
    <WaveRecorder
      showWaveform={false}
      showTimer={false}
      onRecordEnd={(blob) => {
        const url = URL.createObjectURL(blob);

        toast("Voice message recorded ", {
          description: (
            <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4 text-xs">
              <code>
                {JSON.stringify(
                  {
                    size: `${(blob.size / 1024).toFixed(2)} KB`,
                    type: blob.type,
                    url,
                  },
                  null,
                  2,
                )}
              </code>
            </pre>
          ),
          position: "bottom-right",
          classNames: {
            content: "flex flex-col gap-2",
          },
          style: {
            "--border-radius": "calc(var(--radius) + 4px)",
          } as React.CSSProperties,
        });
      }}
    />
  );
}
