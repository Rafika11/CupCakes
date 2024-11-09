const { JSDOM } = require("jsdom");

const dom = new JSDOM(`
  <html>
    <body>
      <div id="dinheiro-modal" style="display: none;"></div>
      <span id="total-valor"></span>
    </body>
  </html>
`);
global.document = dom.window.document;

const { openDinheiroModal } = require("./script.js");
