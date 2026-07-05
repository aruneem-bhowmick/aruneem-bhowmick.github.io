export const researchTerms = {
  'reasoning architectures': {
    definition:
      'Systems built for structured, step-by-step logical inference, deriving conclusions that must follow from their premises, rather than statistical pattern recognizers that just predict the likeliest continuation.',
    moral:
      "A system that only mimics reasoning will sound right without being right. If AI is going to touch decisions that matter, it owes us inference we can actually trust, not fluency.",
  },
  'representation learning': {
    definition:
      'The study of how raw data gets compressed into structured internal features; the geometric shape of what a model has learned to notice, group, and relate.',
    moral:
      'Every act of reasoning and every claim of interpretability is only as honest as the representation underneath it. Getting this layer right is the precondition for both.',
  },
  'mechanistic interpretability': {
    definition:
      "Reverse-engineering a model's internal computations into algorithms a person can read, rather than accepting its reasoning as an opaque black box.",
    moral:
      'Reasoning that shapes real decisions but cannot be inspected is not reasoning we can trust. Safe AI means thought that stays legible to the people it affects, not just its creators.',
  },
}
