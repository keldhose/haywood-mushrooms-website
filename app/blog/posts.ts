export type PostBlock = { type: "p" | "h2"; text: string };

export type Post = {
  title: string;
  description: string;
  tag: string;
  readTime: string;
  featured?: boolean;
  body: PostBlock[];
};

export const posts: Record<string, Post> = {
  "contamination-is-a-diagnosis": {
    title: "Contamination is a diagnosis, not bad luck",
    description:
      "Green mold, wet spots, sour smells — most \"failed\" grows are telling you exactly what went wrong. Here's how a plant pathologist reads the signs, traces them back to the break in sterile technique, and fixes the cause instead of the symptom.",
    tag: "Sterile technique",
    readTime: "8 min read",
    featured: true,
    body: [
      {
        type: "p",
        text: "Every grower who's opened a bag to green dust or a sour, wet smell has had the same thought: bad luck. It wasn't. Contamination is not a random event that happens to otherwise-perfect technique — it's a symptom with a cause, and the cause is almost always identifiable if you're willing to look at it the way a pathologist looks at a sick plant instead of the way a grower looks at a ruined bag.",
      },
      {
        type: "h2",
        text: "Read the symptoms like a pathologist",
      },
      {
        type: "p",
        text: "Different contaminants tell different stories. Fast-spreading green or blue-green dust is almost always Trichoderma — aggressive, airborne, and usually a sign that something was open to room air for too long during a transfer. A sour, fermented smell without visible mold points to bacterial contamination, usually from excess moisture or a substrate that wasn't fully sterilized. Black pin-sized dots are frequently Aspergillus or other airborne molds that settled during cooling. The point isn't to memorize a contaminant catalog — it's to notice that the type of contamination is data about the moment it got in.",
      },
      {
        type: "h2",
        text: "Trace it back to the break",
      },
      {
        type: "p",
        text: "Sterile technique is a chain, and contamination means one link failed. Work backward through the chain in order: Was the substrate actually held at temperature and duration long enough to sterilize, or just long enough to look done? Was the workspace still-air or flowing air, and was it clean before you started? Was the transfer fast, or did the culture sit open while you fumbled with a lid? Did the incubation environment stay within a safe temperature range, or did a warm spell give competing organisms an edge? Most contamination traces to one of these four places, and once you know which one, you've found the actual problem — not just this bag's problem, but the one that will keep happening until you fix it.",
      },
      {
        type: "h2",
        text: "Fix the cause, not the symptom",
      },
      {
        type: "p",
        text: "It's tempting to respond to contamination by being generally more careful next time. That rarely works, because \"careful\" isn't a technique — a specific, corrected step is. If your sterilization run was borderline, extend the hold time or check your pressure cooker's actual temperature rather than trusting the dial. If your transfers are slow, practice the motion empty-handed until it's fast enough that a culture is never open to room air for more than a few seconds. If your incubation space swings with the weather, add a thermometer and control for it directly. Treat each contamination event as a diagnosis rather than a disappointment, and your contamination rate becomes something you can actually drive down — because you're no longer troubleshooting luck.",
      },
    ],
  },
  "sterile-technique-that-actually-holds": {
    title: "Sterile technique that actually holds",
    description:
      "The handful of habits that prevent most contamination — airflow, surfaces, and the order you do things in.",
    tag: "Basics",
    readTime: "6 min read",
    body: [
      {
        type: "p",
        text: "Sterile technique gets talked about like a mysterious skill, but it's really a small set of habits, done in the right order, every single time. Growers who keep contamination low aren't more careful in some abstract sense — they've just removed the moments where the environment gets a chance to compete with their culture.",
      },
      {
        type: "h2",
        text: "Where contamination actually gets in",
      },
      {
        type: "p",
        text: "Almost all contamination enters during a handful of specific windows: opening a culture vessel, transferring tissue or spawn between containers, and the seconds right after inoculation before a bag or jar is sealed. Everything else — your grow room, your storage shelf, your gloves — matters far less than what happens in those short windows. That's good news, because it means sterile technique isn't about sterilizing your whole environment; it's about controlling a few seconds at a time, consistently.",
      },
      {
        type: "h2",
        text: "The habits that matter most",
      },
      {
        type: "p",
        text: "Work in still air, not moving air — a draft carries spores into an open vessel faster than almost anything else, so a still-air box or a closed room with no fans running beats an open bench every time. Wipe down every surface and tool that will be near an open culture with isopropyl alcohol immediately before you start, not at the beginning of the day. Keep transfers fast: have everything staged and ready before you open anything, so a culture is exposed to open air for the shortest possible time. And work near a flame or in the sterile field closest to your air source first, saving anything less critical for last, since air quality degrades the longer you work.",
      },
      {
        type: "h2",
        text: "A simple pre-flight routine",
      },
      {
        type: "p",
        text: "Before touching a single culture, run the same short routine every time: clean the workspace, stage every tool and container you'll need in reach, sanitize your hands and gloves, and only then open anything. Growers who contaminate rarely fail because they didn't know the theory — they fail because they skipped a step under time pressure. Making the routine identical every time removes the decision-making that leads to skipped steps, which is the real reason sterile technique holds up for some growers and not others.",
      },
    ],
  },
  "choosing-a-substrate-for-your-strain": {
    title: "Choosing a substrate for your strain",
    description:
      "Straw, hardwood, supplemented masters — matching the medium to the mushroom, and why it changes your yield.",
    tag: "Substrate",
    readTime: "7 min read",
    body: [
      {
        type: "p",
        text: "Substrate choice is where a lot of new growers underperform without realizing it — not because their technique is bad, but because they're growing the right mushroom on the wrong medium. Every strain evolved to break down a particular kind of wood or plant fiber, and matching that biology is most of what separates a modest flush from a heavy one.",
      },
      {
        type: "h2",
        text: "Straw, hardwood, or supplemented",
      },
      {
        type: "p",
        text: "Straw is fast, cheap, and forgiving — oysters colonize it aggressively and it's the right starting point for growers optimizing for speed and volume over maximum yield per bag. Hardwood sawdust, often supplemented with bran or soy hull to add nitrogen, colonizes more slowly but tends to hold more energy per unit volume, which matters for strains that fruit heavier or need more reserves to push out dense clusters. Supplemented \"master\" mixes — hardwood plus a nitrogen source at a carefully controlled ratio — sit at the high-input, high-output end: better yields and more flushes, but a higher contamination risk if the extra nutrients aren't paired with correspondingly careful sterilization.",
      },
      {
        type: "h2",
        text: "Matching substrate to strain biology",
      },
      {
        type: "p",
        text: "Oyster strains are among the least picky — most will run well on straw, hardwood, or supplemented masters, which is part of why they're the standard starting point for new growers. Lion's Mane and shiitake are different: both are genuine wood decomposers that evolved on hardwood, and both perform noticeably better on supplemented hardwood than on straw, often the difference between a thin, delayed flush and a full one. Substrate choice is one of the few variables that's nearly free to get right — it costs nothing extra to pick the medium a strain actually evolved to eat.",
      },
      {
        type: "h2",
        text: "What substrate choice does to your yield",
      },
      {
        type: "p",
        text: "The practical effect shows up in three places: how fast colonization finishes, how many flushes you get before the substrate is exhausted, and how large individual fruits grow. A mismatched substrate doesn't usually stop a mushroom from growing at all — it just grows slower, smaller, and for fewer cycles, which is why it's easy to blame genetics or technique instead of the medium. Before troubleshooting a disappointing harvest, it's worth asking a simpler question first: was this strain ever meant to grow on what I fed it?",
      },
    ],
  },
  "reading-colonization-like-a-chart": {
    title: "Reading colonization like a chart",
    description:
      "What healthy mycelium looks, smells, and moves like — and the early warning signs worth acting on.",
    tag: "Colonization",
    readTime: "6 min read",
    body: [
      {
        type: "p",
        text: "Colonization is the part of a grow most people watch the least, because nothing dramatic seems to be happening. That's a mistake — colonization is where nearly every problem first shows up, days before it's obvious, if you know what you're actually looking at.",
      },
      {
        type: "h2",
        text: "What healthy colonization looks like day by day",
      },
      {
        type: "p",
        text: "Healthy mycelium advances from the inoculation points outward in a roughly even front — you should be able to watch the white edge move day over day, not stall and restart. It stays dense and opaque rather than thin and wispy, and the smell stays neutral to mildly earthy or mushroom-like, never sour, never sharp. By the midpoint of expected colonization time, roughly half the visible substrate should be covered evenly; if one section is racing ahead while another hasn't started, that unevenness is itself worth investigating rather than ignoring.",
      },
      {
        type: "h2",
        text: "The early warning signs worth acting on",
      },
      {
        type: "p",
        text: "A sour or fermented smell during colonization, even with no visible mold yet, usually means bacterial activity from excess moisture — it will not resolve on its own and tends to get worse. Green, black, or blue-green patches are visible contamination and should be isolated immediately, not \"watched\" for a few more days. Mycelium that stalls completely — no advancing edge for several days in a row with no new growth — is often a sign the substrate was too wet, too dry, or the culture was weak going in, and it rarely recovers into a strong flush even if it eventually resumes.",
      },
      {
        type: "h2",
        text: "When to trust it, when to toss it",
      },
      {
        type: "p",
        text: "Not every imperfection means the bag is lost. A slightly uneven front, a small patch of yellow metabolite staining, or a slower-than-expected start with an otherwise dense, advancing front are all within normal range and usually resolve into a fine harvest. What doesn't recover is anything with a bad smell, active contamination, or a fully stalled front with no colonization progress for a week or more. Learning to tell those two categories apart — normal variation versus an actual failure — is most of what \"experience\" means in mushroom cultivation, and it's a skill built entirely by watching colonization closely instead of just waiting for it to finish.",
      },
    ],
  },
};
