# TypeScript Rewrite

This bot is currently - or was - being completely rewritten in TypeScript and Discord.js v13. The old code is honestly a huge mess and has a lot of inconsistencies and bad practices. There is still a pretty big amount of commands that are not currently in this version, some of which will still be added, and some of which will be scraped completely. The old code is still there under the [v1 branch](https://github.com/BaumianerNiklas/WaddleBot/tree/v1) (mainly for archival purposes for myself so I can keep track of commands that I could still bring over), however I think the "rewrite part" of the rewrite part can be considered done -- I will update this README again soon.

## Goals of the Rewrite

-   Switch from standard JS to TypeScript
-   Remove message commands entirely and use Interaction based slash commands
-   Integrate all of the new fancy Discord features like buttons and select menus
-   Enhance the command (and event) handler
    -   Switch to a class-based handler
    -   More intuitive and better handling of permissions, guild-only commands, etc
-   Be more consistent with the code
-   Remove redundant, useless or broken commands
-   Remove modifications of prototypes
-   Bring the Bot into more of a "Fun Bot" direction
    -   There are thousands of bots out there that already do all of the Utility and Moderation stuff, and that probably better than I could. Instead, I want to focus more on fun features like minigames you can play in discord, which the new Discord Features are perfect for.
-   Generally just make the bot more modern and better

## Contributing

-   If you for some reason stumbled upon this project and want to contribute, feel free to open a pull request or an issue!
