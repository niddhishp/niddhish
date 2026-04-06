import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// One-time route to seed full essay content into rewritten posts
// Called once then this file is removed
const UPDATES = [
  {
    id: 'c03ab66f-2d0e-4567-b5d1-13d771960d1a',
    content: `## The Brief That Almost Made Me Quit

Every phone brief says the same thing.

Young. Aspirational. Premium. Show the camera. Show the screen. Show someone beautiful looking at something beautiful.

The brief for Vivo was no different. Except this time I decided to push back on what the word aspirational actually means — and what happened is why I still believe the most dangerous thing in advertising is a brief nobody questions.

## Why Aspirational Is the Laziest Word in Our Industry

When a client says aspirational, they usually mean: make my product look expensive. They are describing a visual aesthetic, not a psychological objective.

Aspiration is not a feeling. It is a cognitive state — specifically, the gap between where someone currently is and where they believe they could be. That gap has to be carefully calibrated. Too large, and the viewer disconnects. Too small, and there is no desire.

For this film, the target audience was urban Indians between 18 and 28 — aspirationally mobile, digitally native. The gap for them is almost never about wealth or status in the old sense. The question they are asking every time they pick up a phone is: does this reflect who I am trying to become?

That is a radically different brief. And it changes everything about how you shoot.

## The Shot That Changed the Film

We spent two days arguing about a single shot. Not a hero shot. Not the product reveal. A moment of the subject looking into the phone camera before pressing record — not after.

That pre-shoot pause. The intake of breath before becoming visible to the world.

My DOP thought it was indulgent. The client wanted more product time. I held the argument because I knew what that moment was doing psychologically: it was showing the viewer that this person also hesitates. Also composes themselves. Also chooses which version of themselves to present.

That shot created identification. And identification is the only real bridge between a product and a purchase decision.

## What Behind the Scenes Actually Means

Most behind-the-scenes content shows you the crane, the lights, the chaos. Equipment tourism.

The real behind-the-scenes of any film I make happens in the pre-production room, three weeks before we go to floor. That is where the psychological architecture gets built — where we decide what emotion we want to leave behind in the viewer, work backward to the stimulus that triggers it, and build every creative decision around that pathway.

The Vivo film worked not because of the locations, the grade, or the music. It worked because we decided — in that room, before a single camera was touched — that we were not making an aspirational film. We were making a self-recognition film.

Those are not the same thing. And the difference shows in every frame.`
  },
  {
    id: '580390e5-ea44-4770-b7ed-09d05d3bfc5c',
    content: `## Why Mundane Products Make the Best Films

A dryer is one of the least cinematic objects on earth.

No speed. No visual drama. No transformation you can see in sixty seconds. Just clothes going in, clothes coming out.

Which is exactly why the LG brief was interesting.

## The Problem With Functional Products

Most advertising for functional household products makes the same mistake: it tries to sell the function. Show the drum spinning. Show the digital display. Show the fabric emerging pristine.

This is the product manager thinking, not the filmmaker thinking.

The function of a product is table stakes. Nobody buys a dryer because it dries clothes. They buy a specific dryer because of the story they tell themselves about the kind of person who owns it.

That story is almost always emotional. And almost always rooted in a very specific moment from the past.

## The Brief I Wrote Before the Brief

Before I read the client brief in detail, I asked myself one question: what is the real reason someone would care about this machine in their home?

The answer that kept coming back was care. Specifically, the small domestic acts of care that do not announce themselves. The warm towel left on the rack. The shirt ironed and hung before anyone woke up. The coat dried in time for school.

A dryer is not a machine. It is a mechanism for expressing care without saying a word.

That was the film.

## Childhood as a Psychological Address

We chose to frame the film around the memory of warmth — the sensory memory of clothes that have been dried and folded, which for most Indian adults maps directly onto childhood, onto a parent, onto a domestic comfort that is almost impossible to replicate in adult life.

The viewer we were targeting was not a child. They were an adult who could afford a premium appliance and had a memory of being taken care of that they now wanted to replicate for the people they loved.

We were not selling nostalgia. We were selling the ability to create it.

## What Engineering Emotion Looks Like in Practice

The film has almost no dialogue. The camera movement is deliberate and slow — we chose a frame rate that mimicked the pace of memory rather than the pace of action. The sound design was built around textural warmth: fabric, light percussion, the ambient sounds of a home at rest.

Every decision was working backward from a psychological state we wanted the viewer to inhabit for thirty seconds after the film ended.

That is what emotional architecture means in practice. Not making people feel something. Engineering the conditions in which they feel something they already know how to feel — and associating that feeling, permanently, with a product.

The result was a film that had almost no product in it, and yet was entirely about the product.`
  },
  {
    id: '16c3f554-fdc5-4f43-a774-1ed68147c99b',
    content: `## The Wrong Argument

The argument for inclusive storytelling is almost always made on moral grounds.

Represent disabled voices because it is the right thing to do. Because your brand should stand for inclusion. Because the world is watching.

This is the weakest version of the argument. It puts inclusion in the category of brand values — something you signal rather than something that actually changes the film you make or the results it produces.

The behavioral case is far more compelling. And it starts with how identification actually works.

## The Identification Problem in Mainstream Advertising

When a viewer watches a brand film, they are subconsciously performing a continuous calculation: is this person like me? Could I be this person? Does this world include me?

When the answer is consistently no — when every aspirational figure in every brand film occupies the same narrow physical, demographic, and ability profile — the psychological effect is exclusion. Not just for the people who are visibly absent, but for everyone who does not fully fit the frame.

In India, where roughly 26 million people have a registered disability and hundreds of millions more fall outside the mainstream advertising archetype, this is not a niche consideration. It is a fundamental miscalculation about who your audience is.

## What I Have Seen on Set

I have directed over 200 commercials. The sets that produce the best performances are almost always the ones where the people in front of the camera are not performing a version of themselves they have been told is desirable. They are simply being themselves.

The gap between those two things is enormous. And the camera always knows which one it is getting.

When you cast a person with a disability in a role that is not about their disability — when they are simply the protagonist — something specific happens. A register of authenticity enters the frame that is very difficult to manufacture any other way.

Audiences feel it. They may not name it. But they feel it.

## The Behavioral Mechanics

Identity-based resonance works differently from emotional resonance. Emotional resonance is temporary — it peaks during viewing and decays. Identity resonance, when it lands, is self-reinforcing. The viewer returns to the brand because the brand returns something to them.

For brands I have worked with on inclusion strategy, the question I always ask first is: who in your target audience currently feels like a background character in your brand world? Because that person is not just an untapped audience. They are the person whose loyalty, when you earn it, is the most durable kind.

Inclusive storytelling is not charity work. It is a more accurate reading of who your audience is and what they need to feel before they trust you with their money.

The moral case and the behavioral case arrive at the same place. The behavioral case just gets there faster.`
  }
]

export async function GET() {
  const sb = getSupabaseAdmin()
  const results = []
  for (const u of UPDATES) {
    const { error } = await sb.from('blog_posts').update({ content: u.content }).eq('id', u.id)
    results.push({ id: u.id, ok: !error, error: error?.message })
  }
  return NextResponse.json({ results })
}
