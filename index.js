const { Octokit } = require("@octokit/rest");

// Instantiate Octokit
const octokit = new Octokit({
  auth: "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",
});

const owner = "ideabrian";
const repo = "";

async function getScoreboard() {
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path: "scoreboard.json",
  });

  // Decode the content from base64
  const content = Buffer.from(data.content, "base64").toString();
  
  // Parse the JSON string into an object
  const scoreboard = JSON.parse(content);

  return scoreboard;
}

async function updateScoreboard(scoreboard) {
  // Stringify the object into a JSON string
  const content = JSON.stringify(scoreboard);

  // Encode the content into base64
  const base64content = Buffer.from(content).toString("base64");

  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path: "scoreboard.json",
  });

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: "scoreboard.json",
    message: "update",
    content: base64content,
    sha: data.sha,
  });
}

// Usage
(async function () {
  const scoreboard = await getScoreboard();
  console.log(scoreboard);

  scoreboard["new player"] = 100;
  await updateScoreboard(scoreboard);

  console.log(await getScoreboard());
})();
