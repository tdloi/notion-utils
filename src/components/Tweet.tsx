/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { ITweet } from '../interfaces';
import { dayjs } from '../utils';

type TweetColorOptions = {
  text?: string;
  textAlt?: string;
  badge?: string;
};

interface IProps {
  tweet: ITweet;
  variant: 'light' | 'dark';
  options?: TweetColorOptions;
}

function renderMedia(tweetMedia: NonNullable<ITweet['includes']['media']>[0]) {
  let url = tweetMedia.preview_image_url;
  if (!url) {
    url = tweetMedia.url;
  }

  return (
    <div
      className="tweet-image"
      css={{
        overflow: 'hidden',
        marginBottom: '1rem',
        maxHeight: '300px',
      }}
    >
      <img css={{ width: '100%', height: 'auto' }} src={url} width={tweetMedia.width} height={tweetMedia.height} />
    </div>
  );
}

const defaultOptions = {
  light: {
    text: 'black',
    badge: 'rgb(75, 185, 253)',
    textAlt: '#333',
  },
  dark: {
    text: '#d2d0d0',
    badge: 'white',
    textAlt: '#838383',
  },
};
export function Tweet({ tweet, variant, options }: IProps) {
  const colors = {
    ...defaultOptions[variant],
    ...options,
  };

  return (
    <div
      css={{
        maxWidth: '480px',
        minWidth: '300px',
        marginBottom: '1rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '0.5rem 1rem',
        border: `solid 1px ${colors.textAlt}`,
      }}
      className="tweet-container"
    >
      <div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div css={{ display: 'flex' }}>
          <div css={{ display: 'inline-flex' }}>
            <img
              src={tweet.includes.users[0].profile_image_url}
              alt="tweet profile image"
              css={{ borderRadius: '50%', maxWidth: '48px', height: 'auto', margin: 'auto' }}
            />
          </div>
          <div css={{ display: 'flex', flexFlow: 'column', marginLeft: '1rem' }}>
            <span css={{ display: 'flex', width: '100%' }}>
              <span css={{ color: colors.text }}>{tweet.includes.users[0].name}</span>
              {tweet.includes.users[0].verified && (
                <span css={{ display: 'inline-flex', marginLeft: '0.2rem' }}>
                  <svg
                    fill={colors.badge}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    width="22px"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </span>
              )}
            </span>
            <a
              css={{ color: colors.text }}
              href={`https://twitter.com/${tweet.includes.users[0].username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              <span className="screen-name">@{tweet.includes.users[0].username}</span>
            </a>
          </div>
        </div>
        <a
          css={css`
            display: inline-block;
            color: ${colors.text};
          `}
          href={`https://twitter.com/${tweet.includes.users[0].username}/status/${tweet.conversation_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="25px">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
      <div
        css={{ color: colors.text }}
        dangerouslySetInnerHTML={{
          __html: tweet.text,
        }}
        className="tweet-content"
      ></div>
      {tweet.includes.media && renderMedia(tweet.includes.media[0])}
      <div
        css={css`
          display: flex;
          justify-content: space-between;

          @media (max-width: 480px) {
            & {
              flex-flow: column;
            }
          }
        `}
        className="tweet-footer"
      >
        <div
          css={css`
            display: flex;
            color: ${colors.text};
            & span {
              margin-right: 1rem;
              display: inline-flex;
            }
            & span svg {
              margin-right: 0.2rem;
            }
          `}
        >
          <span>
            <svg
              css={{ width: '20px' }}
              className="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>{' '}
            {tweet.public_metrics.like_count}
          </span>
          <span>
            <svg
              css={{ width: '20px' }}
              className="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>{' '}
            {tweet.public_metrics.reply_count}
          </span>
        </div>
        <span
          css={css`
            font-size: 0.9rem;
            color: ${colors.text};
          `}
          className="tweet-date"
        >
          {' '}
          {dayjs(tweet.created_at).format('DD MMM, YYYY')}
        </span>
      </div>
    </div>
  );
}
