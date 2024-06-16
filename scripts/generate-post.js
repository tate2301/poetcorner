const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function generateSlug(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

rl.question("Enter the title: ", (title) => {
  rl.question("Enter the image name (saved in public folder): ", (image) => {
    rl.question("Enter the index: ", (index) => {
      // Prompt for index
      const frontMatter = `---
title: '${title}'
image: '/${image}'
publishDate: '${new Date().toISOString().split("T")[0]}'
index: '${index}'
---
`;

      const filename = generateSlug(title);
      fs.writeFile(`./posts/${filename}.mdx`, frontMatter, (err) => {
        if (err) {
          console.error(`Error writing file: ${err}`);
        } else {
          console.log("MDX file has been generated!");
        }
        rl.close();
      });
    });
  });
});
