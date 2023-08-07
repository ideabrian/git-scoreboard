const { Octokit } = require("@octokit/rest");

// Instantiate Octokit
const octokit = new Octokit({
  auth: "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",
});

const owner = "ideabrian";
const repo = "git-scoreboard";

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



async function increaseScore(player, increment) {
    const scoreboard = await getScoreboard();
    
    // If the player doesn't exist, initialize with the increment value
    // If the player exists, add the increment value to the current score
    scoreboard[player] = scoreboard[player] ? scoreboard[player] + increment : increment;
    
    await updateScoreboard(scoreboard);
  }
  
  async function decreaseScore(player, decrement) {
    const scoreboard = await getScoreboard();
    
    // If the player doesn't exist, initialize with the negative of decrement value
    // If the player exists, subtract the decrement value from the current score
    scoreboard[player] = scoreboard[player] ? scoreboard[player] - decrement : -decrement;
    
    await updateScoreboard(scoreboard);
  }

// Usage
(async function () {
  const scoreboard = await getScoreboard();
  console.log(scoreboard);

  scoreboard["Brian"] = 100;
  await updateScoreboard(scoreboard);

  console.log(await getScoreboard());
})();
