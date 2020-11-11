import _dayjs from 'dayjs';
import _dayjsUTC from 'dayjs/plugin/utc';
import slugify from 'slugify';
import { Block, BlockMap, Decoration } from 'notion-types';
import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';
import get from 'lodash.get';

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
  options?: {
    includePageBlock?: boolean;
    toText?: boolean;
    toHTML?: boolean;
    callback?: (block: Block) => T;
  }
): { [key: string]: T };
export function formatPageIntoSection<T>(
  page: BlockMap,
  level: 'sub_header',
  options?: {
    includePageBlock?: boolean;
    toText?: boolean;
    toHTML?: boolean;
    callback?: (block: Block) => T;
  }
): { [key: string]: { [key: string]: T } };
export function formatPageIntoSection<T>(
  page: BlockMap,
  level: 'header' | 'sub_header',
  options?: {
    includePageBlock?: boolean;
    toText?: boolean; // TODO
    toHTML?: boolean; // TODO
    callback?: (block: Block) => T;
  }
): any {
  const [pageId, pageBlock] = Object.entries(page)[0];
  // for getting pageID, in case of using react notion and the like
  const includePageBlock = options?.includePageBlock ?? true;
  const blocks: any = {};
  let title: string = '';
  // mark content block because some blocks (1 - 4) is metadata for the page
  let iteratingItem = false;
  for (const [key, item] of Object.entries(page)) {
    if (item.value.type === 'header') {
      title = getTitleText(item.value.properties?.title ?? []);
      iteratingItem = true;

      if (includePageBlock && level === 'header') {
        set(blocks, `${title}.${pageId}`, cloneDeep(pageBlock));
        set(blocks, `${title}.${pageId}.value.content`, []);
      }
    } else if (level === 'sub_header' && item.value.type === 'sub_header') {
      // split previous subheader from header
      if (title.includes('.')) {
        title = title.substr(0, title.indexOf('.'));
      }
      title = title + '.' + getTitleText(item.value.properties?.title ?? []);
      // console.log(title);
      if (includePageBlock) {
        set(blocks, `${title}.${pageId}`, cloneDeep(pageBlock));
        set(blocks, `${title}.${pageId}.value.content`, []);
      }
    } else if (iteratingItem === true) {
      set(blocks, `${title}.${key}`, options?.callback?.(item.value) ?? item);
      // simple is the best
      if (includePageBlock) {
        set(
          blocks,
          `${title}.${pageId}.value.content`,
          get(blocks, `${title}.${pageId}.value.content`, []).concat(key)
        );
      }
    }
  }

  return blocks;
}

function getTitleText(title: Decoration[]) {
  return slugify(title.flatMap((i) => i[0]).join('') ?? '', {
    lower: true,
  }).replace(/\./g, '__');
}
