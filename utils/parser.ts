const startTag = new RegExp(
  `^<([A-Za-z]+)` + // tagName
  `((?:\\s+\\w+` + // property && attribute name
  `(?:=(?:"[^"]*"|'[^']*'))?)*)` + // attribute value
  `\\s*(\\/?)>` // is self-closed
);
const endTag = /^<\/([A-Za-z]+)[^>]*>/;
const attrAndProps = new RegExp(
  `([A-Za-z]+)` + // attributename or prop
  `(?:=(?:"[^"]*"|'[^']*'|[^>\s]+))?` // equal sign and attribute value
, 'g');

// TODO: filter attirbute starts with `on`

interface ParserHandler {
  start?: Function;
  end?: Function;
  chars?: Function;
}

interface ParsePropsAndAttrsResult {
  props: Array<String>;
  attrs: Object;
}

function parsePropsAndAttrs(raw: String): ParsePropsAndAttrsResult {
  const result = { props: [], attrs: {} };
  const matched = raw.match(attrAndProps);
  if (matched) {
    matched.forEach(maybePair => {
      if (/=/.test(maybePair)) {
        const [k, v] = maybePair.split('=');
        result.attrs[k] = v.replace(/"/g, '');
      } else {
        result.props.push(maybePair);
      }
    });
  }
  return result;
}

export function parse(raw: String, handler: ParserHandler): void {
  while(raw) {
    switch(true) {
      case raw.indexOf('</') === 0: {
        let matched = raw.match(endTag);
        if (matched) {
          raw = raw.substring(matched[0].length);
          if (typeof handler.end === 'function') handler.end({ tagName: matched[1] });
        }
        continue;
      }

      case raw.indexOf('<') === 0: {
        let matched = raw.match(startTag);
        if (matched) {
          raw = raw.substring(matched[0].length);
          if (typeof handler.start === 'function') {
            const { attrs, props } = parsePropsAndAttrs(matched[2]);
            handler.start({
              tagName: matched[1],
              attrs,
              props
            });
          }
        }
        continue;
      }

      default:
        const nextTagIndex = raw.indexOf('<');
        const text = ~nextTagIndex ? raw.substring(0, nextTagIndex) : raw;
        raw = ~nextTagIndex ? raw.substring(nextTagIndex) : '';
        if (typeof handler.chars === 'function') handler.chars(text); 
    }
  } 
};

export function parseToNodes(raw: String, handler: ParserHandler): Array<Object> {
  const nodes = [];
  parse(raw, {
    start({ tagName, attrs }) {
      switch (tagName.toLowerCase()) {
        case 'img':
          nodes.push({
            name: 'img',
            attrs: {
              src: attrs.src,
              'class': 'postcontent--image'
            }
          });
          break;
        case 'br':
          nodes.push({ name: 'br' });
          break;
        case 'strong':
          nodes.push({
            name: 'strong',
            attrs,
            children: []
          });
          break;
        default:
          nodes.push({
            name: 'div',
            attrs: Object.assign({ 'class': 'postcontent' }, attrs),
            children: []
          });
      }
    },
    chars(text: String) {
      while (text.match(/_\(([^_]+)\)/)) {
        if (RegExp.leftContext.length) {
          nodes[nodes.length - 1].children.push({
            type: 'text',
            text: RegExp.leftContext
          });
        }
        nodes[nodes.length - 1].children.push({
          name: 'img',
          attrs: {
            src: `//img-static.mihoyo.com/emoticon/${RegExp.$1}.png`,
            class: 'emotion--img'
          }
        });
        text = RegExp.rightContext;
      }

      if (text.length) {
        nodes[nodes.length - 1].children.push({
          type: 'text',
          text
        });
      }
    }
  });
  return nodes;
}

export default parse;
