import _dayjs from 'dayjs';
import _dayjsUTC from 'dayjs/plugin/utc';
import { IFetch, IGetPageOptions, NotionAPIError, NotionPageChunk } from './interfaces';

_dayjs.extend(_dayjsUTC);
export const dayjs = _dayjs.utc;

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

const NOTION_API = 'https://www.notion.so/api/v3';
export async function getPageRaw(pageId: string, options: IGetPageOptions): Promise<NotionPageChunk | NotionAPIError> {
  const _fetch: NonNullable<IFetch> = options?.fetch ?? require('node-fetch');
  const headers: RequestInit['headers'] = { 'content-type': 'application/json' };
  if (options.notionToken) {
    headers['cookie'] = `token_v2=${options.notionToken}`;
  }

  return _fetch(`${NOTION_API}/loadPageChunk`, {
    headers: headers,
    body: JSON.stringify({
      pageId: parsePageId(pageId),
      limit: 999999,
      cursor: { stack: [] },
      chunkNumber: 0,
      verticalColumns: false,
    }),
    method: 'POST',
  }).then((res) => res.json());
}
