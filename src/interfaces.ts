// response from Twitter API v2: https://api.twitter.com/2/tweets/:id
// params:
// tweet.fields=attachments,author_id,conversation_id,created_at,entities,id,public_metrics,source,text
// media.fields=height,media_key,type,url,width
// user.fields=id,name,profile_image_url,username,verified
// expansions=author_id,entities.mentions.username,attachments.media_keys
export interface ITweet {
  id: string;
  text: string;
  source: string;
  created_at: string;
  attachments?: {
    media_keys: string[];
  };
  conversation_id: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  // put includes filed into tweet
  includes: {
    users: Array<{
      id: string;
      name: string;
      username: string;
      profile_image_url: string;
      verified: boolean;
      [key: string]: any;
    }>;
    media?: Array<{
      media_key: string;
      width: number;
      height: number;
      type: string;
      url: string;
      preview_image_url?: string;
    }>;
  };
  entities?: {
    hashtags: {
      start: number;
      end: number;
      tag: string;
    };
    mentions: Array<{
      start: number;
      end: number;
      username: string;
    }>;
    urls: Array<{
      start: number;
      end: number;
      url: string;
      display_url: string;
      unwound_url?: string; // only exist on external link
    }>;
  };
}

// response from timeline/conversation twitter api
export interface ITwitterTimelineResponse {
  globalObjects: {
    tweets: {
      [key: string]: {
        created_at: string;
        id_str: string;
        full_text: string;
        display_text_range: number[];
        user_id_str: string;
        retweet_count: number;
        favorite_count: number;
        reply_count: number;
        quote_count: number;
        conversation_id_str: string;
        source: string; // this is a tag as oppose to string text from twitter api
        entities: {
          hashtags?: Array<{
            text: string;
            indices: number[];
          }>;
          user_mentions?: Array<{
            screen_name: string;
            name: string;
            id_str: string;
            indices: number[];
          }>;
          urls?: Array<{
            url: string; // url return in full_text
            expanded_url: string;
            display_url: string;
            indices: number[];
          }>;
          media?: Array<{
            id_str: string;
            indices: number[];
            media_url_https: string;
            display_url: string;
            type: string;
            original_info: {
              width: number;
              height: number;
            };
          }>;
        };
        [key: string]: any;
      };
    };
    users: {
      [key: string]: {
        id_str: string;
        name: string;
        screen_name: string;
        profile_image_url_https: string;
        verified?: boolean;
      };
    };
  };
  [key: string]: any;
}

export interface ITwitterGuestActivateResponse {
  guest_token?: string;
}

export interface ITwitterErrorResponse {
  errors: Array<{
    code: number;
    message: string;
  }>;
}

export type IFetch = (url: RequestInfo, options?: RequestInit) => Promise<Response>;

export interface ITwitterOptions {
  fetch?: IFetch;
}
