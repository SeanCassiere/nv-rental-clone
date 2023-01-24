import { useState } from "react";
import { TextInput } from "../../components/Form";
import JSURL from "jsurl2";

const JsURLDecoder = () => {
  const [encodeValue, setEncodeValue] = useState("");
  const [encoded, setEncoded] = useState("");

  const [decodeValue, setDecodeValue] = useState("");
  const [decoded, setDecoded] = useState<any>({});

  return (
    <div className="grid grid-cols-2 gap-4">
      <TextInput
        label="Encode JSON"
        value={encodeValue}
        onChange={(evt) => {
          setEncodeValue(evt.target.value);
          try {
            const parsed = JSON.parse(evt.target.value);
            setEncoded(JSURL.stringify(parsed));
          } catch (error) {
            setEncoded("could not encode");
          }
        }}
      />
      <div>
        <p className="text-sm">Encoded</p>
        <p>{encoded}</p>
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
        <p>{JSON.stringify(decoded)}</p>
      </div>
    </div>
  );
};

export default JsURLDecoder;
