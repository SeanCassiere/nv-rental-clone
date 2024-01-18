import { useId, useState } from "react";
import JSURL from "jsurl2";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const JsURLDecoder = () => {
  const encodeValueId = useId();
  const decodeJSURLtoJSONId = useId();
  const [encodeValue, setEncodeValue] = useState("");
  const [encoded, setEncoded] = useState("");

  const [decodeValue, setDecodeValue] = useState("");
  const [decoded, setDecoded] = useState<any>({});

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
          <p className="w-full break-all bg-card p-4">{encoded}</p>
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
          <p className="w-full break-all bg-card p-4">
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
};

export default JsURLDecoder;