const HTMLParser = require('node-html-parser');

// 
// 
// 

// HELPERS
const errorParser = (err) => `<pre>${err.stack}</pre>`;

function removeBrElements(root) {
  [...root.querySelectorAll('br')].forEach(brElement => brElement.remove());
}

function unwrapImageTags(root) {
  const pTags = [...root.querySelectorAll('p')];
  pTags.forEach(p => {
    const pHasImage = p.querySelector('img');
    if (pHasImage) p.replaceWith(p.innerHTML);
  })
  return root.toString();
}

function createCardElements(htmlStr) {
  const root = HTMLParser.parse(htmlStr);
  const gridImages = [...root.querySelectorAll('.img-grid img')];

  gridImages.forEach(img => {
    img.insertAdjacentHTML('beforebegin', '<div class="card"></div>');
  })

  return root.toString();
}

function populateCards(htmlStr) {
  const root = HTMLParser.parse(htmlStr);
  const cards = [...root.querySelectorAll('.card')];

  cards.forEach(card => {
    const arrOfElementStrings = [];
    
    let shouldCopyElement = true;
    
    while (shouldCopyElement) {
      const nextEl = card.nextElementSibling;

      if (nextEl && nextEl.rawTagName !== 'div') {
        arrOfElementStrings.push(nextEl)
        nextEl.remove()
      } else {
        shouldCopyElement = false;
      }
    }

    const cardElementsAsString = arrOfElementStrings.join('').toString();

    card.insertAdjacentHTML('afterbegin', cardElementsAsString);
  })

  return root.toString();
}
// HELPERS END

// 
// 
// 

const markdownParse = (markdown) => {
  markdown = markdown.replace(/<!-- grid-start -->/g, () => `<div class="img-grid">`)
  markdown = markdown.replace(/<!-- grid-end -->/g, () => `</div>`)
  return markdown;
};

const htmlParse = (html) => {
  const root = HTMLParser.parse(html);

  removeBrElements(root);
  const unwrappedImages = unwrapImageTags(root);
  const withCardElements = createCardElements(unwrappedImages);
  const withPopulatedCards = populateCards(withCardElements)

  return withPopulatedCards;
};

// 
// 
// 

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
