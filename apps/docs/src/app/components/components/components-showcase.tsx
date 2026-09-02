"use client";

import { ComponentShowcase } from "@mono/components";

const packageOptions = ["mono/components", "mono/auth", "mono/database"];

export function ComponentsShowcase() {
  return (
    <ComponentShowcase
      packageName="mono/components"
      description="Shared UI component library. This package is also the source of the shared listing layout used on every showcase page. The component below is rendered live; its packageName prop has a dropdown so you can see the layout react to different inputs."
      components={[
        {
          name: "ComponentShowcase",
          uses: 'import { ComponentShowcase } from "@mono/components"',
          description:
            "The reusable list-view layout that every package showcase page uses. Takes a packageName, an optional description, and a list of components. Each item can declare propControls (one dropdown per prop) and a render(values) function that returns the live component demo. Selecting a dropdown value calls render with the new values.",
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
      ]}
    />
  );
}
