import _dayjs from 'dayjs';
import _dayjsUTC from 'dayjs/plugin/utc';
import slugify from 'slugify';
import { Block, BlockMap } from 'notion-types';
import { cloneDeep } from 'lodash';

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

export function formatPageIntoSection(page: BlockMap, level: 'header'): BlockMap;
export function formatPageIntoSection(page: BlockMap, level: 'sub_header'): { [key: string]: BlockMap };
export function formatPageIntoSection<T>(
  page: BlockMap,
  level: 'header',
  callback?: (block: Block) => T
): { [key: string]: T };
export function formatPageIntoSection<T>(
  page: BlockMap,
  level: 'sub_header',
  callback?: (block: Block) => T
): { [key: string]: { [key: string]: T } };
export function formatPageIntoSection<T>(page: BlockMap, level: string, callback?: (block: Block) => T): any {
  level; // TODO
  const [pageId, pageBlock] = Object.entries(page)[0];
  const blocks: any = {};
  let title: string = '';
  // mark content block forward because some blocks (1 - 4) is metadata for
  // the page
  let iteratingItem = false;
  for (const [key, item] of Object.entries(page)) {
    if (item.value.type === 'header') {
      // @ts-ignore
      title = slugify(item.value.properties?.title.flatMap((i: string[]) => i[0]).join('') ?? '', { lower: true });
      blocks[title] = { [pageId]: cloneDeep(pageBlock) };
      // only include key which will be used
      blocks[title][pageId].value.content = [];
      iteratingItem = true;
    } else if (iteratingItem === true) {
      blocks[title][key] = callback?.(item.value) ?? item;
      blocks[title][pageId].value.content.push(key);
    }
  }

  return blocks;
}
