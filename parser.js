// HELPER FN
const errorParser = (err) => `<pre>${err.stack}</pre>`;

const markdownParse = (markdown) => {
  // markdown = markdown.replace(/grid-start/g, () => `> This is where grid start is`)
  return markdown;
};

const htmlParse = (html) => {
  // const domParser = new DOMParser();
  // const parsedHtml = domParser.parseFromString(html)

  // const imgStr = html.replace(/!\[/g, () => );


  // html = html.replace(/<p>grid-start<\/p>/g, () => `<div class="img-grid">`)
  // html = html.replace(/<p>grid-end<\/p>/g, () => `</div>`)
  // return html;

  // const root = parse(html);
  // const headline = root.querySelector('#card-headline')
  console.log(html)
  return html;
};

module.exports = {
  // do something with the markdown before it gets parsed to HTML
  onWillParseMarkdown: function (markdown) {
    return new Promise((resolve, reject) => {
      try {
        markdown = markdownParse(markdown);
      } catch (error) {
        markdown = errorParser(error);
      }

      return resolve(markdown);
    });
  },
  // do something with the parsed HTML string
  onDidParseMarkdown: function (html) {
    return new Promise((resolve, reject) => {
      try {
        html = htmlParse(html);
      } catch (error) {
        html = errorParser(error);
      }

      return resolve(html);
    });
  },
};
