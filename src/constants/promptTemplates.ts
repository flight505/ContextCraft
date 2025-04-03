export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  category: TemplateCategory;
  description?: string;
  icon?: string;
}

export type TemplateCategory = 
  | 'Code Review' 
  | 'Documentation Generation' 
  | 'Analysis and Improvement' 
  | 'Testing' 
  | 'Code Quality';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'rubric-creation',
    name: 'Codebase-Informed Rubric',
    category: 'Analysis and Improvement',
    icon: '📊',
    description: 'Create a detailed 8-category evaluation rubric informed by your codebase',
    content: `Modified Rubric Creation Prompt

You are an expert in creating detailed and effective rubrics. Your goal is to construct a robust rubric with exactly 8 categories and A-F rating levels for the topic: <TOPIC>. You also have access to the following code base for context and reference: <CODEBASE>. Use insights from the code base to inform and enrich the rubric, but ensure the final rubric remains broadly applicable to <TOPIC>, not overly tailored to the specifics of <CODEBASE>. The final output MUST be a markdown table representing the complete rubric.

To create the best possible rubric, follow these steps:
1. Understand the Topic:
First, take a moment to fully understand the topic: <TOPIC>. Consider its key components, aspects, and criteria for evaluation.

2. Examine the Code Base (If Relevant):
Review <CODEBASE> to gain concrete examples or patterns that might inform your categories or grade descriptors. Look for notable features, common pitfalls, or unique aspects. However, maintain a balance: use the code to inspire more specific or relevant criteria without making the rubric so specialized that it cannot be applied to other projects under the same topic.

3. Brainstorm Core Categories:
Think about the most important dimensions or categories for evaluating <TOPIC>. Aim for a comprehensive set of categories that cover all essential aspects. You may derive extra insight from the code base if it highlights key concerns (e.g., testing, security, architecture), but do not neglect broader best practices that might not appear in <CODEBASE>.

4. Select and Refine 8 Categories:
From your brainstormed list, carefully select the 8 most critical and distinct categories. Refine the names of these categories to be clear, concise, and user-friendly. Each category should represent a key area of evaluation for <TOPIC>.
• Note: If the code base reveals significant issues or exemplary techniques in certain areas (e.g., performance, documentation), you may include corresponding categories. Just ensure these categories are still relevant to <TOPIC> in a general sense.

5. Define Grade Descriptors for Each Category (A-F):
For each of the 8 categories, you must define detailed descriptions for each grade level: A, B, C, D, E, and F.
• Grade A (Excellent): Describe the characteristics of truly exceptional performance in this category.
• Grade B (Good): Describe solid, above-average performance.
• Grade C (Fair): Describe satisfactory or average performance.
• Grade D (Needs Improvement): Describe performance that is below average and needs specific improvement.
• Grade E (Poor): Describe significantly deficient performance.
• Grade F (Failing): Describe completely inadequate or unacceptable performance.
Ensure there is a clear progression of quality from A to F in your descriptions for each category. Whenever appropriate, you may reference themes discovered in <CODEBASE> (for instance, a security vulnerability or an especially efficient approach). However, avoid adding code-base-specific language that would not apply to other projects in the same domain.

6. Format as a Markdown Table:
Present the complete rubric as a markdown table with the following structure:

| Category | Grade A | Grade B | Grade C | Grade D | Grade E | Grade F |
|----------|---------|---------|---------|---------|---------|---------|
| Category 1 Name | Description for Grade A | Description for Grade B | Description for Grade C | Description for Grade D | Description for Grade E | Description for Grade F |
| Category 2 Name | Description for Grade A | Description for Grade B | Description for Grade C | Description for Grade D | Description for Grade E | Description for Grade F |
| Category 3 Name | Description for Grade A | Description for Grade B | Description for Grade C | Description for Grade D | Description for Grade E | Description for Grade F |
| Category 4 Name | Description for Grade A | Description for Grade B | Description for Grade C | Description for Grade D | Description for Grade E | Description for Grade F |
| Category 5 Name | Description for Grade A | Description for Grade B | Description for Grade C | Description for Grade D | Description for Grade E | Description for Grade F |
| Category 6 Name | Description for Grade A | Description for Grade B | Description for Grade C | Description for Grade D | Description for Grade E | Description for Grade F |
| Category 7 Name | Description for Grade A | Description for Grade B | Description for Grade C | Description for Grade D | Description for Grade E | Description for Grade F |
| Category 8 Name | Description for Grade A | Description for Grade B | Description for Grade C | Description for Grade D | Description for Grade E | Description for Grade F |

Replace "Category X Name" with the name of each of your 8 categories, and fill in the "Description for Grade X" cells with the corresponding descriptions you created in the previous step.

Example (Row Only): If the topic was "Evaluating a Business Plan," one row of your markdown table might look like this:

| Market Analysis | Comprehensive market analysis with strong evidence and clear understanding of market dynamics. | Solid market analysis with good understanding of the target market and competitive landscape. | Adequate market analysis demonstrating basic understanding. | Market analysis is present but weak or superficial. | Market analysis is significantly flawed or incomplete. | Market analysis is missing or fundamentally flawed. |

Final Instruction

Now, generate the complete markdown table rubric for the topic: <TOPIC>
... enter your topic here ...
</TOPIC>, referencing <CODEBASE> only as needed for additional clarity or examples. Your rubric should remain broadly applicable to <TOPIC> while also reflecting any insights from <CODEBASE> that are valuable for guiding evaluations or improvements.`
  },
  {
    id: 'architecture-review',
    name: 'Architecture Review',
    category: 'Code Review',
    icon: '🏗️',
    description: 'Analyze codebase architecture, patterns, and suggest improvements',
    content: `Architecture Review:
- Analyze this codebase's architecture:
1. Evaluate the overall structure and patterns
2. Identify potential architectural issues
3. Suggest improvements for scalability
4. Note areas that follow best practices
Focus on maintainability and modularity.`
  },
  {
    id: 'security-review',
    name: 'Security Review',
    category: 'Code Review',
    icon: '🔒',
    description: 'Identify security vulnerabilities and suggest fixes',
    content: `Security Review:
Perform a security review of this codebase:
1. Identify potential security vulnerabilities
2. Check for common security anti-patterns
3. Review error handling and input validation
4. Assess dependency security
Provide specific examples and remediation steps.`
  },
  {
    id: 'performance-review',
    name: 'Performance Review',
    category: 'Code Review',
    icon: '⚡',
    description: 'Analyze performance bottlenecks and optimization opportunities',
    content: `Performance Review
Review the codebase for performance:
1. Identify performance bottlenecks
2. Check resource utilization
3. Review algorithmic efficiency
4. Assess caching strategies
Include specific optimization recommendations.`
  },
  {
    id: 'api-documentation',
    name: 'API Documentation',
    category: 'Documentation Generation',
    icon: '📚',
    description: 'Generate comprehensive API documentation',
    content: `API Documentation
Generate comprehensive API documentation:
1. List and describe all public endpoints
2. Document request/response formats
3. Include usage examples
4. Note any limitations or constraints`
  },
  {
    id: 'developer-guide',
    name: 'Developer Guide',
    category: 'Documentation Generation',
    icon: '📖',
    description: 'Create a comprehensive guide for developers',
    content: `Developer Guide
Create a developer guide covering:
1. Setup instructions
2. Project structure overview
3. Development workflow
4. Testing approach
5. Common troubleshooting steps`
  },
  {
    id: 'architecture-documentation',
    name: 'Architecture Documentation',
    category: 'Documentation Generation',
    icon: '🏛️',
    description: 'Document system architecture and design decisions',
    content: `Architecture Documentation
Document the system architecture:
1. High-level overview
2. Component interactions
3. Data flow diagrams
4. Design decisions and rationale
5. System constraints and limitations`
  },
  {
    id: 'dependency-analysis',
    name: 'Dependency Analysis',
    category: 'Analysis and Improvement',
    icon: '📦',
    description: 'Analyze project dependencies and suggest improvements',
    content: `Dependency Analysis
Analyze the project dependencies:
1. Identify outdated packages
2. Check for security vulnerabilities
3. Suggest alternative packages
4. Review dependency usage patterns
Include specific upgrade recommendations.`
  },
  {
    id: 'test-coverage',
    name: 'Test Coverage Review',
    category: 'Testing',
    icon: '🧪',
    description: 'Review test coverage and suggest improvements',
    content: `Test Coverage Review
Review the test coverage:
1. Identify untested components
2. Suggest additional test cases
3. Review test quality
4. Recommend testing strategies`
  },
  {
    id: 'code-quality',
    name: 'Code Quality Assessment',
    category: 'Code Quality',
    icon: '✨',
    description: 'Assess code quality and suggest improvements',
    content: `Code Quality Assessment
Assess code quality and suggest improvements:
1. Review naming conventions
2. Check code organization
3. Evaluate error handling
4. Review commenting practices
Provide specific examples of good and problematic patterns.`
  }
];

export const TEMPLATE_STORAGE_KEY = 'pastemax-last-template';
export const TEMPLATE_INSERT_MODE_KEY = 'pastemax-template-insert-mode';
export type TemplateInsertMode = 'replace' | 'append'; 