"use client";

import { ComponentShowcase, Card, Col, Row, ThemeProvider } from "@mono/components";
import { useTheme } from "next-themes";
import "./components-demo.css";

const packageOptions = ["mono/components", "mono/auth", "mono/database"];
const boolOptions = [
  { label: "true", value: "true" },
  { label: "false", value: "false" },
];

function ThemeToggleDemo() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <div className="components-demo-theme">
      <p>
        Resolved theme: <strong>{resolvedTheme}</strong>
      </p>
      <button type="button" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
        Toggle theme
      </button>
    </div>
  );
}

const alignOptions = ["flex-start", "center", "flex-end"];
const justifyOptions = ["flex-start", "center", "space-between"];

export function ComponentsShowcase() {
  return (
    <ComponentShowcase
      packageName="mono/components"
      description="Shared UI component library: the design-token theme system and the layout primitives (Row, Col, Card) that every page must build on. Each component below is rendered live with a dropdown per choice/enum prop."
      components={[
        {
          name: "ComponentShowcase",
          uses: 'import { ComponentShowcase } from "@mono/components"',
          description:
            "The reusable list-view layout that every package showcase page uses. Takes a packageName, an optional description, and a list of components. Each item can declare propControls (one dropdown per prop) and a render(values) function that returns the live component demo.",
          propControls: [
            {
              prop: "packageName",
              label: "packageName prop",
              options: packageOptions,
              defaultValue: "mono/components",
            },
          ],
          render: ({ packageName }) => (
            <ComponentShowcase
              packageName={packageName}
              description="Living proof this item renders the real ComponentShowcase with the chosen packageName."
              components={[
                {
                  name: "Demo component",
                  description: "A nested showcase demonstrating the packageName dropdown above.",
                  render: () => <p>Rendered as part of @{packageName}.</p>,
                },
              ]}
            />
          ),
        },
        {
          name: "ThemeProvider",
          uses: 'import { ThemeProvider } from "@mono/components"',
          description:
            "Wraps next-themes to enable theme switching. Uses dark mode as the default with gold accents; a light variant is derived from the same design tokens. Uses the class attribute and supports the system preference.",
          propControls: [
            {
              prop: "defaultTheme",
              label: "defaultTheme prop",
              options: ["dark", "light", "system"],
              defaultValue: "dark",
            },
          ],
          render: ({ defaultTheme }) => (
            <ThemeProvider defaultTheme={defaultTheme as "dark" | "light" | "system"}>
              <ThemeToggleDemo />
            </ThemeProvider>
          ),
        },
        {
          name: "Row",
          uses: 'import { Row, Col } from "@mono/components"',
          description:
            "Flex row layout primitive from the shared package. Controls the horizontal arrangement, wrap, alignment, and gutter of its children (typically Col).",
          propControls: [
            { prop: "align", label: "align", options: alignOptions, defaultValue: "center" },
            { prop: "justify", label: "justify", options: justifyOptions, defaultValue: "space-between" },
            { prop: "wrap", label: "wrap", options: boolOptions, defaultValue: "true" },
          ],
          render: ({ align, justify, wrap }) => (
            <Row
              align={align as never}
              justify={justify as never}
              wrap={wrap === "true"}
              data-testid="row-demo"
            >
              <Card padded={false} className="components-demo-box" as="div">A</Card>
              <Card padded={false} className="components-demo-box" as="div">B</Card>
              <Card padded={false} className="components-demo-box" as="div">C</Card>
            </Row>
          ),
        },
        {
          name: "Col",
          uses: 'import { Col } from "@mono/components"',
          description:
            "Grid column primitive from the shared package. Takes a span (1-12) and optional offset to size it as a fraction of a 12-column row.",
          propControls: [
            { prop: "span", label: "span", options: ["4", "6", "8", "12"], defaultValue: "6" },
          ],
          render: ({ span }) => (
            <Row>
              <Col span={Number(span)} data-testid="col-demo">
                <Card className="components-demo-box" as="div">span {span}</Card>
              </Col>
              <Col span={12 - Number(span)}>
                <Card className="components-demo-box" as="div">span {12 - Number(span)}</Card>
              </Col>
            </Row>
          ),
        },
        {
          name: "Card",
          uses: 'import { Card } from "@mono/components"',
          description:
            "Surface container from the shared package. Renders a token-styled panel with a border and padding by default; can be elevated or have its border/padding removed.",
          propControls: [
            { prop: "elevated", label: "elevated", options: boolOptions, defaultValue: "false" },
            { prop: "bordered", label: "bordered", options: boolOptions, defaultValue: "true" },
            { prop: "padded", label: "padded", options: boolOptions, defaultValue: "true" },
          ],
          render: ({ elevated, bordered, padded }) => (
            <div className="components-demo-card-wrap">
              <Card
                elevated={elevated === "true"}
                bordered={bordered === "true"}
                padded={padded === "true"}
                data-testid="card-demo"
              >
                A token-styled card surface.
              </Card>
            </div>
          ),
        },
      ]}
    />
  );
}
