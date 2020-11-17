import {
  ITweet,
  ITwitterTimelineResponse,
  ITwitterOptions,
  ITwitterGuestActivateResponse,
  ITwitterErrorResponse,
  IFetch,
} from './interfaces';
import LRU from 'lru-cache';
import qs from 'querystring';
import { dayjs } from './utils';

export function getTweetId(url: string): string {
  if (url.endsWith('/')) {
    url = url.substr(0, url.length - 1);
  }
  return url.substr(url.lastIndexOf('/') + 1);
}

const cache = new LRU<string, string>({ maxAge: 3 * 60 * 1000 });
const guestTokenCacheKey = 'twitter::guest-token';
export async function fetchTweet<T>(tweetId: string, options?: ITwitterOptions): Promise<T> {
  const token =
    options?.token ??
    'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
  let guestToken = cache.get(guestTokenCacheKey);
  const _fetch: NonNullable<ITwitterOptions['fetch']> = options?.fetch ?? require('node-fetch');

  if (guestToken == null) {
    guestToken = await _fetch('https://api.twitter.com/1.1/guest/activate.json', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    })
      .then((res) => res.json())
      .then((res: ITwitterGuestActivateResponse) => {
        if (res.guest_token != null) {
          cache.set(guestTokenCacheKey, res.guest_token, options?.cacheMaxAge);
          return res.guest_token;
        }
        throw res;
      })
      .catch((err: ITwitterErrorResponse) => {
        throw new Error(err.errors.map((e) => `${e.code}: ${e.message}`).join('\n'));
      });
  }
  const params = {
    tweet_mode: 'extended',
    include_blocking: '1',
    include_reply_count: '1',
    include_quote_count: '1',
    include_followed_by: '1',
    include_blocked_by: '1',
    include_user_entities: 'true',
    include_entities: 'true',
    send_error_codes: 'true',
    count: '20',
    ...(options?.params || {}),
  };
  const tweet = await fetch(`https://api.twitter.com/2/timeline/conversation/${tweetId}.json?` + qs.stringify(params), {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-guest-token': guestToken ?? '',
    },
  }).then((res) => {
    const limit = res.headers.get('x-rate-limit-remaining') ?? 0;
    if (limit < 20) {
      cache.del(guestTokenCacheKey);
    }

    return res.json();
  });

  return tweet;
}

export async function getTweet(url: string, options?: ITwitterOptions): Promise<ITweet> {
  const tweetId = getTweetId(url);
  const res = await fetchTweet<ITwitterTimelineResponse>(tweetId, options);
  return formatTweet(res, tweetId);
}

export async function getTweets(
  url: string,
  options?: ITwitterOptions & { limit?: number }
): Promise<Array<ITweet & { reply_to?: string }>> {
  let limit = options?.limit ?? 7;
  const tweetId = getTweetId(url);
  let timelines = await fetchTweet<ITwitterTimelineResponse>(tweetId, options);
  let cursor = getCursor(timelines.timeline);
  while (cursor != undefined && limit > 0) {
    const res = await fetchTweet<ITwitterTimelineResponse>(tweetId, { ...options, params: { cursor: cursor } });
    cursor = getCursor(res.timeline);
    limit -= 1;
    timelines = {
      globalObjects: {
        tweets: {
          ...timelines.globalObjects.tweets,
          ...res.globalObjects.tweets,
        },
        users: {
          ...timelines.globalObjects.users,
          ...res.globalObjects.users,
        },
      },
      timeline: res.timeline,
    };
  }

  return Object.keys(timelines.globalObjects.tweets)
    .filter((id) => id !== tweetId)
    .map((tweetID) => formatTweet(timelines, tweetID))
    .map((tweet) => {
      if (tweet.referenced_tweets?.[0]) {
        tweet.reply_to = tweet.referenced_tweets[0].id;
      }
      return tweet;
    })
    .sort((a, b) => dayjs(b.created_at).diff(a.created_at));
}

function getCursor(timeline: ITwitterTimelineResponse['timeline']) {
  return timeline.instructions[0].addEntries.entries.find((e) => e.content?.operation?.cursor?.cursorType === 'Bottom')
    ?.content?.operation?.cursor?.value;
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

  if (tweet?.entities?.media) {
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

  if (tweet.in_reply_to_status_id_str) {
    formattedTWeet['referenced_tweets'] = [{ id: tweet.in_reply_to_status_id_str, type: 'replied_to' }];
  }

  return formattedTWeet;
}

export const proxyFetch = (proxyURL: string, _fetch: IFetch = require('node-fetch')) => (
  url: RequestInfo,
  body?: RequestInit
) => {
  return _fetch(proxyURL, {
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      url: url,
      body: body,
    }),
    method: 'POST',
  });
};
