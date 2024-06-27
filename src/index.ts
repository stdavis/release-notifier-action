import * as core from '@actions/core';
import * as github from '@actions/github';
import issueParser from 'issue-parser';

const parse = issueParser('github');

async function run() {
  try {
    const currentRelease = process.env.ACT
      ? {
          name: 'act test release',
          target_commitish: 'main',
          prerelease: true,
        }
      : github.context.payload.release;
    core.info(`current release: ${currentRelease?.name}`);
    const releaseCommit = currentRelease?.target_commitish;
    core.info(`release commit: ${releaseCommit}`);

    // get the last tag
    const octokit = github.getOctokit(core.getInput('repo-token'));

    const repo = process.env.ACT
      ? {
          // for testing locally with act
          owner: 'agrc',
          repo: 'release-notifier-action',
        }
      : {
          owner: github.context.payload.repository?.owner.login,
          repo: github.context.payload.repository?.name,
        };

    if (!repo.owner || !repo.repo) {
      throw new Error('Could not determine repository owner and name');
    }
    core.info(`repo: ${repo.owner}/${repo.repo}`);

    // get previous release (taking into account prereleases)
    const { data: releases } = await octokit.rest.repos.listReleases({
      owner: repo.owner,
      repo: repo.repo,
    });

    core.info(
      `releases: ${releases.map((release) => release.name).join(', ')}`,
    );
    const lastRelease = releases.find(
      (release) => release.prerelease === currentRelease.prerelease,
    );
    core.info(`last release: ${lastRelease?.name}`);
    const lastReleaseCommit = lastRelease?.target_commitish;

    if (!lastReleaseCommit) {
      throw new Error('Could not determine last release commit');
    }
    core.info(`last release commit: ${lastReleaseCommit}`);

    // get list of commit messages from git between release tags
    const { data: commits } = await octokit.rest.repos.compareCommits({
      owner: repo.owner,
      repo: repo.repo,
      base: lastReleaseCommit,
      head: releaseCommit,
    });

    // parse commit message to get list of issue/PR numbers
    const issues = commits.commits
      .map((commit) => parse(commit.commit.message))
      .flat()
      .map((parsed) => parsed.actions.close.map((close) => close.issue))
      .flat();

    core.info(`issues: ${issues.join(', ')}`);

    // post message to GitHub issue/PRs
    for (const issue of issues) {
      await octokit.rest.issues.createComment({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: parseInt(issue),
        body: `This issue has been resolved in [${releaseCommit}]`,
      });
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
