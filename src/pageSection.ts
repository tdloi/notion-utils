import { Block, BlockMap, Decoration } from 'notion-types';
import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';

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
          getProperty(blocks, `${title}.${pageId}.value.content`, []).concat(key)
        );
      }
    }
  }

  return blocks;
}

function getTitleText(title: Decoration[]) {
  return (title.flatMap((i) => i[0]).join('') ?? '').toLowerCase().replace(/ /g, '-').replace(/\./g, '__');
}

function getProperty(object: any, prop: string, fallback: any) {
  const props = prop.split('.');
  return props.reduce((prev, curr) => {
    return prev?.[curr] ?? fallback;
  }, object);
}
