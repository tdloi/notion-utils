import { parsePageId } from '../src/utils';

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
