import { formatPageIntoSection, parsePageId } from '../src/utils';
import notionHeaderData from './fixtures/notionSectionHeader.json';
import notionSubheaderData from './fixtures/notionSectionSubheader.json';

const id = '3957380a-c8f1-4187-beb0-e36105e08f85';
describe('Test parse ID', () => {
  it('can parse id from string', () => {
    expect(parsePageId('3957380ac8f14187beb0e36105e08f85')).toBe(id);
    expect(parsePageId(id)).toBe(id);
  });

  it('can parse id from notion URL', () => {
    expect(parsePageId('https://www.notion.so/tdloi/INDEX-3957380ac8f14187beb0e36105e08f85')).toBe(id);
    expect(
      parsePageId('https://www.notion.so/tdloi/3957380ac8f14187beb0e36105e08f85?v=6b9f1e3ff0364652a8ee2884df2b6931')
    ).toBe(id);
  });
});

describe('Test formatPageIntoSection', () => {
  const callback = (block: any) => {
    return block.properties?.title.flatMap((i: string[]) => i[0]).join('');
  };

  it('can format by header', () => {
    // @ts-ignore
    expect(formatPageIntoSection(notionHeaderData, 'header')).toMatchObject({
      header: {
        'ffa7f65a-d0e9-4458-92f8-f1b07dfdb8ab': {
          role: 'editor',
          value: {
            id: 'ffa7f65a-d0e9-4458-92f8-f1b07dfdb8ab',
            type: 'page',
            content: ['fbe084c9-436c-4ed6-8aee-756230038a84', '3574e724-8a8e-4795-bcca-53061cf83d10'],
          },
        },
        'fbe084c9-436c-4ed6-8aee-756230038a84': {
          role: 'editor',
          value: { type: 'text', properties: { title: [['Lorem ipsum dolor sit amet, consectetur adipiscing elit']] } },
        },
        '3574e724-8a8e-4795-bcca-53061cf83d10': {
          role: 'editor',
          value: {
            type: 'text',
            properties: {
              title: [
                ['Praesent', [['b']]],
                [' '],
                ['sit amet', [['i']]],
                [' '],
                ['diam eu metus', [['_']]],
                [' '],
                ['tincidunt eleifend', [['s']]],
              ],
            },
          },
        },
      },
      'header-1x': {
        'ffa7f65a-d0e9-4458-92f8-f1b07dfdb8ab': {
          role: 'editor',
          value: {
            id: 'ffa7f65a-d0e9-4458-92f8-f1b07dfdb8ab',
            type: 'page',
            content: ['5bb046d2-931f-4757-b693-729ae9f67ff0'],
          },
        },
        '5bb046d2-931f-4757-b693-729ae9f67ff0': {
          role: 'editor',
          value: {
            type: 'text',
            properties: { title: [['Lorem ipsum dolor sit amet, consectetur adipiscing elit']] },
          },
        },
      },
    });
  });

  it('can format by header with callback', () => {
    expect(
      // @ts-ignore
      formatPageIntoSection(notionHeaderData, 'header', { includePageBlock: false, callback: callback })
    ).toMatchObject({
      header: {
        'fbe084c9-436c-4ed6-8aee-756230038a84': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        '3574e724-8a8e-4795-bcca-53061cf83d10': 'Praesent sit amet diam eu metus tincidunt eleifend',
      },
      'header-1x': {
        '5bb046d2-931f-4757-b693-729ae9f67ff0': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      },
    });
  });

  it('can format by subheader', () => {
    // @ts-ignore
    expect(formatPageIntoSection(notionSubheaderData, 'sub_header')).toMatchObject({
      header: {
        'sub-header-1': {
          'ffa7f65a-d0e9-4458-92f8-f1b07dfdb8ab': {
            role: 'editor',
            value: {
              id: 'ffa7f65a-d0e9-4458-92f8-f1b07dfdb8ab',
              type: 'page',
              content: ['fbe084c9-436c-4ed6-8aee-756230038a84'],
            },
          },
          'fbe084c9-436c-4ed6-8aee-756230038a84': {
            role: 'editor',
            value: {
              type: 'text',
              properties: { title: [['Lorem ipsum dolor sit amet, consectetur adipiscing elit']] },
            },
          },
        },
      },
    });
  });
});
