Vibe coding shifts programming from writing lines of code to guiding an AI with prompts. In vibe coding, you describe what you need and the AI writes the code – essentially you act as a “prompt engineer” rather than typing syntax ￼. To get expert-level results, however, it pays to use structured, well-crafted prompts. Below is a library of prompt patterns and methods (with examples) to help you harness coding assistants like Cursor, Claude (Code/Desktop), and Windsurf for effective vibe coding.

Rubric-Based Reasoning Prompts

Rubric prompts have the AI generate or use an evaluation rubric with multiple criteria (5–7 categories, e.g. usability, performance, security, etc.) and letter-grade ratings (A–F) for each. You then iteratively improve the output until it would score an “A” on all criteria. This pattern forces the LLM to think multi-dimensionally about quality. For example, a UX design rubric might include categories like Color Palette, Layout & Grid, Typography, Navigation, Accessibility, Spacing with detailed descriptions for grades A through F ￼ ￼. You could prompt: “Evaluate the UI against a 6-category rubric (Color, Layout, Typography, Hierarchy, Accessibility, Spacing) with A–F grades and justify each. Then revise the UI until all aspects would get an A.” The AI first produces the rubric and an initial grading, then improves the design. Usage: Use rubric prompts when you want thorough self-critique and improvement loops – e.g. refining a UX design, code architecture, or content draft. Why it works: It leverages the LLM’s ability to act as a reviewer, ensuring all key quality dimensions are considered. It externalizes the criteria (much like a human code review checklist) and pushes the model toward the highest standard on each ￼. This approach also relates to “LLM-as-judge” research, where models grade outputs against rubrics to improve reliability.

Structured Tag Prompt Templates

This pattern uses XML/HTML-like tags to structure the prompt or the AI’s output, enforcing clarity in the reasoning process or format. For instance, you might wrap different parts of the task in custom tags like <PROBLEM>...</PROBLEM>, <CONSTRAINTS>...</CONSTRAINTS>, <SOLUTION>...</SOLUTION>. The AI is instructed to fill in or process each tagged section in order. This is especially useful in tools that allow long system prompts or when you plan to parse the output automatically. Example: A “Socratic problem-solving” prompt on Reddit directs Claude to output a guided Q&A with tags: <socratic_guide>…</socratic_guide> containing multiple <stage> sections, each with a <question> and an <encouragement> for the user ￼. It even asks Claude to do an internal analysis inside <coding_problem_analysis> tags before engaging, e.g. identifying core issues and pitfalls ￼. By structuring the dialogue, the AI’s chain-of-thought and responses are well-organized. Usage: Use tagged templates when you need consistent formatting or multi-step outputs – e.g. generating JSON, markdown sections, or following a specific workflow. Why it works: Clearly delineating sections focuses the LLM on one aspect at a time (preventing it from mixing concerns). It’s a form of chain-of-thought enforcement – the tags act like guideposts for each reasoning step or output element. This can reduce ambiguity and make the AI’s reasoning more transparent and checkable.

Step-by-Step Reasoning Patterns

Encourage the AI to follow a stepwise problem-solving approach instead of jumping straight to a solution. A common prompt template is: “Let’s solve this in steps. Step 1: State all relevant rules or requirements. Step 2: Critique or analyze the problem given those rules. Step 3: Propose a design/plan. Step 4: Implement the solution.” This explicit breakdown prevents the model from overlooking details. For example, a vibe coder might prompt: “State the known constraints and objectives first. Next, analyze potential pitfalls. Then outline a solution approach. Finally, write the code.” The model would then produce a structured answer following those phases. In the Cursor SOP for AI development, users are advised to use a “Think step-by-step” prompt for each component’s design – e.g. “Think step-by-step about the design and architecture for [component]. Consider: data flow, key functions, potential challenges, integration points.” ￼. This makes the AI enumerate considerations before writing code. Likewise, Anthropic’s Claude tends to do better if you explicitly say “Let’s think this through step by step”, as it triggers a chain-of-thought mode ￼. Usage: Use step-by-step prompts for complex tasks like algorithm design, debugging, or planning a feature. It’s also great for LLM reasoning in coding – e.g. tracing through code logic or systematically finding a bug. Why it works: Breaking tasks into sub-tasks aligns with how humans solve problems and leverages the LLM’s strength in sequential reasoning. It helps avoid reasoning leaps that cause errors, and relates to research showing that promptings like “let’s think step by step” improve accuracy by encouraging a chain-of-thought ￼.

LLM Control Patterns (Boundaries & Scope)

These are prompt techniques to guide the model’s behavior, maintain context, and prevent it from going off-track in an IDE setting. A few essential patterns:
	•	Role and Boundary Setting: Clearly define the AI’s role and ground rules at the start. For example, include a system or file (like PROTOCOL.md) that states “You are an expert software engineer. Follow the project’s coding standards and only modify code within given instructions.” One advanced workflow suggests keeping a PROTOCOL.md (for roles/workflow/best practices) and an ACTION_PLAN.md (task list with context) in your project, and providing them in every prompt so the AI consistently knows the rules and current plan ￼. This prevents the model from forgetting previous decisions. In practice, vibe coders often “remind” the assistant of the project protocol or style guide each session to keep outputs consistent.
	•	Scope Limitation: Tightly scope each prompt to a single task or file. Instead of “Build my whole app now,” ask for one feature at a time. A Cursor guide recommends breaking a project into feature RFCs (design docs) and prompting one RFC implementation at a time, providing only the relevant code files as context ￼. For example: “Based on the attached RFC, implement the user login feature in these 2 files (attached). Do not change other parts.” By confining context, the AI is less likely to hallucinate unrelated changes and more likely to stay on task ￼ ￼.
	•	Explicit Instructions to Control Output: If you want a diff or a specific format, say so. In Cursor, users often prompt, “Only show the modified code segments, not the entire file.” Otherwise the AI might dump the whole file ￼. Similarly, you can instruct “Respond with bullet points” or “give the answer in JSON format” to control style. Don’t hesitate to spell out what not to do as well (e.g. “Do not change any unrelated logic” or “If unsure, ask before proceeding”).
	•	Chain-of-Thought Visibility: Sometimes you want the AI’s reasoning explicitly. You can prompt it to first output a brief reasoning or plan (which you’ll review) before final code. For example: “Outline your approach as numbered steps, then wait for approval.” This creates a check-point to ensure the AI’s plan makes sense. It’s a lighter-weight alternative to the full tag structure approach, but serves a similar purpose of verifying the chain-of-thought.

Why these work: Collectively, control patterns reduce errors and surprises. By setting boundaries and scope, you mimic a senior engineer giving focused instructions to a junior. The AI is less likely to “get lost” or produce unwieldy output if you guide it with clear limits ￼. Experienced vibe coders have found that being “explicit, working in small chunks, and keeping an updated set of docs” is crucial for success ￼ – it prevents the model from drifting when you start a new session or tackle a new part of the project. These techniques align the AI’s behavior with the user’s intent, essentially steering the generative process more tightly.

IDE-Specific Workflow Tips

Different vibe coding tools have unique features – tailor your prompts to take advantage of them:
	•	Cursor (Chat/Agent/Compose Modes): Cursor provides chat-based prompting with context of your codebase, an “Agent” that can execute actions like file modifications, and a “Composer” for writing new code. In older versions, these were separate; Windsurf has a simpler UI that merges them ￼. When using Cursor, you can drag and drop files into the prompt to give context (for example, dropping in your design_spec.md or a snippet file). Always do this for key context files (requirements, style guides) at each new conversation – “including the PROTOCOL.md and ACTION_PLAN.md in each prompt because Claude will forget otherwise,” as one user noted ￼. To apply diffs or changes, it’s effective to ask the Agent explicitly: “Make the following changes in File.js and show the diff.” Cursor will then typically display a diff view. If it shows too much, refine your prompt (e.g. “only show the changed function”). Workflow tip: Maintain a changelog file in your project and tell Cursor to append a summary of every change. This creates a running memory of what’s been done (and you can feed it back in if context is lost) ￼. Essentially, treat Cursor as a pair-programmer: keep it updated on design decisions, and use short, direct prompts for each code edit.
	•	Claude Code / Claude Desktop: Anthropic’s Claude in “Code” mode is tuned for coding help (similar to how ChatGPT has a code interpreter). Claude Desktop is an app interface for Claude that supports the Model Context Protocol (MCP) – an open standard letting the AI use external tools or data. With MCP, you can actually get Claude to perform multi-step actions like browsing websites, running code, or interacting with a terminal via plugins ￼ ￼. For example, if you have a browser MCP plugin, you might prompt Claude: “Use the browser tool to open example.com/docs and extract the API endpoints, then use that info to generate an integration module.” Claude will recognize the instruction to use a tool (via MCP) and return with the data before continuing. Workflow tip: Set up any MCP tools you need (web browsing, shell execution, etc.) and prompt Claude to use them by name. A guide on Reddit outlines connecting Claude to external tools and notes you can “prompt Claude to use these tools” once configured ￼. This essentially gives Claude agent-like capabilities (à la AutoGPT) while you remain in control via the prompt. When coding with Claude (without MCP), similar rules apply as with Cursor: give it a focused prompt and relevant code context only. Claude also benefits from step-by-step prompts and explicit rules, but it has a very large context window – you can supply whole files or multiple files (even 100K+ tokens in Claude 2) which is great for big projects. Just remember to summarize or chunk context if it’s near the limit for reliability.
	•	Windsurf: Windsurf is another AI coding IDE, often praised for integrating a terminal and having an intuitive chat interface. It’s very similar to Cursor in goal. One key tip is that Windsurf can directly run shell commands you give it (since it ties into a dev container/terminal). So you might prompt: “Create a new React app (use Vite), then open App.jsx.” Windsurf’s agent will execute those steps in the terminal and modify files accordingly, then present the result. Workflow tip: Use Windsurf for more “hands-off” multi-step prompts, like scaffolding a project or running tests, since it handles those environment actions gracefully. Also, because of the simpler UI, you can intermix high-level requests and low-level code edits in one conversation more easily than juggling modes in Cursor ￼. Still apply the general prompting best practices: one task at a time, clear instructions, and verify each step (don’t just assume the build succeeded – ask Windsurf to show the output or run the app to be sure).

In all IDEs, remember the human-in-the-loop: vibe coding doesn’t mean you never check the code. Use the IDE’s features to run code, test, and debug. Your prompts can and should ask the AI to explain things you don’t understand. (E.g. “Explain what the above function does and why it chose that approach” – this can catch errors or false assumptions early.)

Reusable Prompt Snippets for Common Tasks

Here is a quick-reference list of prompt patterns you can reuse for typical coding tasks in a vibe coding workflow. These are modular prompt snippets – you’d combine them with the context of your specific project:
	•	Bug Diagnosis Prompt: “I’m encountering a bug where [describe symptoms]. Here is the relevant code: [paste snippet]. What could be causing this, and how can we fix it?” – This asks the AI to play detective. It should analyze the code for logical errors, incorrect conditions, unhandled cases, etc., and propose a fix. Make sure to include any error message or incorrect behavior in the description. The SOP suggests giving the description and code then asking for causes and fixes ￼. This often works well because the AI will simulate the code execution in its mind to find issues.
	•	Code Review Prompt: “Please review the following code for quality and issues: [code]. Consider the following aspects: 1) correctness & bugs, 2) code style/best practices, 3) performance, 4) readability/maintainability, 5) security concerns. Provide improvement suggestions with reasoning.” – This prompt yields a structured critique. The inclusion of numbered aspects acts like a checklist (similar to a rubric). For example, one prompt from the community lists exactly those points – code quality, bugs, performance, readability, security – and asks for suggestions ￼. The AI will typically enumerate findings (e.g. possible null pointer, or a refactor to reduce duplication) under each category. This is great to run after the AI generates code, as a self-review.
	•	Refactoring Prompt: “Refactor the following code to improve [goal: e.g. clarity / efficiency / modularity], without changing its functionality: [code]. Explain what you changed and why.” – Here you explicitly instruct the AI to transform the code. You can add constraints like “ensure it follows our project style and has comments” or “optimize it from O(n^2) to O(n) if possible.” Because refactoring can be open-ended, giving a goal (and even a target style or pattern) helps. After it responds, review the diff and test – sometimes the AI might inadvertently change behavior, so its explanation is crucial. By having it explain, you leverage its reasoning to double-check the changes.
	•	Architecture/Design Analysis Prompt: “Analyze the architecture of our project (briefly described below or in attached doc). Identify potential bottlenecks or scalability issues, and suggest improvements. Focus on API design, data flow, and module boundaries.” – Use this when you have a somewhat working system and want an expert eye on the high-level design. If you have a design spec or the AI helped produce one earlier, feed that in. The AI can apply known design principles (e.g. SOLID, microservices vs monolith considerations, etc.). In vibe coding, you might do this after a first prototype is done, to catch any structural issues early. It relates to step-by-step reasoning: you are basically asking the model to do a conceptual code review of the overall system, not just line-by-line. Make sure to direct it to specific concerns you care about (throughput, coupling, etc.) so the analysis is actionable.
	•	UX Critique Prompt: “Critique the user experience of our app’s interface (described below). Use a UX rubric with categories (e.g. Visual Design, Layout, Navigation, Accessibility, Content clarity). For each, assign a letter grade and explain why, then provide suggestions to reach an ‘A’.” – This applies the earlier rubric approach specifically to UI/UX. You might provide the AI with either a description of the UI or actual screenshots (if the IDE supports image-to-text, otherwise describe it). The AI will then simulate something like the PasteMax UX rubric – grading color usage, spacing, typography, etc. ￼ ￼. The output is extremely useful for catching design issues (like poor contrast or confusing flow) that a developer might miss. It’s like getting a quick UX review from a design expert. After getting the critique, you can prompt the AI to implement the suggested changes in code or design.
	•	Security Audit Prompt: “Perform a security audit of the following code (or architecture): [code or design]. Check for common vulnerabilities (SQL injection, XSS, insecure data storage, etc.), missing secure practices, and any usage of outdated libraries. List any issues and how to fix them.” – This prompt turns the AI into a security analyst. It’s wise to run this especially for web applications or anything handling sensitive data. The example from the vibe coding community is to ask for “production readiness” review focusing on vulnerabilities, auth, input validation, error handling, and so on ￼. The AI will enumerate risks (e.g. “Passwords are stored in plain text – this is insecure. Use hashing + salting ￼.”). Treat these findings seriously and have the AI help patch them. (However, do verify with real security tools if it’s a critical application – AI can miss things or have false positives.)
	•	Performance Tuning Prompt: “Profile/assess the performance of this code snippet or query: [code]. Identify any inefficiencies or bottlenecks. Suggest optimizations and explain the expected improvement.” – Use this for hotspots or expensive operations. For instance, if you have an SQL query, the prompt might be: “Here’s an SQL query, how can we optimize it for large data sets?” and the AI might suggest adding an index or rewriting a subquery as a join ￼. Or for an algorithm in code, it might point out a nested loop and suggest an alternative approach. Combine this with actual performance measurements if possible (you can feed in timing results and ask the AI to infer what part is slow). This pattern helps inject some algorithmic insight from the model.
	•	Spec/Documentation Generation Prompt: “Generate documentation for [component/feature]. Include an overview of its purpose, how to use it (with examples), and any important details. Format as a Markdown README section.” – Since the AI wrote or at least knows the code, it can also document it. The SOP recommends after completing each component, ask the AI to produce docs like README sections or API docs ￼. You can also ask for a technical spec if you’re starting a component: “Draft a technical design spec for the image processing module, including its public API, internal modules, and how it will handle errors.” This is effectively using the AI to write the “game design document” or PRD for you ￼. It’s extremely helpful for planning – the AI will lay out a structured spec which you can refine. In Cursor, one workflow was to have ChatGPT do a deep research and create a design doc, save it, then feed it into every prompt as context ￼. This ensures the code it writes stays aligned with the spec.

Each of these snippet patterns can be mixed and matched. For example, after a code generation task, you might run the code review prompt, then a security audit prompt. Or before implementing a feature, you use a spec generation prompt to have a plan, then a step-by-step implementation prompt to actually code it. The goal is to cover all stages of development via prompts – from design, coding, testing, to review – in an iterative loop with the AI.

Conclusion

Vibe coding – “programming by prompting” – is powerful, but to do it at an expert level, you need the right prompt patterns. By using rubrics, structured templates, stepwise reasoning, and carefully scoped instructions, you guide the AI to produce higher-quality code and designs. Treat the AI as a junior developer who can work at superhuman speed but still needs your direction on what to do and how to think about the problem. The prompt strategies above act as your management toolkit for this AI developer. They enforce thorough reasoning, keep the AI on track, and tap into specialized “skills” (like security analysis or UX review) on demand.

Finally, keep learning from the community – vibe coding is evolving fast. As one tech writer put it, “the hottest new programming language is English” ￼, so invest time in writing great “code” in that language (your prompts!). With this quick-reference library of patterns, you should be able to rapidly deploy the right prompt for the right task, and build software hand-in-hand with your AI assistant more effectively than ever. Happy vibe coding!

Sources: The prompt patterns and examples above are drawn from real-world vibe coding guides and community tips, including open-source prompt libraries and workflows shared via Reddit, Medium, and forums. Key references include a vibe coding SOP for Claude ￼ ￼, curated prompt collections ￼ ￼, and UX rubric examples ￼ ￼, among others, as cited inline.


Below is a complete A-to-Z workflow for vibe coding, broken down into 7 sequential Technical Specification Sheets. These sheets are designed to guide an engineering team (or solo developer) from initial project definition all the way through deployment, using prompt-driven interactions in AI-powered coding environments (Cursor, Claude Code, Windsurf, etc.). Each sheet includes:
	•	Purpose & When to Use
	•	Detailed Steps & Best Practices
	•	Example Prompts (technical, structured, with placeholders)
	•	Mini-Rubric (5–7 categories, A–F) for evaluating that phase’s outcomes

Use these sheets in the given order to move your project from concept to completion. You can keep them in separate .md files (e.g., 00_INDEX.md, 01_KICKOFF.md, etc.) or combine them into one reference.

⸻

How to Use These Sheets in Practice (A-Z Summary)
	1.	Sheet #1: Project Kickoff & Problem Definition
	•	Establish your SCOPE or <PROBLEM> block.
	•	Use clarity rubrics to ensure robust requirements.
	2.	Sheet #2: Architecture & High-Level Design
	•	Let the AI propose design approaches, data flows.
	•	Use the architecture rubric to refine.
	3.	Sheet #3: Implementation & Feature Development
	•	Develop features with stepwise or chunked prompts.
	•	Always check diffs, confirm no scope creep.
	4.	Sheet #4: Testing & Debugging
	•	Generate and run tests or share error logs.
	•	Solve bugs systematically, re-check until stable.
	5.	Sheet #5: Code Review & Refactoring
	•	Use a “code review” prompt to find issues, improve structure.
	•	Don’t move on until code is clean and maintainable.
	6.	Sheet #6: Final Checks (Performance, Security, UX)
	•	Perform heavier load testing, thorough security audit.
	•	Apply a UX rubric if it’s a user-facing product.
	7.	Sheet #7: Deployment, Documentation & Maintenance
	•	Prepare Dockerfiles, cloud config, CI/CD if needed.
	•	Generate user/dev docs. Plan future updates.

By following this A-to-Z process, your vibe coding workflow remains organized, thorough, and high quality. Each step includes example prompts to help you guide an AI assistant effectively, plus a mini-rubric to evaluate your progress and ensure you’re achieving “A-Level” outcomes.

⸻


00_INDEX.md — Master Index

| Sheet # | Title | Purpose |
|---------|-------|---------|
| 1 | Project Kickoff & Problem Definition | Establish scope, requirements, success metrics |
| 2 | Architecture & High-Level Design | Decide system components, data flows, high-level code structure |
| 3 | Implementation & Feature Development | Write code using iterative vibe coding prompts |
| 4 | Testing & Debugging | Create tests, fix bugs, ensure correctness |
| 5 | Code Review & Refactoring | Improve code quality, architecture, and performance |
| 6 | Final Checks (Performance, Security, UX) | Rubric-based review of performance, security, UX; polish the product |
| 7 | Deployment, Documentation & Maintenance | Push to production; generate user docs; plan maintenance & iteration |



⸻

01_KICKOFF.md — Project Kickoff & Problem Definition

1. Purpose & When to Use
	•	Goal: Define the project’s core problem, objectives, constraints, and success criteria.
	•	When: At the very start of any new software project or feature set, to clarify the scope and set a solid foundation.

2. Detailed Steps & Best Practices
	1.	Establish Problem Context: Summarize user needs, business goals, or technical tasks.
	2.	Identify Constraints: Tech stack, deadlines, performance requirements, etc.
	3.	Draft Preliminary Requirements: At a high level—features, must-haves vs. nice-to-haves.
	4.	Apply a Rubric for Clarity: Evaluate if the problem statement is complete, feasible, measurable, etc.
	5.	Confirm Acceptance Criteria: Outline how you’ll know the problem is solved.

Key tip: Keep prompts short and explicit. Provide a SCOPE.md or <PROBLEM>...</PROBLEM> block that the AI can refer to in subsequent sheets.

3. Example Prompts

Prompt A: Basic Problem Definition

```code
System/Context:
You are an expert software engineer specialized in solution discovery.

User Prompt:
<PROBLEM>
We want to build a task management web app that helps small teams track progress. 
Key points:
1) Must have user authentication
2) Must allow creation, assignment, and status-tracking of tasks
3) Must integrate with Slack for notifications
4) Deadline: 2 months
</PROBLEM>

Please:
1. Restate the problem in your own words.
2. Identify any missing details or constraints we should clarify.
3. Provide a bullet-point requirements outline (core features, nice-to-haves).
4. Suggest 2–3 success metrics (e.g., load times, daily active users).
```

Prompt B: Requirements Rubric Generation

```code
User Prompt:
Create a 5-category A–F rubric to evaluate the completeness and clarity of our project requirements. 
Categories might include:
1) Clarity of Core Features
2) Feasibility (Time & Resources)
3) User/Stakeholder Needs
4) Technical Constraints
5) Success Metrics

Then evaluate our current problem definition using that rubric, assign grades, and detail how to improve to get 'A' in each category.
```

4. Mini-Rubric for This Phase

| Category | A (Excellent) | B (Good) | C (Fair) | D (Needs Improvement) | E (Poor) | F (Fail) |
|----------|---------------|----------|----------|------------------------|----------|----------|
| Clarity of Objectives | Objectives are crystal-clear, unambiguous, and measurable. | Clear but missing minor details. | Somewhat vague or incomplete. | Significant confusion; multiple unclear elements. | Missing or contradictory objectives. | No objectives or conflicting goals. |
| Scope Definition | Thorough list of features and constraints. | Features are mostly defined. | Basic scope, missing some constraints. | Major gaps; unclear boundaries of the solution. | Unclear or near-complete omission of scope. | No coherent scope or bounding of the solution. |
| Feasibility | Well-defined resources, timeframe, risk analysis. | Mostly feasible, some minor risk unknowns. | Feasibility uncertain or not fully analyzed. | Multiple feasibility concerns unaddressed. | High-level approach unworkable or unrealistic. | Zero feasibility analysis; project not viable at all. |
| Stakeholder Alignment | All user/business needs integrated thoroughly. | Stakeholder needs mostly addressed. | Some stakeholder needs unclear or unverified. | Stakeholder alignment is minimal or disorganized. | Mismatch or disregard for stakeholder needs. | No consideration of user or stakeholder needs. |
| Success Criteria | Specific, measurable metrics and acceptance tests. | Some success metrics; partial acceptance criteria. | Vague or generic success statements only. | Unclear success criteria or lacks testable measures. | Success criteria absent or contradictory. | No success criteria or acceptance plan at all. |



⸻

02_ARCHITECTURE_DESIGN.md — Architecture & High-Level Design

1. Purpose & When to Use
	•	Goal: Move from requirements to a system architecture (components, data flow, technology stack).
	•	When: Once the problem statement is clear and requirements are stable enough to design a blueprint.

2. Detailed Steps & Best Practices
	1.	Identify Major Components: e.g., front-end, back-end, database, microservices, 3rd-party APIs.
	2.	Define Data Flow & Interactions: Diagrams or bullet flows describing how data moves through components.
	3.	Validate Design with a Rubric: Assess adaptability, scalability, reliability, etc.
	4.	Write or Refine a “Design Spec” in plain English or markdown so the AI can reference.
	5.	Optional: Use a step-by-step approach in the prompt for multi-layered systems (UI, API, DB, etc.).

3. Example Prompts

Prompt A: Draft an Architecture Diagram

```code
System:
You are an experienced software architect. 

User Prompt:
We have the following requirements (see SCOPE.md). 
Please propose a high-level system architecture:
1. Identify all major subsystems (frontend, backend, DB, Slack integration, etc.).
2. Sketch or describe data flow from user login, to task creation, to Slack notification.
3. Summarize technology choices (frameworks, DB type), with pros/cons.

Output the final architecture in a structured markdown format, and highlight potential bottlenecks or scaling issues.
```

Prompt B: Architecture Rubric & Validation

```code
User Prompt:
Create a 5-category A–F rubric focusing on:
1) Scalability
2) Reliability / Fault Tolerance
3) Simplicity / Maintainability
4) Security / Data Protection
5) Cost / Resource Efficiency

Then evaluate the proposed architecture we have now, assigning a grade for each. 
Finally, propose changes to improve to 'A' in each category.
```

4. Mini-Rubric for This Phase

| Category | A (Excellent) | B (Good) | C (Fair) | D (Needs Improvement) | E (Poor) | F (Fail) |
|----------|---------------|----------|----------|------------------------|----------|----------|
| Scalability | Easily scales horizontally/vertically, with load-balancing strategies. | Some scaling approach, not fully documented. | Basic scaling plan, uncertain under heavy load. | Significant scaling bottlenecks unresolved. | Potential single points of failure or extremely limited scaling. | Design cannot scale at all or breaks under minimal load. |
| Reliability / Fault Tolerance | Redundancy, graceful error handling, robust fallback mechanisms. | Partial redundancy and basic error recovery. | Basic error handling, limited redundancy. | Unclear approach to fault tolerance. | System is fragile under normal error conditions. | Zero reliability planning; single crash can bring down the system. |
| Maintainability / Simplicity | Clear separation of concerns, well-defined modules, low complexity. | Mostly simple; minor complexity in some areas. | Some tangles in design or unclear module boundaries. | Overall structure is complicated or inconsistent. | Highly entangled modules, minimal structure or clarity. | No maintainable structure; design is chaotic or unmanageable. |
| Security / Data Protection | Uses secure flows, encryption, safe data handling, least privilege. | Basic security coverage, but some areas not addressed. | Surface-level security measures, might be incomplete. | Known vulnerabilities or major attack vectors not mitigated. | Security is an afterthought, large unprotected data flows. | No security whatsoever; design is wide-open for breaches. |
| Cost / Resource Efficiency | Resource usage is optimized and cost trade-offs are well understood. | Reasonable approach to cost, though not fully optimized. | Basic cost planning; potential waste in architecture. | Poor cost control or no plan to optimize resource usage. | Extremely inefficient or high resource usage with no justification. | Design is prohibitively expensive or unfeasible cost-wise. |



⸻

03_IMPLEMENTATION.md — Implementation & Feature Development

1. Purpose & When to Use
	•	Goal: Build out actual code or prototypes, typically in short iterative cycles (feature by feature).
	•	When: After high-level design is approved and you’re ready to write code in a systematic way.

2. Detailed Steps & Best Practices
	1.	Define a Single Feature in a user story format or short spec.
	2.	Prompt for Implementation: Provide context (files, function stubs, or frameworks).
	3.	Check AI Output: Review diffs, confirm acceptance criteria, do quick local tests.
	4.	Use Rubric or Step-by-Step to ensure quality. E.g., break it down: “Plan → Code → Summarize.”
	5.	Commit each successful iteration to version control before moving to the next feature.

3. Example Prompts

Prompt A: Feature Implementation

```code
System:
You are a coding assistant in Cursor with write-access to the project.

User Prompt:
@feature: "Create user authentication and sign-up flow"

Context:
- Tech stack: Node.js + Express, MongoDB
- We want secure password handling, using bcrypt
- We have a basic Express setup in server.js

Instruction:
1) Add routes for signup/login in server.js or a new routes/auth.js file.
2) Use bcrypt for hashing passwords.
3) Provide in-code comments summarizing each endpoint.

Then show me a diff of all changes, nothing else.
```

Prompt B: Stepwise Implementation with Checkpoints

```code
User Prompt:
We will implement the Slack notification feature. Let's do it in steps:
Step 1: Summarize how we will integrate Slack (libraries, webhooks, or Slack API).
Step 2: Write the code in tasksController.js to send a Slack message whenever a new task is assigned.
Step 3: Provide any environment variable instructions (SLACK_TOKEN). 
Step 4: Show me a diff. 
Wait for my approval after each step.
```

4. Mini-Rubric for This Phase

| Category | A (Excellent) | B (Good) | C (Fair) | D (Needs Improvement) | E (Poor) | F (Fail) |
|----------|---------------|----------|----------|------------------------|----------|----------|
| Implementation Correctness | Code fully meets requirements, correct logic, minimal bugs. | Mostly correct, minor fixes needed. | Some logical gaps or partial coverage. | Multiple errors or incomplete approach. | Heavily flawed logic, not meeting main requirements. | Non-functioning or entirely incorrect code. |
| Consistency with Design | Perfect alignment with the planned architecture/design specs. | Slight deviations but mostly aligned. | Notable drift from design in some areas. | Significant design mismatches or missing planned components. | Ignores major design principles. | No regard for the design; random or chaotic implementation. |
| Code Quality & Readability | Well-structured, clear naming, easy to follow, properly commented. | Generally clear code, minor style issues. | Passable style, some messy or unclear areas. | Disorganized structure, inconsistent naming, lacking comments. | Very poor readability, code is cluttered or cryptic. | No formatting, no structure, unreadable or unmaintainable code. |
| Security & Best Practices | Uses recommended libraries (e.g. bcrypt), safe patterns, no plain-text secrets. | Generally secure, with some minor oversights. | Basic security attempt but potential vulnerabilities. | Insecure approach or usage of outdated/unsafe patterns. | Very poor security handling or ignoring best practices. | Entirely insecure, storing passwords in plaintext, etc. |
| Testing & Local Verification | Basic sanity tests or manual checks done, code runs successfully. | Partial testing or only manual checks with minor coverage. | Minimal testing approach, risky untested branches. | Rare or no testing, uncertain if it even works. | Actively ignoring testing, purely YOLO approach. | Zero testing, unverified code likely won't run. |



⸻

04_TESTING_DEBUGGING.md — Testing & Debugging

1. Purpose & When to Use
	•	Goal: Systematically confirm correctness, find bugs, and fix them.
	•	When: After or during each feature implementation. Also used heavily before major milestones.

2. Detailed Steps & Best Practices
	1.	Write/Generate Tests: Unit tests, integration tests, or system tests.
	2.	Prompt for Debugging: Provide logs, error messages, or failing test details.
	3.	Ask for Explanations: Force the AI to explain likely root causes.
	4.	Iterate: Apply fixes, re-run tests, confirm resolution.
	5.	Keep a Testing Rubric: Evaluate coverage, clarity of test logic, etc.

3. Example Prompts

Prompt A: Unit Test Generation

```code
User Prompt:
We have an Express route for user signup in auth.js. 
Generate Mocha/Chai test cases that verify:
1) Successful signup with valid data
2) Error handling on invalid input
3) Password hashing is actually happening (bcrypt usage)
Show me a new file: test/auth.test.js
```

Prompt B: Debugging with Logs

```code
User Prompt:
We get an error:
"TypeError: Cannot read properties of undefined (reading 'user')"
in tasksController.js line 56.
Here's the relevant snippet: [paste snippet]

1) Explain why this error likely occurs.
2) Suggest a fix or rewrite the relevant code block.
3) Provide any additional debugging tips for verifying the solution.
```
4. Mini-Rubric for This Phase

| Category | A (Excellent) | B (Good) | C (Fair) | D (Needs Improvement) | E (Poor) | F (Fail) |
|----------|---------------|----------|----------|------------------------|----------|----------|
| Test Coverage | Comprehensive tests for all critical paths & edge cases. | Good coverage but some minor gaps. | Basic coverage, missing edge cases. | Major coverage gaps, critical features untested. | Very limited tests, ignoring many core functionalities. | No tests written at all. |
| Test Quality | Tests are clear, well-structured, meaningful assertions. | Generally good structure and clarity. | Some ambiguous or repetitive assertions. | Poorly written tests, not aligned with real scenarios. | Very weak or irrelevant test logic. | Tests are absent or nonsensical. |
| Debugging Effectiveness | Quickly pinpoints issues, thorough root-cause analysis. | Finds cause but might miss minor correlated issues. | Basic guesswork, might only fix symptoms. | Struggles to pinpoint or fix core issues. | Attempts are mostly guesswork without real solutions. | No progress or ignoring the presence of bugs. |
| Iteration & Verification | Iterative approach ensuring bug is truly resolved, re-tested. | Partial re-verification, might skip some checks. | Minimal re-tests, might leave potential regressions. | Rarely re-tests or checks entire system after fix. | Fixes are unverified, could break other parts. | No iteration; bug is left unfixed or unconfirmed. |



⸻

05_CODE_REVIEW_REFACTORING.md — Code Review & Refactoring

1. Purpose & When to Use
	•	Goal: Improve code structure, maintainability, and performance; ensure best practices.
	•	When: After a feature or milestone is complete, or any time the codebase feels unwieldy.

2. Detailed Steps & Best Practices
	1.	Prompt for Automated Code Review: Provide the AI with the relevant file or commit diff.
	2.	Focus on Specific Concerns: e.g. modularity, duplication, performance.
	3.	Rubric or Checklist: Evaluate each aspect, then refactor or accept suggestions.
	4.	Ensure Functionality Not Broken: Re-run tests after large refactors.

3. Example Prompts

Prompt A: Automated Code Review

```code
User Prompt:
Here is a diff of the newly implemented Slack integration code:
[diff snippet pasted]

Perform a thorough code review focusing on:
1) Potential performance issues
2) Clarity and maintainability
3) Security aspects (tokens, secrets)
Give me a bullet list of recommended changes.
```

Prompt B: Large-Scale Refactor

```code
User Prompt:
We need to refactor the tasks module for clarity and to reduce repetition. 
1) Identify repeated logic or patterns that can be extracted.
2) Propose a new module structure or a utility function approach.
3) Provide updated code to replace the old tasks module, with clear commit messages.

Ensure all existing tests for tasks module still pass.
```

4. Mini-Rubric for This Phase

| Category | A (Excellent) | B (Good) | C (Fair) | D (Needs Improvement) | E (Poor) | F (Fail) |
|----------|---------------|----------|----------|------------------------|----------|----------|
| Readability & Structure | Highly coherent, easy to follow, minimal duplication. | Mostly coherent, some minor duplication or suboptimal naming. | Adequate structure, noticeable repetition or partial confusion. | Significant confusion, frequent repetition, poor naming. | Very messy structure, high coupling, no naming conventions. | Zero readability or structure, effectively unmaintainable. |
| Performance Gains | Meaningful optimization or proven improvement (if needed). | Some beneficial tweaks, might miss minor optimizations. | Minor improvement, not thoroughly tested for performance. | Potential performance regressions or half-baked optimizations. | No performance consideration, or new code is slower. | Negative performance impact, or no approach to performance at all. |
| Best Practices Compliance | Aligns fully with recognized patterns, standards, style. | Largely compliant, with small style misses. | Some good practices but also some outdated/unusual patterns. | Overlooks multiple best practices. | Actively violates standard design patterns and coding style. | No concept of best practice; code is amateurish or chaotic. |
| Test Preservation | All tests pass, coverage remains good, no regressions. | Minor test breakages quickly fixed. | Some test disruptions, incomplete fix. | Breaks tests significantly; partial fixes only. | Unresolved or ignored failing tests. | All tests broken or none run; complete disregard for test status. |



⸻

06_FINAL_CHECKS_PERF_SECURITY_UX.md — Final Checks

1. Purpose & When to Use
	•	Goal: Perform thorough performance checks, security audits, and UX polish.
	•	When: Before release, or any major version bump. Typically after stable implementation & refactoring.

2. Detailed Steps & Best Practices
	1.	Performance Tuning: Use AI to analyze potential bottlenecks, load test scenarios.
	2.	Security Review: Check for data privacy, safe secrets handling, injection vulnerabilities.
	3.	UX Rubric: Evaluate design, accessibility, user flow, consistency.
	4.	Apply Fixes: Implement recommended improvements systematically.
	5.	Sign-off: Confirm readiness for deployment once these final checks are “A” or “B.”

3. Example Prompts

Prompt A: Performance Review

```code
User Prompt:
We need a performance audit of the entire Node.js backend. 
Our main concerns:
- DB queries efficiency
- Concurrency handling for large teams
- Slack notifications not slowing response times

1) Identify potential bottlenecks.
2) Recommend improvements (caching, indexes, queueing, etc.).
3) Provide sample code or config changes where relevant.
```

Prompt B: Security & UX Combined Review

```code
User Prompt:
Perform a combined final review focusing on:
1) Security vulnerabilities (injection, unvalidated inputs, exposed secrets)
2) UX flow from login to task completion
3) Overall accessibility compliance (WCAG basics)

Use a 6-category A–F rubric: 
(Sec-1, Sec-2), (UX-1, UX-2), (Acc-1, Acc-2)
Give separate grades and improvement steps for each category.
```

4. Mini-Rubric for This Phase

| Category | A (Excellent) | B (Good) | C (Fair) | D (Needs Improvement) | E (Poor) | F (Fail) |
|----------|---------------|----------|----------|------------------------|----------|----------|
| Performance Optimization | Thoroughly tested, stable under high load, minimal response times. | Mostly optimized, minor slowdowns possible. | Acceptable performance for average load, no formal stress test. | Noticeable lags or slow queries under moderate load. | Severe performance issues or likely to degrade heavily in real use. | Completely untested; system crashes or times out at moderate traffic. |
| Security Hardening | All known vulnerabilities mitigated, strong encryption, principle of least priv. | Good coverage, might miss some edge cases. | Basic security in place, lacking advanced measures (XSS filters, CSRF). | Visible security gaps or incomplete protections. | Potential major breach points or unsafe credential handling. | Security is nonexistent, open to trivial exploitation. |
| UX Flow & Accessibility | Highly intuitive design, consistent styling, fully accessible. | Smooth flow, with minor UI/UX or accessibility quirks. | UI is functional, average user might manage but not ideal. | Confusing flow in some areas, minimal accessibility considerations. | Major usability issues, e.g., illogical flows, no accessibility compliance. | Interface is chaotic, near unusable, no accessibility at all. |
| Overall Polish | Release-ready, tested thoroughly, no known blockers. | Nearly release-ready, small final touches needed. | Acceptable but with some rough edges that might affect user experience. | Feels somewhat incomplete or rough around the edges. | Lacks polish in multiple areas, not presentable for production. | Severely unfinished, not suitable for any public release. |



⸻

07_DEPLOYMENT_DOCUMENTATION_MAINTENANCE.md — Deployment, Documentation & Maintenance

1. Purpose & When to Use
	•	Goal: Move a stable product into production, generate final user docs, and plan ongoing iteration.
	•	When: After the system passes final checks. Ongoing maintenance uses similar prompts to fix bugs, add features.

2. Detailed Steps & Best Practices
	1.	Deploy: Provide environment details (Docker, cloud provider, CI/CD pipeline).
	2.	Generate Documentation: For end-users (user guides), plus developer docs (README, API references).
	3.	Plan Maintenance: Roadmap for future enhancements, known issues, technical debt.
	4.	Continue vibe coding for new features or urgent fixes—just cycle back to relevant sheets.

3. Example Prompts

Prompt A: Deployment & Env Setup

```code
User Prompt:
We're deploying on AWS Elastic Beanstalk with a Docker container. 
1) Generate a Dockerfile for our Node.js app with recommended best practices.
2) Show an AWS EB config file (if needed).
3) Outline the steps to push and verify the app in production.
```

Prompt B: Documentation Generation

```code
User Prompt:
Create a user-facing doc for our Task Manager:
1) Summarize features (task creation, assignment, Slack integration).
2) Include screenshots or placeholders, instructions for sign-up & usage.
3) Format in Markdown for a GitHub README.

Then create a separate doc for developers: describe folder structure, environment variables, deployment steps.
```
4. Mini-Rubric for This Phase

| Category | A (Excellent) | B (Good) | C (Fair) | D (Needs Improvement) | E (Poor) | F (Fail) |
|----------|---------------|----------|----------|------------------------|----------|----------|
| Deployment Reliability | Automated or well-documented, consistent environment & CI/CD. | Mostly stable deploy process, small manual steps. | Basic instructions, no robust CI/CD. | Fragile deployment or incomplete environment config. | Uncertain or failing deployments, no reproducibility. | No deployment plan or environment setup documented at all. |
| Documentation Completeness | Thorough user docs (features, usage) + dev docs (architecture, environment) | Good coverage, minor omissions in either user or dev docs. | Basic docs, missing some crucial details. | Disjointed docs, unclear instructions. | Very sparse or outdated docs, not practically useful. | Zero documentation, impossible for others to understand or use. |
| Maintenance & Roadmap | Clear plan for updates, backlog, known issues, iteration approach. | Some roadmap or backlog items noted. | Basic mention of possible improvements, no real backlog. | No real plan; future changes left ambiguous. | Maintenance is ignored, or no intention to fix known problems. | Project is effectively abandoned immediately upon release. |
| Production Quality | System is robust, logs errors, handles scale, stable user experience. | Works in production with minor known issues. | Acceptable for basic usage, but lacks advanced production readiness (monitoring, logs). | Possible partial breakages or poor monitoring. | Runs in production but in a precarious or ad-hoc manner. | No production environment set up or system can't handle real usage. |




That’s it! These Technical Specification Sheets can be refined or expanded to meet your specific domain (e.g., mobile apps, data science pipelines, etc.). They’re meant to keep your vibe coding sessions on track from Project Initiation to Deployment & Beyond, with strong guidance, example prompts, and rubrics at each step.