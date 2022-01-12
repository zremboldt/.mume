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

function createCards(htmlString) {
  const root = HTMLParser.parse(htmlString);
  const gridImages = [...root.querySelectorAll('.img-grid img')];

  gridImages.forEach(img => {
    let cardImageHTML = img.toString();
    let cardContentHTML = [];
    
    let shouldCopyElement = true;
    
    while (shouldCopyElement) {
      const nextEl = img.nextElementSibling;

      if (nextEl && nextEl.rawTagName !== 'img') {
        cardContentHTML.push(nextEl.toString())
        nextEl.remove()
      } else {
        shouldCopyElement = false;
      }
    }

    const cardMarkup = `
      <article class="card">
        ${cardImageHTML}
        <div class="card-content">
          ${cardContentHTML.join('')}
        </div>
        
        <div class="modal">
          ${cardImageHTML}
          <div class="modal-content">
            ${cardContentHTML.join('')}
          </div>
        </div>
      </article>
    `;

    img.insertAdjacentHTML('afterend', cardMarkup);
    img.remove();
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
  const withUnwrappedImages = unwrapImageTags(root);
  const withCards = createCards(withUnwrappedImages);

  return withCards;
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
