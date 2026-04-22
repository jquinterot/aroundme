---
name: skill-creator
description: Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy. Make sure to use this skill whenever the user mentions creating a skill, improving a skill, testing a skill, or optimizing skill descriptions.
---

# Skill Creator

A skill for creating new skills and iteratively improving them.

## Core Process

1. Decide what the skill should do and how it should work
2. Write a draft of the skill
3. Create test prompts and evaluate results
4. Iterate based on feedback
5. Expand test set and repeat at larger scale

## Creating a Skill

### Capture Intent

Start by understanding the user's intent:

1. What should this skill enable open code to do?
2. When should this skill trigger? (what user phrases/contexts)
3. What's the expected output format?
4. Should we set up test cases to verify the skill works?

### Skill Anatomy

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description required)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/    - Executable code for deterministic tasks
    ├── references/ - Docs loaded into context as needed
    └── assets/     - Files used in output (templates, icons, fonts)
```

### Progressive Disclosure

Skills use a three-level loading system:
1. **Metadata** (name + description) - Always in context (~100 words)
2. **SKILL.md body** - In context whenever skill triggers (<500 lines ideal)
3. **Bundled resources** - As needed (unlimited)

**Key patterns:**
- Keep SKILL.md under 500 lines
- Reference files clearly from SKILL.md
- For large reference files (>300 lines), include a table of contents

### Writing Patterns

Prefer using the imperative form in instructions.

**Defining output formats:**
```markdown
## Report structure
ALWAYS use this exact template:
# [Title]
## Executive summary
## Key findings
## Recommendations
```

**Examples pattern:**
```markdown
## Commit message format
**Example 1:**
Input: Added user authentication with JWT tokens
Output: feat(auth): implement JWT-based authentication
```

### Writing Style

- Explain **why** things are important instead of heavy MUSTs
- Make skills general, not super-narrow
- Use theory of mind
- Draft first, then review with fresh eyes

## Test Cases

After writing the skill draft:

1. Come up with 2-3 realistic test prompts
2. Share them with the user for review
3. Run them

Save test cases to `evals/evals.json`:

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's task prompt",
      "expected_output": "Description of expected result",
      "files": []
    }
  ]
}
```

## Evaluating Results

### Quantitative Assertions

Good assertions are:
- Objectively verifiable
- Have descriptive names
- Read clearly in the benchmark viewer

Subjective skills (writing style, design quality) are better evaluated qualitatively.

### Grading

For each run, evaluate assertions against outputs. Save results to `grading.json`:

```json
{
  "assertions": [
    {
      "text": "File contains expected sections",
      "passed": true,
      "evidence": "All required sections found"
    }
  ]
}
```

## Improving Skills

### How to Think About Improvements

1. **Generalize from feedback** - Don't overfit to specific examples
2. **Keep the prompt lean** - Remove things not pulling their weight
3. **Explain the why** - Help the model understand reasoning
4. **Look for repeated work** - If all test runs write the same helper script, bundle it

### Iteration Loop

1. Apply improvements to the skill
2. Rerun all test cases
3. Review results
4. Read feedback, improve again, repeat

Continue until:
- User says they're happy
- All feedback is empty
- No meaningful progress

## Description Optimization

The description field determines whether open code invokes a skill.

### Generate Trigger Eval Queries

Create 20 eval queries (mix of should-trigger and should-not-trigger):

```json
[
  {"query": "the user prompt", "should_trigger": true},
  {"query": "another prompt", "should_trigger": false}
]
```

**Should-trigger queries (8-10):**
- Different phrasings of the same intent
- Cases where user doesn't explicitly name the skill
- Uncommon use cases
- Cases where skill competes with another but should win

**Should-not-trigger queries (8-10):**
- Near-misses (share keywords but need something different)
- Adjacent domains
- Ambiguous phrasing
- Context where another tool is more appropriate

### Optimization Loop

Run the optimization:
```bash
python -m scripts.run_loop \
  --eval-set <path-to-trigger-eval.json> \
  --skill-path <path-to-skill> \
  --model <model-id> \
  --max-iterations 5
```

## Without Subagents (Manual Mode)

If subagents aren't available:

1. Read the skill's SKILL.md yourself
2. Follow its instructions to complete each test prompt
3. Present results directly in conversation
4. Ask for feedback inline
5. Iterate based on feedback

## Checklist for New Skills

- [ ] Clear name and description
- [ ] YAML frontmatter with triggering info
- [ ] Under 500 lines in SKILL.md
- [ ] Code examples where helpful
- [ ] Explains WHY, not just WHAT
- [ ] Test cases created
- [ ] Evaluated with real prompts
- [ ] Description optimized for triggering
