import { CodeBlock } from 'notion-types';

// additional language which Notion does not support
// e.g. // lang=JSX
const re = /^\/\/\slang=(?<language>[a-zA-Z]+)\n/;
// pass shiki import here, otherwise, could not import 'fs' library error will raise
export async function codeHighlight(block: CodeBlock, shiki: any) {
  let code = block.properties.title[0][0];
  let lang = block.properties.language[0][0].toLowerCase();

  const result = re.exec(code);
  if (result?.groups != null) {
    lang = result.groups.language.toLowerCase();
    code = code.replace(re, '');
  }

  const hightlight = await shiki
    .getHighlighter({
      theme: 'material-theme-darker',
    })
    .then((highlighter: any) => {
      return highlighter.codeToHtml(code, lang);
    });
  // remove code block so it could vertical scroll on mobile
  return hightlight.replace('<code>', '').replace('</code>', '').replace(/\n/g, '<br />');
}
