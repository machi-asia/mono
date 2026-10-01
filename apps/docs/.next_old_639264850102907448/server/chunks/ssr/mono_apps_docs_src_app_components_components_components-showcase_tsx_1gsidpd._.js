module.exports=[52043,a=>{"use strict";var b=a.i(9473);a.i(19919);var c=a.i(35565),d=a.i(82702),e=a.i(23081),f=a.i(66059),g=a.i(32794),h=a.i(24656),i=a.i(88393),j=a.i(4711),k=a.i(3451),l=a.i(90543),m=a.i(63783),n=a.i(42266),o=a.i(73042),p=a.i(55167),q=a.i(48985),r=a.i(13735),s=a.i(11705),t=a.i(74761);let u=["mono/components","mono/auth","mono/database","mono/rose"],v=[{label:"true",value:"true"},{label:"false",value:"false"}];function w(){let{resolvedTheme:a,setTheme:c}=(0,t.useTheme)();return(0,b.jsxs)("div",{className:"components-demo-theme",children:[(0,b.jsxs)("p",{children:["Resolved theme: ",(0,b.jsx)("strong",{children:a})]}),(0,b.jsx)("button",{type:"button",onClick:()=>c("dark"===a?"light":"dark"),children:"Toggle theme"})]})}let x=["flex-start","center","flex-end"],y=["flex-start","center","space-between"],z=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Cherry",value:"cherry"}],A=[{title:"What is Machi Asia?",content:"Machi Asia is a platform for building and deploying AI-powered products."},{title:"How do I get started?",content:"Sign in as a guest or create an account, then explore the documentation."},{title:"Is it free?",content:"The core platform is free to use. Premium features may require a subscription."}],B=[{id:"1",url:"https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/hero-banner.png",name:"hero-banner.png",type:"image",size:245e3,createdAt:"2026-09-02T10:00:00Z"},{id:"2",url:"https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/project-spec.pdf",name:"project-spec.pdf",type:"pdf",size:142e4,createdAt:"2026-09-03T08:30:00Z"},{id:"3",url:"https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/contract-v2.docx",name:"contract-v2.docx",type:"docx",size:84e3,createdAt:"2026-09-03T09:15:00Z"},{id:"4",url:"https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/brand-assets.png",name:"brand-assets.png",type:"image",size:52e4,createdAt:"2026-09-03T11:45:00Z"},{id:"5",url:"https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/annual-report.pdf",name:"annual-report.pdf",type:"pdf",size:312e4,createdAt:"2026-09-03T12:00:00Z"}],C={full:`# Obsidian Knowledge Note

This is an authentic Obsidian-flavored markdown document. Check out the [[Design System]] or visit [[Architecture|System Architecture]] for more.

Categorized under #knowledge/obsidian and #frontend/components.

> [!tip] Quick Pro Tip
> Obsidian callouts support custom titles and automatic icon selection based on callout types!

> [!warning]- Foldable Callout (Click to Expand)
> This warning is collapsed by default using the \`> [!warning]-\` syntax.
> It can contain nested details, code blocks, or links!

### Project Goals
- [x] Integrate Obsidian callouts with Lucide icons
- [x] Support [[Wikilinks]] and #tags
- [x] Add ==highlighted text== and ~~strikethrough~~
- [ ] Connect bi-directional graph view

Here is a code sample with language badge and one-click copy:
\`\`\`typescript
interface Note {
  title: string;
  tags: string[];
}
\`\`\`

| Feature | Supported | Notes |
| --- | --- | --- |
| Callouts | Yes | Note, Tip, Warning, Danger, Info |
| Wikilinks | Yes | Both [[Link]] and [[Link\\|Alias]] |
| Task List | Yes | Interactive checkboxes |
`,callouts:`# Callouts Gallery

> [!note] Standard Note
> Useful background information and notes.

> [!tip] Helpful Tip
> Pro-tips and best practices for writing clean markdown.

> [!info] Information
> General announcements and informational messages.

> [!warning] Caution Required
> Warning regarding non-backward compatible modifications.

> [!danger] Destructive Action
> Irreversible changes or data loss hazards.

> [!example] Code Example
> Walkthrough of a practical code snippet.

> [!todo] Action Item
> Tasks that require immediate follow-up.

> [!success] Verified Done
> All automated tests and quality checks passed!
`,tasks:`# Task List & Tags

Track items with interactive checkboxes and tag taxonomy.

- [x] Set up Next.js monorepo architecture
- [x] Add Supabase authentication with guest access
- [x] Build shared component library
- [ ] Implement Obsidian markdown renderer
- [ ] Launch production app

Tagged under: #roadmap/2026 #sprint/active #release/ready
`,wikilinks:`# Obsidian Interlinking

Connect notes seamlessly using Obsidian's double bracket syntax:

- Read the overview at [[Project Overview]]
- Deep dive into [[Architecture|Monorepo Architecture Documentation]]
- Component showcase: [[Components/Showcase|Component Library Showcase]]

Also highlights ==crucial terms== and ~~outdated procedures~~!
`};a.s(["ComponentsShowcase",0,function(){return(0,b.jsx)(c.ComponentShowcase,{packageName:"mono/components",description:"Shared UI component library: the design-token theme system, layout primitives, and functional elements that every page must build on.",components:[{name:"ComponentShowcase",uses:'import { ComponentShowcase } from "@mono/components"',description:"The reusable list-view layout that every package showcase page uses.",propControls:[{prop:"packageName",label:"packageName prop",options:u,defaultValue:"mono/components"}],render:({packageName:a})=>(0,b.jsx)(c.ComponentShowcase,{packageName:a,description:"Living proof this item renders the real ComponentShowcase with the chosen packageName.",components:[{name:"Demo component",description:"A nested showcase demonstrating the packageName dropdown above.",render:()=>(0,b.jsxs)("p",{children:["Rendered as part of @",a,"."]})}]})},{name:"ThemeProvider",uses:'import { ThemeProvider } from "@mono/components"',description:"Wraps next-themes to enable theme switching with dark mode as default and gold accents.",propControls:[{prop:"defaultTheme",label:"defaultTheme prop",options:["dark","light","system"],defaultValue:"dark"}],render:({defaultTheme:a})=>(0,b.jsx)(e.ThemeProvider,{defaultTheme:a,children:(0,b.jsx)(w,{})})},{name:"Row",uses:'import { Row, Col } from "@mono/components"',description:"Flex row layout primitive. Controls horizontal arrangement, wrap, alignment, and gutter.",propControls:[{prop:"align",label:"align",options:x,defaultValue:"center"},{prop:"justify",label:"justify",options:y,defaultValue:"space-between"},{prop:"wrap",label:"wrap",options:v,defaultValue:"true"}],render:({align:a,justify:c,wrap:e})=>(0,b.jsxs)(d.Row,{align:a,justify:c,wrap:"true"===e,children:[(0,b.jsx)(d.Card,{padded:!1,className:"components-demo-box",as:"div",children:"A"}),(0,b.jsx)(d.Card,{padded:!1,className:"components-demo-box",as:"div",children:"B"}),(0,b.jsx)(d.Card,{padded:!1,className:"components-demo-box",as:"div",children:"C"})]})},{name:"Col",uses:'import { Col } from "@mono/components"',description:"Grid column primitive. Takes a span (1-12) and optional offset for 12-column layouts.",propControls:[{prop:"span",label:"span",options:["4","6","8","12"],defaultValue:"6"}],render:({span:a})=>(0,b.jsxs)(d.Row,{children:[(0,b.jsx)(d.Col,{span:Number(a),children:(0,b.jsxs)(d.Card,{className:"components-demo-box",as:"div",children:["span ",a]})}),(0,b.jsx)(d.Col,{span:12-Number(a),children:(0,b.jsxs)(d.Card,{className:"components-demo-box",as:"div",children:["span ",12-Number(a)]})})]})},{name:"Card",uses:'import { Card } from "@mono/components"',description:"Surface container with token-styled border, padding, and elevation variants.",propControls:[{prop:"elevated",label:"elevated",options:v,defaultValue:"false"},{prop:"bordered",label:"bordered",options:v,defaultValue:"true"},{prop:"padded",label:"padded",options:v,defaultValue:"true"}],render:({elevated:a,bordered:c,padded:e})=>(0,b.jsx)("div",{className:"components-demo-card-wrap",children:(0,b.jsx)(d.Card,{elevated:"true"===a,bordered:"true"===c,padded:"true"===e,children:"A token-styled card surface."})})},{name:"Button",uses:'import { Button } from "@mono/components"',description:"Action button with variant, size, and loading state support.",propControls:[{prop:"variant",label:"variant",options:["primary","secondary","ghost","danger"],defaultValue:"primary"},{prop:"size",label:"size",options:["sm","md","lg"],defaultValue:"md"},{prop:"disabled",label:"disabled",options:v,defaultValue:"false"}],render:({variant:a,size:c,disabled:d})=>(0,b.jsx)(f.Button,{variant:a,size:c,disabled:"true"===d,children:"Click me"})},{name:"Link",uses:'import { Link } from "@mono/components"',description:"Styled anchor with variant and external link support.",propControls:[{prop:"variant",label:"variant",options:["default","underline","ghost"],defaultValue:"default"},{prop:"external",label:"external",options:v,defaultValue:"false"}],render:({variant:a,external:c})=>(0,b.jsx)(g.Link,{href:"#",variant:a,external:"true"===c,children:"Navigate somewhere"})},{name:"Tooltip",uses:'import { Tooltip } from "@mono/components"',description:"Hover/focus tooltip that appears near the trigger element or circular help button.",propControls:[{prop:"variant",label:"variant",options:["default","help"],defaultValue:"default"},{prop:"position",label:"position",options:["top","bottom","left","right"],defaultValue:"top"}],render:({variant:a,position:c})=>"help"===a?(0,b.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"8px"},children:[(0,b.jsx)("span",{style:{fontSize:"0.85rem",color:"var(--color-text-muted)"},children:"Usage Tier: Authenticated"}),(0,b.jsx)(h.Tooltip,{variant:"help",content:"Tier limits: 20 msgs/day, 200/week",position:c,triggerAriaLabel:"View tier details"})]}):(0,b.jsx)(h.Tooltip,{content:"Helpful hint",position:c,children:(0,b.jsx)(f.Button,{variant:"secondary",size:"sm",children:"Hover me"})})},{name:"Dropdown",uses:'import { Dropdown } from "@mono/components"',description:"Custom select dropdown with keyboard support and disabled items.",propControls:[{prop:"disabled",label:"disabled",options:v,defaultValue:"false"}],render:({disabled:a})=>(0,b.jsx)(i.Dropdown,{items:z,placeholder:"Pick a fruit...",disabled:"true"===a})},{name:"Accordion",uses:'import { Accordion } from "@mono/components"',description:"Collapsible content sections supporting single or multiple open panels.",propControls:[{prop:"multiple",label:"multiple",options:v,defaultValue:"false"}],render:({multiple:a})=>(0,b.jsx)(j.Accordion,{items:A,multiple:"true"===a,defaultOpen:[0]})},{name:"Popup",uses:'import { Popup } from "@mono/components"',description:"Floating content panel that appears when clicking a trigger element.",propControls:[{prop:"position",label:"position",options:["top","bottom","left","right"],defaultValue:"bottom"}],render:({position:a})=>(0,b.jsx)(k.Popup,{trigger:(0,b.jsx)(f.Button,{variant:"secondary",size:"sm",children:"Open popup"}),position:a,children:(0,b.jsxs)("div",{style:{padding:"0.5rem"},children:[(0,b.jsx)("strong",{children:"Popup content"}),(0,b.jsx)("p",{style:{margin:"0.5rem 0 0",fontSize:"0.85rem"},children:"Click outside to close."})]})})},{name:"DatePicker",uses:'import { DatePicker } from "@mono/components"',description:"Calendar date picker with month navigation and min/max range support.",render:()=>(0,b.jsx)(l.DatePicker,{value:"2026-09-03",onChange:()=>{}})},{name:"TimePicker",uses:'import { TimePicker } from "@mono/components"',description:"Increment/decrement time picker with 12h/24h mode support.",propControls:[{prop:"use24Hour",label:"use24Hour",options:v,defaultValue:"false"}],render:({use24Hour:a})=>(0,b.jsx)(m.TimePicker,{value:"14:30",use24Hour:"true"===a})},{name:"Navbar",uses:'import { Navbar } from "@mono/components"',description:"Top navigation bar with brand, links, action slots, and an optional auth menu showing avatar, name, and sign-out.",propControls:[{prop:"variant",label:"variant",options:["default","tabs","compact"],defaultValue:"default"},{prop:"showAuth",label:"auth",options:v,defaultValue:"true"}],render:({variant:a,showAuth:c})=>(0,b.jsx)(n.Navbar,{variant:a,brand:(0,b.jsx)("span",{children:"Machi Asia"}),links:[{label:"Home",href:"/",active:!0},{label:"Docs",href:"/docs"},{label:"Blog",href:"/blog"}],actions:(0,b.jsx)(f.Button,{variant:"primary",size:"sm",children:"Sign in"}),auth:"true"===c?{name:"Jane Doe",onSignOut:()=>{}}:void 0})},{name:"Footer",uses:'import { Footer } from "@mono/components"',description:"Site footer with links and copyright.",render:()=>(0,b.jsx)(o.Footer,{links:[{label:"Privacy",href:"/privacy"},{label:"Terms",href:"/terms"},{label:"Contact",href:"/contact"}],copyright:"2026 Machi Asia. All rights reserved."})},{name:"TextEditor",uses:'import { TextEditor } from "@mono/components"',description:"Basic rich text editor with bold, italic, underline, and list formatting.",render:()=>(0,b.jsx)(p.TextEditor,{placeholder:"Write something..."})},{name:"MediaLibrary",uses:'import { MediaLibrary } from "@mono/components"',description:"Database-connected media browser with user-scoped private library, image/pdf/docx filtering, pagination, inspection modal with quick-copy public link, and delete capabilities.",propControls:[{prop:"initialFilter",label:"filter",options:["all","image","pdf","docx"],defaultValue:"all"},{prop:"pageSize",label:"pageSize",options:["2","4","6","12"],defaultValue:"4"}],render:({initialFilter:a,pageSize:c})=>(0,b.jsx)(q.MediaLibrary,{items:B,initialFilter:a,pageSize:Number(c)||4,onSelect:()=>{}})},{name:"MarkdownRenderer",uses:'import { MarkdownRenderer } from "@mono/components"',description:"Obsidian-flavored Markdown renderer supporting callouts/admonitions with icons, wikilinks, tags, task lists, code blocks with copy, highlights, tables, and footnotes.",propControls:[{prop:"preset",label:"sample note",options:["full","callouts","tasks","wikilinks"],defaultValue:"full"}],render:({preset:a})=>(0,b.jsx)("div",{style:{padding:"1rem",background:"var(--color-surface)",borderRadius:"var(--radius-sm)",border:"1px solid var(--color-border)"},children:(0,b.jsx)(r.MarkdownRenderer,{content:C[a||"full"]||C.full,onWikilinkClick:(a,b)=>alert(`Wikilink clicked: ${a} (${b})`),onTagClick:a=>alert(`Tag clicked: #${a}`),onTaskToggle:(a,b)=>alert(`Task toggled: "${a}" => ${b?"checked":"unchecked"}`)})})},{name:"Usage",uses:'import { Usage } from "@mono/components"',description:"Resource usage tracker with color-coded status thresholds (normal, warning, danger, exceeded), formatted numbers, and progress bar.",propControls:[{prop:"level",label:"usage level",options:["normal (45%)","warning (80%)","danger (95%)","exceeded (115%)"],defaultValue:"normal (45%)"},{prop:"size",label:"size",options:["sm","md","lg"],defaultValue:"md"}],render:({level:a,size:c})=>(0,b.jsx)("div",{style:{maxWidth:460,width:"100%"},children:(0,b.jsx)(s.Usage,{label:"Monthly Bandwidth",used:{"normal (45%)":45,"warning (80%)":80,"danger (95%)":95,"exceeded (115%)":115}[a||"normal (45%)"]??45,total:100,unit:"GB",size:c||"md",description:"Resets at the start of next billing period."})})}]})}])}];

//# sourceMappingURL=mono_apps_docs_src_app_components_components_components-showcase_tsx_1gsidpd._.js.map