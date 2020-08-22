# Technical Decisions (August 22, 2020)
Here is a historical record of the technical design questions that came up and the decisions that were made.

## Platform release: Web Browser (August 22, 2020)
On which platform do I want to release this game on?
- Avoid installation so I can remove a roadblock
- Avoid OS features so I don't have to spend effort porting
- Avoid custom, paid for engines since I want more control over the engine

So I chose an HTML 5 browser-based game.

## Custom engine (August 22, 2020)
- I don't want to pay for an engine, I'd rather keep the game technically simple.
- I want the engine to be free while people pay for content. This is similar to DOOM, where the engine has been ported to every device imaginable because it is free.

I chose PhaserJS as the graphical backend because it's free to use.
This does mean I have to pay for a lot of up front technical work to make the engine.

## Separate engine from backend (August 22, 2020)
- If PhaserJS ever changed its license I want to change the backend easily.
- I want alternate displays (maybe text only for text readers?) so I can test.
- Hey, maybe a big player will show up and drop my engine into their framework. Make it easy for them.

So I decided to make a ViewState and then let the graphical engine handle the actual rendering.
Keep the graphics as dumb as possible.
This does increase technical cost because I have to be strict and add a translation layer.
