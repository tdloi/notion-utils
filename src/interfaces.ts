import { PageChunk } from 'notion-types';

// response from Twitter API v2: https://api.twitter.com/2/tweets/:id
// params:
// tweet.fields=attachments,author_id,conversation_id,created_at,entities,id,public_metrics,source,text
// media.fields=height,media_key,type,url,width
// user.fields=id,name,profile_image_url,username,verified
// expansions=author_id,entities.mentions.username,attachments.media_keys,referenced_tweets.id
export interface ITweet {
  id: string;
  text: string;
  source: string;
  created_at: string;
  attachments?: {
    media_keys: string[];
  };
  conversation_id: string;
  referenced_tweets?: Array<{
    type: 'replied_to' | 'quoted';
    id: string;
  }>;
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
  [key: string]: any;
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
        in_reply_to_status_id_str: string;
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
  timeline: {
    id: string;
    instructions: [
      {
        addEntries: {
          entries: Array<{
            entryId: string;
            sortIndex: string;
            content: {
              operation?: {
                cursor: {
                  value: string;
                  cursorType: 'Bottom';
                };
              };
              item?: {
                // unuse
                content: {
                  tweet?: {
                    id: string;
                    displayType: 'SelfThread';
                    hasModeratedReplies: boolean;
                  };
                };
              };
              timelineModules?: {}; // unuse
            };
          }>;
        };
      }
    ];
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

export type ITwitterOptions = {
  token?: string;
  cacheMaxAge?: number;
  fetch?: IFetch;
  params?: {
    include_blocking?: '0' | '1';
    include_blocked_by?: '0' | '1';
    include_followed_by?: '0' | '1';
    include_quote_count?: '0' | '1';
    include_reply_count?: '0' | '1';
    include_entities?: 'true' | 'false';
    include_user_entities?: 'true' | 'false';
    send_error_codes?: 'true' | 'false';
    tweet_mode?: 'extended';
    count?: string;
    cursor?: string;
    [key: string]: any;
  };
};

export type IGetPageOptions = {
  notionToken?: string;
  fetch?: IFetch;
};

export interface NotionAPIError {
  errorId: string;
  name: string;
  message: string;
}

export interface NotionPageChunk extends PageChunk {
  errorId: undefined;
  [key: string]: any;
}
