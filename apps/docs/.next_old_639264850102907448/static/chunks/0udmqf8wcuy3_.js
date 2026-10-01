(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,54438,e=>{"use strict";var o=e.i(85040);e.i(63091);var t=e.i(19799),a=e.i(51957),n=e.i(44054),r=e.i(68003),i=e.i(6430),s=e.i(19721),l=e.i(87925),d=e.i(28341),p=e.i(52105),c=e.i(58463),m=e.i(92626),u=e.i(35447),h=e.i(42871),g=e.i(31395),b=e.i(3717),f=e.i(50774),k=e.i(59710),v=e.i(28852);let x=["mono/components","mono/auth","mono/database","mono/rose"],w=[{label:"true",value:"true"},{label:"false",value:"false"}];function y(){let{resolvedTheme:e,setTheme:t}=(0,v.useTheme)();return(0,o.jsxs)("div",{className:"components-demo-theme",children:[(0,o.jsxs)("p",{children:["Resolved theme: ",(0,o.jsx)("strong",{children:e})]}),(0,o.jsx)("button",{type:"button",onClick:()=>t("dark"===e?"light":"dark"),children:"Toggle theme"})]})}let C=["flex-start","center","flex-end"],j=["flex-start","center","space-between"],T=[{label:"Apple",value:"apple"},{label:"Banana",value:"banana"},{label:"Cherry",value:"cherry"}],A=[{title:"What is Machi Asia?",content:"Machi Asia is a platform for building and deploying AI-powered products."},{title:"How do I get started?",content:"Sign in as a guest or create an account, then explore the documentation."},{title:"Is it free?",content:"The core platform is free to use. Premium features may require a subscription."}],z=[{id:"1",url:"https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/hero-banner.png",name:"hero-banner.png",type:"image",size:245e3,createdAt:"2026-09-02T10:00:00Z"},{id:"2",url:"https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/project-spec.pdf",name:"project-spec.pdf",type:"pdf",size:142e4,createdAt:"2026-09-03T08:30:00Z"},{id:"3",url:"https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/contract-v2.docx",name:"contract-v2.docx",type:"docx",size:84e3,createdAt:"2026-09-03T09:15:00Z"},{id:"4",url:"https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/brand-assets.png",name:"brand-assets.png",type:"image",size:52e4,createdAt:"2026-09-03T11:45:00Z"},{id:"5",url:"https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/annual-report.pdf",name:"annual-report.pdf",type:"pdf",size:312e4,createdAt:"2026-09-03T12:00:00Z"}],S={full:`# Obsidian Knowledge Note

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
`};e.s(["ComponentsShowcase",0,function(){return(0,o.jsx)(t.ComponentShowcase,{packageName:"mono/components",description:"Shared UI component library: the design-token theme system, layout primitives, and functional elements that every page must build on.",components:[{name:"ComponentShowcase",uses:'import { ComponentShowcase } from "@mono/components"',description:"The reusable list-view layout that every package showcase page uses.",propControls:[{prop:"packageName",label:"packageName prop",options:x,defaultValue:"mono/components"}],render:({packageName:e})=>(0,o.jsx)(t.ComponentShowcase,{packageName:e,description:"Living proof this item renders the real ComponentShowcase with the chosen packageName.",components:[{name:"Demo component",description:"A nested showcase demonstrating the packageName dropdown above.",render:()=>(0,o.jsxs)("p",{children:["Rendered as part of @",e,"."]})}]})},{name:"ThemeProvider",uses:'import { ThemeProvider } from "@mono/components"',description:"Wraps next-themes to enable theme switching with dark mode as default and gold accents.",propControls:[{prop:"defaultTheme",label:"defaultTheme prop",options:["dark","light","system"],defaultValue:"dark"}],render:({defaultTheme:e})=>(0,o.jsx)(n.ThemeProvider,{defaultTheme:e,children:(0,o.jsx)(y,{})})},{name:"Row",uses:'import { Row, Col } from "@mono/components"',description:"Flex row layout primitive. Controls horizontal arrangement, wrap, alignment, and gutter.",propControls:[{prop:"align",label:"align",options:C,defaultValue:"center"},{prop:"justify",label:"justify",options:j,defaultValue:"space-between"},{prop:"wrap",label:"wrap",options:w,defaultValue:"true"}],render:({align:e,justify:t,wrap:n})=>(0,o.jsxs)(a.Row,{align:e,justify:t,wrap:"true"===n,children:[(0,o.jsx)(a.Card,{padded:!1,className:"components-demo-box",as:"div",children:"A"}),(0,o.jsx)(a.Card,{padded:!1,className:"components-demo-box",as:"div",children:"B"}),(0,o.jsx)(a.Card,{padded:!1,className:"components-demo-box",as:"div",children:"C"})]})},{name:"Col",uses:'import { Col } from "@mono/components"',description:"Grid column primitive. Takes a span (1-12) and optional offset for 12-column layouts.",propControls:[{prop:"span",label:"span",options:["4","6","8","12"],defaultValue:"6"}],render:({span:e})=>(0,o.jsxs)(a.Row,{children:[(0,o.jsx)(a.Col,{span:Number(e),children:(0,o.jsxs)(a.Card,{className:"components-demo-box",as:"div",children:["span ",e]})}),(0,o.jsx)(a.Col,{span:12-Number(e),children:(0,o.jsxs)(a.Card,{className:"components-demo-box",as:"div",children:["span ",12-Number(e)]})})]})},{name:"Card",uses:'import { Card } from "@mono/components"',description:"Surface container with token-styled border, padding, and elevation variants.",propControls:[{prop:"elevated",label:"elevated",options:w,defaultValue:"false"},{prop:"bordered",label:"bordered",options:w,defaultValue:"true"},{prop:"padded",label:"padded",options:w,defaultValue:"true"}],render:({elevated:e,bordered:t,padded:n})=>(0,o.jsx)("div",{className:"components-demo-card-wrap",children:(0,o.jsx)(a.Card,{elevated:"true"===e,bordered:"true"===t,padded:"true"===n,children:"A token-styled card surface."})})},{name:"Button",uses:'import { Button } from "@mono/components"',description:"Action button with variant, size, and loading state support.",propControls:[{prop:"variant",label:"variant",options:["primary","secondary","ghost","danger"],defaultValue:"primary"},{prop:"size",label:"size",options:["sm","md","lg"],defaultValue:"md"},{prop:"disabled",label:"disabled",options:w,defaultValue:"false"}],render:({variant:e,size:t,disabled:a})=>(0,o.jsx)(r.Button,{variant:e,size:t,disabled:"true"===a,children:"Click me"})},{name:"Link",uses:'import { Link } from "@mono/components"',description:"Styled anchor with variant and external link support.",propControls:[{prop:"variant",label:"variant",options:["default","underline","ghost"],defaultValue:"default"},{prop:"external",label:"external",options:w,defaultValue:"false"}],render:({variant:e,external:t})=>(0,o.jsx)(i.Link,{href:"#",variant:e,external:"true"===t,children:"Navigate somewhere"})},{name:"Tooltip",uses:'import { Tooltip } from "@mono/components"',description:"Hover/focus tooltip that appears near the trigger element or circular help button.",propControls:[{prop:"variant",label:"variant",options:["default","help"],defaultValue:"default"},{prop:"position",label:"position",options:["top","bottom","left","right"],defaultValue:"top"}],render:({variant:e,position:t})=>"help"===e?(0,o.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"8px"},children:[(0,o.jsx)("span",{style:{fontSize:"0.85rem",color:"var(--color-text-muted)"},children:"Usage Tier: Authenticated"}),(0,o.jsx)(s.Tooltip,{variant:"help",content:"Tier limits: 20 msgs/day, 200/week",position:t,triggerAriaLabel:"View tier details"})]}):(0,o.jsx)(s.Tooltip,{content:"Helpful hint",position:t,children:(0,o.jsx)(r.Button,{variant:"secondary",size:"sm",children:"Hover me"})})},{name:"Dropdown",uses:'import { Dropdown } from "@mono/components"',description:"Custom select dropdown with keyboard support and disabled items.",propControls:[{prop:"disabled",label:"disabled",options:w,defaultValue:"false"}],render:({disabled:e})=>(0,o.jsx)(l.Dropdown,{items:T,placeholder:"Pick a fruit...",disabled:"true"===e})},{name:"Accordion",uses:'import { Accordion } from "@mono/components"',description:"Collapsible content sections supporting single or multiple open panels.",propControls:[{prop:"multiple",label:"multiple",options:w,defaultValue:"false"}],render:({multiple:e})=>(0,o.jsx)(d.Accordion,{items:A,multiple:"true"===e,defaultOpen:[0]})},{name:"Popup",uses:'import { Popup } from "@mono/components"',description:"Floating content panel that appears when clicking a trigger element.",propControls:[{prop:"position",label:"position",options:["top","bottom","left","right"],defaultValue:"bottom"}],render:({position:e})=>(0,o.jsx)(p.Popup,{trigger:(0,o.jsx)(r.Button,{variant:"secondary",size:"sm",children:"Open popup"}),position:e,children:(0,o.jsxs)("div",{style:{padding:"0.5rem"},children:[(0,o.jsx)("strong",{children:"Popup content"}),(0,o.jsx)("p",{style:{margin:"0.5rem 0 0",fontSize:"0.85rem"},children:"Click outside to close."})]})})},{name:"DatePicker",uses:'import { DatePicker } from "@mono/components"',description:"Calendar date picker with month navigation and min/max range support.",render:()=>(0,o.jsx)(c.DatePicker,{value:"2026-09-03",onChange:()=>{}})},{name:"TimePicker",uses:'import { TimePicker } from "@mono/components"',description:"Increment/decrement time picker with 12h/24h mode support.",propControls:[{prop:"use24Hour",label:"use24Hour",options:w,defaultValue:"false"}],render:({use24Hour:e})=>(0,o.jsx)(m.TimePicker,{value:"14:30",use24Hour:"true"===e})},{name:"Navbar",uses:'import { Navbar } from "@mono/components"',description:"Top navigation bar with brand, links, action slots, and an optional auth menu showing avatar, name, and sign-out.",propControls:[{prop:"variant",label:"variant",options:["default","tabs","compact"],defaultValue:"default"},{prop:"showAuth",label:"auth",options:w,defaultValue:"true"}],render:({variant:e,showAuth:t})=>(0,o.jsx)(u.Navbar,{variant:e,brand:(0,o.jsx)("span",{children:"Machi Asia"}),links:[{label:"Home",href:"/",active:!0},{label:"Docs",href:"/docs"},{label:"Blog",href:"/blog"}],actions:(0,o.jsx)(r.Button,{variant:"primary",size:"sm",children:"Sign in"}),auth:"true"===t?{name:"Jane Doe",onSignOut:()=>{}}:void 0})},{name:"Footer",uses:'import { Footer } from "@mono/components"',description:"Site footer with links and copyright.",render:()=>(0,o.jsx)(h.Footer,{links:[{label:"Privacy",href:"/privacy"},{label:"Terms",href:"/terms"},{label:"Contact",href:"/contact"}],copyright:"2026 Machi Asia. All rights reserved."})},{name:"TextEditor",uses:'import { TextEditor } from "@mono/components"',description:"Basic rich text editor with bold, italic, underline, and list formatting.",render:()=>(0,o.jsx)(g.TextEditor,{placeholder:"Write something..."})},{name:"MediaLibrary",uses:'import { MediaLibrary } from "@mono/components"',description:"Database-connected media browser with user-scoped private library, image/pdf/docx filtering, pagination, inspection modal with quick-copy public link, and delete capabilities.",propControls:[{prop:"initialFilter",label:"filter",options:["all","image","pdf","docx"],defaultValue:"all"},{prop:"pageSize",label:"pageSize",options:["2","4","6","12"],defaultValue:"4"}],render:({initialFilter:e,pageSize:t})=>(0,o.jsx)(b.MediaLibrary,{items:z,initialFilter:e,pageSize:Number(t)||4,onSelect:()=>{}})},{name:"MarkdownRenderer",uses:'import { MarkdownRenderer } from "@mono/components"',description:"Obsidian-flavored Markdown renderer supporting callouts/admonitions with icons, wikilinks, tags, task lists, code blocks with copy, highlights, tables, and footnotes.",propControls:[{prop:"preset",label:"sample note",options:["full","callouts","tasks","wikilinks"],defaultValue:"full"}],render:({preset:e})=>(0,o.jsx)("div",{style:{padding:"1rem",background:"var(--color-surface)",borderRadius:"var(--radius-sm)",border:"1px solid var(--color-border)"},children:(0,o.jsx)(f.MarkdownRenderer,{content:S[e||"full"]||S.full,onWikilinkClick:(e,o)=>alert(`Wikilink clicked: ${e} (${o})`),onTagClick:e=>alert(`Tag clicked: #${e}`),onTaskToggle:(e,o)=>alert(`Task toggled: "${e}" => ${o?"checked":"unchecked"}`)})})},{name:"Usage",uses:'import { Usage } from "@mono/components"',description:"Resource usage tracker with color-coded status thresholds (normal, warning, danger, exceeded), formatted numbers, and progress bar.",propControls:[{prop:"level",label:"usage level",options:["normal (45%)","warning (80%)","danger (95%)","exceeded (115%)"],defaultValue:"normal (45%)"},{prop:"size",label:"size",options:["sm","md","lg"],defaultValue:"md"}],render:({level:e,size:t})=>(0,o.jsx)("div",{style:{maxWidth:460,width:"100%"},children:(0,o.jsx)(k.Usage,{label:"Monthly Bandwidth",used:{"normal (45%)":45,"warning (80%)":80,"danger (95%)":95,"exceeded (115%)":115}[e||"normal (45%)"]??45,total:100,unit:"GB",size:t||"md",description:"Resets at the start of next billing period."})})}]})}])}]);