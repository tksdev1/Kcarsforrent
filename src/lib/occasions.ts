export interface Occasion {
  emoji: string;
  title: string;
  copy: string;
}

/**
 * The "Perfect for" list, taken from the owner's own flyer rather than
 * invented here. Shown on the home page and the car page, and it drives the
 * occasion dropdown on the booking form so the wording matches everywhere.
 *
 * Quinceañeras isn't on the flyer but is called out in the business's own
 * about copy, so it stays.
 */
export const PERFECT_FOR: Occasion[] = [
  {
    emoji: "💕",
    title: "Date nights",
    copy: "Turn the drive there into part of the evening.",
  },
  {
    emoji: "📸",
    title: "Photoshoots",
    copy: "A backdrop that does half the work for you.",
  },
  {
    emoji: "🎂",
    title: "Birthday parties",
    copy: "Turn the driveway into the main event.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Family adventures",
    copy: "Small on fuel, enormous on personality.",
  },
  {
    emoji: "🏖️",
    title: "Weekend getaways",
    copy: "Pack light. It's a Kei van.",
  },
  {
    emoji: "👑",
    title: "Quinceañeras",
    copy: "An entrance nobody at the party forgets.",
  },
];

/** Options for the booking form's occasion dropdown. */
export const OCCASION_OPTIONS = [
  ...PERFECT_FOR.map((occasion) => occasion.title),
  "Corporate / brand event",
  "Just because",
  "Other",
];
