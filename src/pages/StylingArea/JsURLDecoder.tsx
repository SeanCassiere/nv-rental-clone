import { useState } from "react";
import { TextInput } from "../../components/Form";
import JSURL from "jsurl2";
import { Button } from "../../components/Form/Button";

const JsURLDecoder = () => {
  const [encodeValue, setEncodeValue] = useState("");
  const [encoded, setEncoded] = useState("");

  const [decodeValue, setDecodeValue] = useState("");
  const [decoded, setDecoded] = useState<any>({});

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TextInput
        label="Encode JSON"
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
      <div>
        <p className="text-sm">Encoded</p>
        <div className="flex flex-col md:flex-row">
          <p className="w-full break-all bg-indigo-100 p-4">{encoded}</p>
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
      <TextInput
        label="Decode JSURL to JSON"
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
      <div>
        <p className="text-sm">Decoded</p>
        <div className="flex flex-col md:flex-row">
          <p className="w-full break-all bg-indigo-100 p-4">
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
