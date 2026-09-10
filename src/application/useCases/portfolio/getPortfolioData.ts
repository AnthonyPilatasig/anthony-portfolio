import { portfolioData } from '@infrastructure/data/portfolio.data';

/**
 * The portfolio's source-of-truth data is a static local seed today rather than a
 * remote resource, but presentation still goes through this use case instead of
 * reaching into infrastructure/data directly, so the data source can change later
 * (e.g. a CMS) without touching every page.
 */
export const getPortfolioData = () => portfolioData;
