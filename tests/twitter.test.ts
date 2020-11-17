import { formatTweet, getTweetId } from '../src/twitter';
import twitterTimelineData from './fixtures/twitterTimeline.json';

describe('Test twitter helper', () => {
  it('can get twitter id', () => {
    expect(getTweetId('https://twitter.com/jack/status/20')).toBe('20');
    expect(getTweetId('https://twitter.com/jack/status/20/')).toBe('20');
  });

  it('can format data', () => {
    // @ts-ignore
    expect(formatTweet(twitterTimelineData, '798284925765971968')).toMatchObject({
      id: '798284925765971968',
      text: 'Which side do you choose? Dark or Light theme? https://t.co/uXRnu20T2b',
      // TODO: Extract innerText
      source: '<a href="https://about.twitter.com/products/tweetdeck" rel="nofollow">TweetDeck</a>',
      public_metrics: {
        retweet_count: 152,
        reply_count: 10000,
        like_count: 180100,
        quote_count: 110,
      },
      includes: {
        media: [
          {
            url: 'https://pbs.twimg.com/media/CxQTuCMUUAEwN_t.jpg',
            width: 650,
            // no idea why v2 api append 3_ for media_key?
            // e.g. 3_798284715534864385
            media_key: '798284715534864385',
            type: 'photo',
            height: 506,
          },
        ],
        users: [
          {
            profile_image_url: 'https://pbs.twimg.com/profile_images/1324044062890942464/B_osBEcZ_normal.jpg',
            name: 'Discord',
            verified: true,
            username: 'discord',
            id: '3065618342',
          },
        ],
      },
    });
  });
});
