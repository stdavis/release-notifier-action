import core from '@actions/core'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // get tag of the current release
    // get previous release (taking into account prereleases)
    // get list of commit messages from git between release tags
    // parse commit message to get list of issue/PR numbers
    // post message to GitHub issue/PRs
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
