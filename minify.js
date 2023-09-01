/*
  This is currently disabled because of v3 migration, for some reason it just doesn't work
  Using jampack instead
*/

import { minify as js } from "@swc/core";
import { globby } from "globby";
import { writeFile, readFile } from "node:fs/promises";
import { minify as html } from "html-minifier-terser";

export default function minify() {
  return {
    name: "noctura-minify",
    hooks: {
      "astro:build:done": async () => {
        const files = await globby([`./dist/**/*.{js,html}`, "!./dist/sw"], {
          expandDirectories: true
        });
        files.map(async (file) => {
          console.log(file);
          const input = await readFile(file, { encoding: "utf-8" });
          let output;
          if (file.endsWith("js")) {
            try {
              output = (
                await js(input, {
                  compress: true
                })
              ).code;
            } catch (err) {
              console.log("failed to build: " + file);
            }
          } else if (file.endsWith("html")) {
            try {
              output = (
                await html(input)
              )
            } catch (err) {
              console.log("failed to build: " + file)
            }
          }

          await writeFile(file, output);
        });
      }
    }
  };
}
