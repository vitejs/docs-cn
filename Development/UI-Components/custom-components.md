---
title: Custom VitePress Components
description: Documentation for custom components used in DevSecOps documentation
---

# Custom VitePress Components

This guide documents the custom components available for use in our DevSecOps documentation.

## YouTube Player

The YouTube player component allows you to embed YouTube videos in your documentation.

### Usage

```md
<YouTubePlayer videoId="VIDEO_ID_HERE" />
```

The video ID is the part of the YouTube URL after `v=`. For example, in the URL `https://www.youtube.com/watch?v=446E-r0rXHI`, the video ID is `446E-r0rXHI`.

### Example

```md
<YouTubePlayer videoId="446E-r0rXHI" />
```

## Implementation Difficulty Indicator

The Difficulty Indicator component visually represents the complexity of implementing a security measure, tool, or practice.

### Usage

```md
<DifficultyIndicator 
  :difficulty="3" 
  label="Kubernetes Setup" 
  time="2-3 hours"
  :prerequisites="['Docker knowledge', 'Linux basics']"
>
  Additional notes or detailed explanation about the implementation difficulty.
</DifficultyIndicator>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| difficulty | Number | 3 | Difficulty level from 1 (easiest) to 5 (hardest) |
| label | String | "Implementation Difficulty" | Custom label for the component |
| time | String | "" | Estimated time required for implementation |
| prerequisites | Array | [] | List of prerequisites needed |

### Example

```md
<DifficultyIndicator :difficulty="4" time="1-2 days" :prerequisites="['Docker', 'Kubernetes basics']">
  Setting up a secure Kubernetes cluster requires understanding of networking concepts and security best practices.
</DifficultyIndicator>
```

### Best Practices for Using Difficulty Indicators

- Place the indicator near the beginning of the document to set reader expectations
- Be realistic about difficulty ratings - don't underestimate complexity
- Include specific prerequisites that are truly required, not just helpful
- Provide time estimates as ranges when appropriate (e.g., "2-4 hours")
- Use the component for implementation guides, tool setups, and configuration tutorials
- Add detailed notes explaining why something might be difficult for specific use cases

## Tool Comparison Matrix

The Tool Comparison Matrix component allows comparing different tools across multiple dimensions.

### Usage

```md
<ToolComparisonMatrix 
  :tools="tools" 
  :columns="columns"
  :showFilters="true"
/>
```

Where `tools` and `columns` are defined in your frontmatter or a custom script.

### Tool Object Structure

```js
{
  name: "Tool Name",
  url: "https://tool-website.com",
  category: "Category",
  description: "Brief description",
  pricing: "Free/Paid/Enterprise",
  features: ["Feature 1", "Feature 2"],
  rating: 4,
  openSource: true,
  // ... any other properties that match your column keys
}
```

### Column Object Structure

```js
[
  { key: "name", name: "Tool Name" },
  { key: "description", name: "Description" },
  { key: "pricing", name: "Pricing" },
  { key: "features", name: "Features" },
  { key: "rating", name: "Rating" },
  { key: "openSource", name: "Open Source", type: "boolean" },
  // ... other columns
]
```

### Example

Here's an example implementation comparing security scanning tools:

```md
<script setup>
const securityTools = [
  {
    name: "Trivy",
    url: "https://github.com/aquasecurity/trivy",
    category: "Container Scanner",
    description: "Comprehensive vulnerability scanner for containers",
    pricing: "Free, Open Source",
    features: ["Container scanning", "Infrastructure as code", "License detection"],
    rating: 5,
    openSource: true,
    integration: "Easy"
  },
  {
    name: "Clair",
    url: "https://github.com/quay/clair",
    category: "Container Scanner",
    description: "Vulnerability static analysis for containers",
    pricing: "Free, Open Source",
    features: ["Container scanning", "API-driven"],
    rating: 4,
    openSource: true,
    integration: "Moderate"
  }
];

const columns = [
  { key: "name", name: "Tool" },
  { key: "description", name: "Description" },
  { key: "pricing", name: "Pricing" },
  { key: "features", name: "Features" },
  { key: "rating", name: "Rating" },
  { key: "openSource", name: "Open Source", type: "boolean" },
  { key: "integration", name: "Integration Effort", highlight: true }
];
</script>

<ToolComparisonMatrix :tools="securityTools" :columns="columns" />
```

## Best Practices

- Use components to enhance documentation, not to replace clear written explanations
- Ensure that components degrade gracefully if JavaScript is disabled
- Use the Difficulty Indicator for complex setup procedures to set expectations
- Use the Tool Comparison Matrix when presenting multiple similar tools to help users make decisions
