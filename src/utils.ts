// https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/parse-page-id.ts
const pageIdRe = /\b([a-f0-9]{32})\b/;
const pageId2Re = /\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/;

export const parsePageId = (pageId: string) => {
  let id = pageId.split('?')[0];

  let match = id.match(pageIdRe);
  if (match) {
    id = match[1];
    return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(16, 4)}-${id.substr(20)}`;
  }

  match = id.match(pageId2Re);
  if (match) {
    return match[1];
  }

  return '';
};
