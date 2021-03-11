import { writeJsonSync } from "https://deno.land/x/jsonfile/mod.ts";
import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

// Import lodash
import "https://deno.land/x/lodash@4.17.19/dist/lodash.js";
const _ = (self as any)._; // weird deno stuff since lodash is imported as "global"

// init objects
const myJson: any = [];
const jsonObject: any = {};

if (Deno.args[0]) {
  const f = await Deno.open(Deno.args[0]);
  for await (const line of readline(f)) {
    const LineClearText = new TextDecoder().decode(line);

    if (LineClearText[0] === "#") { // create base object
      const headers = LineClearText.slice(2).slice(0, -2).split("^");
      headers.forEach((header: string) => {
        jsonObject[header] = undefined;
      });
    } else if (jsonObject === {}) { // missing headers in file
      console.error("Missing headers");
      Deno.exit();
    } else { // write objects
      const LineObject: any = _.clone(jsonObject);
      const objects = LineClearText.split("^");
      Object.keys(LineObject).forEach((key, index) => {
        LineObject[key] = /^\d+$/.test(objects[index])
          ? Number(objects[index])
          : objects[index];
      });
      myJson.push(LineObject);
    }
  }
  writeJsonSync(`./${Deno.args[0].slice(0, -3)}json`, myJson);

  f.close();
} else {
  console.error("Missing file path !");
  console.log(
    "deno run -A ParseFLFormatToJson {the path or the file you wanna parse}",
  );
  Deno.exit();
}
