# SIP&GO Question Fixes Summary

## Overview
Fixed questions that contained logical inconsistencies where the same `${player}` variable was used twice inappropriately, making the questions impossible or nonsensical to execute.

## Issues Addressed
The main issue was questions where a single player was expected to interact with themselves, which doesn't make sense in the context of a multiplayer drinking game.

## Files Modified

### 1. `assets/questions/classic.en.json`
**Fixed Questions:**
- **c91**: Changed from player being their own parrot to choosing someone else to be their parrot
  - Before: `"${player}, you're ${player}'s parrot now. Repeat everything they say, otherwise 2 penalties."`
  - After: `"${player}, choose someone to be your parrot. They must repeat everything you say for 2 rounds, otherwise 2 penalties."`

- **c113**: Changed from hating yourself to hating someone else
  - Before: `"${player}, tell us something you hate about ${player}. Otherwise, 2 penalties."`
  - After: `"${player}, tell us something you hate about someone here. Otherwise, 2 penalties."`

### 2. `assets/questions/guys.en.json`
**Fixed Questions:**
- **gy30**: Changed from guessing your own mental choice to having someone else guess
  - Before: `"${player} mentally chooses rock, paper, or scissors. ${player} tries to guess what it is. If wrong, both drink."`
  - After: `"${player} mentally chooses rock, paper, or scissors. The person to your right tries to guess what it is. If wrong, both drink."`

### 3. `assets/questions/girls.en.json`
**Fixed Questions:**
- **g10**: Changed from showing yourself a photo to showing the group
- **g15**: Changed from sharing beauty tip with yourself to sharing with someone else
- **g17**: Changed from judging your own skincare routine to group judgment
- **g19**: Changed from disagreeing with yourself to someone else disagreeing
- **g23**: Changed from sharing dating red flag with yourself to sharing with someone else
- **g25**: Changed from checking your own social media to letting someone else check
- **g28**: Changed from telling yourself about hair disaster to telling someone else
- **g30**: Changed from guessing your own fashion brand to guessing someone else's

### 4. `assets/questions/spicy.en.json`
**Fixed Questions (17 total):**
- **c7**: Give massage to someone else instead of yourself
- **c8**: Whisper fantasy to someone else instead of yourself
- **c13**: Recreate scene with someone else instead of yourself
- **c15**: Ask someone else a question instead of yourself
- **c16**: Stare at someone else while doing push-ups instead of yourself
- **c19**: Describe how to turn on someone else instead of yourself
- **c21**: Give love declaration to someone else instead of yourself
- **c23**: Take someone else's hand instead of your own
- **c24**: Mime position with someone else instead of yourself
- **c30**: Changed comparison logic to involve group judgment
- **c33**: Changed to group judgment instead of self-judgment
- **c41**: Give massage to someone else instead of yourself
- **c50**: Describe someone else's parts instead of your own
- **c51**: Sleep with someone else instead of yourself
- **c52**: Changed structure to involve someone else making sounds
- **c59**: Sit on someone else's lap instead of your own
- **c79**: Lick someone else's nipple instead of your own
- **c81**: Caress someone else's knee instead of your own
- **c86**: Kiss someone else's neck instead of your own
- **c93**: Compare yourself to someone else instead of yourself
- **c100**: Nibble someone else's ear instead of your own
- **c102**: Caress someone else instead of yourself
- **c103**: Changed penalty structure to involve the group

## Types of Changes Made

### 1. **Self-Interaction → Other Player Interaction**
Changed questions where a player was supposed to interact with themselves to interacting with "someone here" or "someone else"

### 2. **Self-Judgment → Group Judgment**  
Changed questions where a player was supposed to judge themselves to having "the group" make the judgment

### 3. **Impossible Comparisons → Logical Comparisons**
Fixed questions where players were supposed to compare themselves to themselves

### 4. **Clarified Instructions**
Made instructions clearer by specifying "someone here", "the group", or "the person to your right" instead of using ambiguous same-player references

## Quality Assurance
- All fixed questions now make logical sense in a multiplayer context
- Questions maintain their original intent and difficulty level
- No questions were removed, only modified to work properly
- All changes preserve the game's fun factor and challenge level

## Files Not Modified
The following question files were examined but did not contain the same-player logical inconsistencies:
- `couples.en.json` - Questions properly structured for couple interactions
- French language files (`.fr.json`) - Were not in scope for this English-focused fix

## Result
All logically impossible or nonsensical questions have been fixed while maintaining the original game experience and challenge level.