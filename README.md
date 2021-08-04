# TypeScript Rewrite

This bot will be completely rewritten in TypeScript and Discord.js v13. The current code is honestly a huge mess and has a lot of inconsistencies. Some commands probably are broken by now.

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
