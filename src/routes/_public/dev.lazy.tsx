import React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import JSURL from "jsurl2";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { titleMaker } from "@/utils/title-maker";

export const Route = createLazyFileRoute("/_public/dev")({
  component: DevPage,
});

function DevPage() {
  useDocumentTitle(titleMaker("Styling Area"));

  return (
    <div className="overflow-y-auto bg-background px-2 text-foreground">
      <section className="py-10 md:mx-28">
        <h2 className="text-2xl">JSURL Utils</h2>
        <JsURLDecoder />
      </section>
    </div>
  );
}

function JsURLDecoder() {
  const encodeValueId = React.useId();
  const decodeJSURLtoJSONId = React.useId();
  const [encodeValue, setEncodeValue] = React.useState("");
  const [encoded, setEncoded] = React.useState("");

  const [decodeValue, setDecodeValue] = React.useState("");
  const [decoded, setDecoded] = React.useState<any>({});

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor={encodeValueId}>Encode JSON</Label>
        <Input
          id={encodeValueId}
          value={encodeValue}
          onChange={(evt) => {
            setEncodeValue(evt.target.value);
            try {
              const parsed = JSON.parse(evt.target.value);
              const url = JSURL.stringify(parsed);
              setEncoded(url);
            } catch (error) {
              setEncoded("could not encode");
            }
          }}
        />
      </div>
      <div>
        <p className="text-sm">Encoded</p>
        <div className="flex flex-col md:flex-row">
          <p className="w-full break-all bg-accent p-4 text-accent-foreground">
            {encoded}
          </p>
          <p className="w-min">
            <Button
              type="button"
              onClick={() => {
                window.navigator.clipboard.writeText(encoded);
              }}
            >
              Copy
            </Button>
          </p>
        </div>
      </div>
      <div>
        <Label htmlFor={decodeJSURLtoJSONId}>Decode JSURL to JSON</Label>
        <Input
          id={decodeJSURLtoJSONId}
          value={decodeValue}
          onChange={(evt) => {
            setDecodeValue(evt.target.value);
            try {
              const parsed = JSURL.parse(evt.target.value);
              setDecoded(parsed);
            } catch (error) {
              setDecoded("could not decode");
            }
          }}
        />
      </div>
      <div>
        <p className="text-sm">Decoded</p>
        <div className="flex flex-col md:flex-row">
          <p className="w-full break-all bg-accent p-4 text-accent-foreground">
            {JSON.stringify(decoded)}
          </p>
          <p className="w-min">
            <Button
              type="button"
              onClick={() => {
                window.navigator.clipboard.writeText(JSON.stringify(decoded));
              }}
            >
              Copy
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
