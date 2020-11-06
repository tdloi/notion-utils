import { ITweet, ITwitterTimelineResponse } from './interfaces';
import LRU from 'lru-cache';

export function getTweetId(url: string): string {
  return url.substr(url.lastIndexOf('/') + 1);
}

const cache = new LRU<string, string>({ maxAge: 3 * 60 * 60 });
const guestTokenCacheKey = 'twitter::guest-token';
export async function fetchTweet<T>(tweetId: string, token: string): Promise<T> {
  let guestToken = cache.get(guestTokenCacheKey);
  if (guestToken == null) {
    guestToken = await fetch('https://api.twitter.com/1.1/guest/activate.json', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    })
      .then((res) => res.json())
      .then((res) => {
        if ('guest_token' in res) {
          cache.set(guestTokenCacheKey, res.guest_token);
          return res.guest_token;
        }
        throw new Error('Could not get GUEST TOKEN');
      });
  }
  const tweet = await fetch(
    `https://api.twitter.com/2/timeline/conversation/${tweetId}.json?` +
      new URLSearchParams({
        tweet_mode: 'extended',
        include_reply_count: '1',
        include_quote_count: '1',
        include_user_entities: 'true',
      }),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-guest-token': guestToken ?? '',
      },
    }
  ).then((res) => res.json());

  return tweet;
}

export async function getTweet(url: string, token: string): Promise<ITweet> {
  const tweetId = getTweetId(url);
  const res = await fetchTweet<ITwitterTimelineResponse>(tweetId, token);
  return formatTweet(res, tweetId);
}

export function formatTweet(res: ITwitterTimelineResponse, tweetId: string): ITweet {
  const tweet = res.globalObjects.tweets[tweetId];
  const user = res.globalObjects.users[tweet['user_id_str']];
  user.verified = user.verified === true;

  const formattedTWeet = {
    id: tweet.id_str,
    created_at: tweet.created_at,
    text: tweet.full_text,
    source: tweet.source,
    conversation_id: tweet.conversation_id_str,
    public_metrics: {
      like_count: tweet.favorite_count,
      quote_count: tweet.quote_count,
      reply_count: tweet.reply_count,
      retweet_count: tweet.retweet_count,
    },
    includes: {
      users: [
        {
          id: user.id_str,
          name: user.name,
          username: user.screen_name,
          profile_image_url: user.profile_image_url_https,
          verified: user.verified,
        },
      ],
    },
  } as ITweet;

  if (tweet.entities.media) {
    const media = tweet.entities.media[0];
    formattedTWeet['includes']['media'] = [
      {
        media_key: media?.id_str,
        width: media?.original_info.width,
        height: media?.original_info.height,
        type: media.type,
        url: media?.media_url_https,
      },
    ];
  }

  return formattedTWeet;
}
