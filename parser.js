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
  const gridImages = [...root.querySelectorAll('.md-img-grid img')];

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

    const handleCardClick = `
      const handler = () => {
        const modalContainer = this.querySelector('.md-modal-container');
        const modalBackground = this.querySelector('.md-modal-background');

        modalBackground.classList.toggle('md-active');
        modalContainer.classList.toggle('md-active');
      }
      handler();
    `;

    const cardMarkup = `
      <article class="md-card" onclick="${handleCardClick}">
        ${cardImageHTML}
        <div class="md-card-content">
          ${cardContentHTML.join('')}
        </div>
        
        <div class="md-modal-background"></div>
        
        <div class="md-modal-container">
          <div class="md-modal">
            ${cardImageHTML}
            <div class="md-modal-content">
              ${cardContentHTML.join('')}
            </div>
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
  markdown = markdown.replace(/<!-- grid-start -->/g, () => `<div class="md-img-grid">`)
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
