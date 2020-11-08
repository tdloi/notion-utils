/** @jsx jsx */
import 'modern-normalize/modern-normalize.css';
import { jsx, css, Global } from '@emotion/core';
import { cloneDeep } from 'lodash';
import { ReactScreenshotTest } from 'react-screenshot-test';
import twitterTimelineData from './fixtures/twitterTimeline.json';
import { Tweet } from '../src/components/Tweet';
import { ITwitterTimelineResponse } from '../src/interfaces';
import { formatTweet } from '../src/twitter';

let tweetWithoutMedia: ITwitterTimelineResponse = cloneDeep(twitterTimelineData);
tweetWithoutMedia.globalObjects.tweets['798284925765971968'].entities = {};

const style = css`
  line-height: 1.5rem;
  padding: 2rem;
`;

ReactScreenshotTest.create('Tweet')
  .viewport('Desktop', {
    width: 1024,
    height: 800,
  })
  .viewport('iPhoneX', {
    width: 375,
    height: 500,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    isLandscape: false,
  })
  .shoot(
    'light-theme',
    <div css={style}>
      <Tweet tweet={formatTweet(twitterTimelineData, '798284925765971968')} variant="light" />
    </div>
  )
  .shoot(
    'dark-theme',
    <div css={style}>
      <Global styles={{ body: { background: '#12141c' } }} />
      <Tweet tweet={formatTweet(twitterTimelineData, '798284925765971968')} variant="dark" />
    </div>
  )
  .shoot(
    'without-media',
    <div css={style}>
      <Tweet tweet={formatTweet(tweetWithoutMedia, '798284925765971968')} variant="light" />
    </div>
  )
  .run();
