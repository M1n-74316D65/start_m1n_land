# Tilde

Tilde is a minimal browser homepage for pro web surfers.

## Usage

**To go to a site**, type the corresponding key and press <kbd>Enter</kbd>.

e.g. `g` <kbd>Enter</kbd> will redirect you to [git.sr.ht](https://git.sr.ht)

**To search a site**, type a space after the site&rsquo;s key followed by your
query.

e.g. `y kittens` <kbd>Enter</kbd> will
[search YouTube for kittens](https://www.youtube.com/results?search_query=kittens)

**If your input doesn&rsquo;t match a key**, a DuckDuckGo search will be
triggered.

e.g. `google` <kbd>Enter</kbd> will
[search DuckDuckGo for google](https://duckduckgo.com/?q=google)

**To go to a specific path on a site**, type the path after the site&rsquo;s
key.

e.g. `r/r/selfhosted` <kbd>Enter</kbd> will redirect you to
[reddit.com/r/selfhosted](https://www.reddit.com/r/selfhosted)

**To access any other site**, enter the URL directly.

e.g. `example.com` <kbd>Enter</kbd> will redirect you to
[example.com](https://example.com)

## Beyond

Tilde is meant to be customized&mdash;[make it yours!](index.html)

## Deployment

GitHub Actions builds and deploys to pgs.sh on pushes to `main`. You can also
run the Deploy workflow manually from the Actions tab.

Before the first deployment, add a GitHub Actions secret named `SSH_DEPLOY_KEY`
containing the SSH private key whose public key is registered with the pico.sh
account that owns the site. SourceHut secrets do not transfer to GitHub.

The workflow installs dependencies with Bun, builds `dist/`, uploads a
commit-suffixed release, and promotes it to `start-m1n-land` at
https://start.m1n.land. It retains the three latest releases.

## License

Use and modify Tilde [as you see fit](UNLICENSE).
